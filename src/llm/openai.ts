import OpenAIAPI from 'openai';
import { v4 } from 'uuid';

import { BaseLLM } from "./base";
import { Agent } from "../agents";
import {
  LLMProvider,
  OpenAIOptions,
  Message,
  MessageInput,
  ToolUseBlock,
  OnTool,
  UsageBlock,
  ErrorBlock,
  DeltaBlock
} from "../types";
import {
  ChatCompletionContentPart,
  ChatCompletionContentPartText,
  ChatCompletionContentPartImage,
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
} from 'openai/resources';
import { ToolInputDelta } from '../types';


/**
 * A more complete implementation of the OpenAI-based LLM,
 * mirroring the structure and patterns found in the Anthropic class.
 */
export class OpenAI extends BaseLLM<LLMProvider.OpenAI, OpenAIOptions> {
  protected agent: Agent;
  private onTool?: OnTool;
  private openai: OpenAIAPI;
  private MAX_RETRIES = 10;
  private RETRY_DELAY = 3000; // 3 seconds

  public cache = {
    toolInput: null as ToolUseBlock | null,
    chunks: null as string | null,
    tokens: { input: 0, output: 0 },
  };

  constructor(
    { options }: { options: OpenAIOptions },
    agent: Agent,
    onTool?: OnTool
  ) {
    super(LLMProvider.OpenAI, options);
    this.onTool = onTool;
    this.agent = agent;

    // Initialize the OpenAI client
    this.openai = new OpenAIAPI({
      apiKey: options.apiKey,
    });
  }

  /**
   * Return max tokens or a default (e.g. 4096).
   */
  get maxTokens() {
    return this.options.maxTokens ?? 4096;
  }

  private async retryApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        return await apiCall();
      } catch (error) {
        if (error instanceof Error && error.message.includes('APIConnectionError')) {
          retries++;
          this.agent.log(`API call failed. Retrying in 3 seconds... (Attempt ${retries}/${this.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        } else {
          throw error; // Rethrow if it's not a connection error
        }
      }
    }
    throw new Error(`Max retries (${this.MAX_RETRIES}) reached. Unable to complete the API call.`);
  }
  /**
   * Perform the task with streaming support or not.
   */
  performTask(
    prompt: string,
    system: string,
    input: MessageInput[],
    stream: true
  ): Promise<ReadableStream<Message>>;
  performTask(
    prompt: string,
    system: string,
    input: MessageInput[],
    stream: false
  ): Promise<Message>;
  performTask(
    prompt: string,
    system: string,
    input: MessageInput[],
    stream: boolean
  ): Promise<ReadableStream<Message> | Message> {
    if (stream === true) {
        return this.retryApiCall(() => this.performTaskStream(prompt, system, input));
        }
        return this.retryApiCall(() => this.performTaskNonStream(prompt, system, input));
    }

  private fromInputToParam(model: MessageInput): ChatCompletionMessageParam {
    const content: Array<ChatCompletionContentPart> = [];

    const filteredContent = model.content
      .filter((c) =>
        c.type !== "tool_delta" &&
        c.type !== "tool_start" &&
        c.type !== "usage" &&
        c.type !== "delta" &&
        c.type !== "error"
      );

      for (const c of filteredContent) {
        if (c.type === "text") {
            const textBlock: ChatCompletionContentPartText = {
              type: 'text',
              text: c.text,
            };
            content.push(textBlock);
          }else if (c.type === "image") {
            const imageBlock: ChatCompletionContentPartImage = {
              type: 'image_url',
              image_url: {
                url: c.source.data,
              },
            };
            content.push(imageBlock);
          } else if (c.type === "tool_use") {
            //TODO: Test and debug
            // const toolUseBlock: ChatCompletionMessageToolCall = {
            //   id: c.id,
            //   type: 'function',
            //   function: {
            //       name: c.name,
            //       arguments: c.input as string
            //   },
            // };
            // content.push(toolUseBlock);
          } else {
            const toolContent = (c.content ?? []).map((inner) => {
                if (inner.type === "text") {
                  return <ChatCompletionContentPartText>{
                    type: 'text',
                    text: inner.text,
                  };
                }
                return {
                  type: 'text',
                  text: `[Unhandled content type: ${inner.type}]`,
                } as ChatCompletionContentPartText;
              })
              const toolResultBlock: ChatCompletionToolMessageParam = {
                tool_call_id: c.tool_use_id,
                content: toolContent,
                role: "tool"
              };
              return toolResultBlock;
          }
      }
    
      const messageParam: ChatCompletionMessageParam = {
        role: model.role as any,
        content,
      };
    return messageParam;
  }

  private async performTaskStream(
    prompt: string,
    system: string,
    input: MessageInput[]
  ): Promise<ReadableStream<Message>> {
    const messagesInput = this.includeLastPrompt(prompt, input);
    // Flatten all messages into OpenAI's ChatCompletionRequestMessage array
    const chatMessages = messagesInput.flatMap((m) => this.fromInputToParam(m));

    const request: OpenAIAPI.Chat.ChatCompletionCreateParams = {
      model: this.options.model,
      messages: [
        {
          role: "system",
          content: system,
        },
        ...chatMessages,
      ],
      max_tokens: this.maxTokens,
      stream: true,
    };

    // Try to preserve usage if we have it
    this.cache.tokens.input = 0;
    this.cache.tokens.output = 0;

    const stream = await this.openai.chat.completions.create(request);

    // Convert the OpenAI stream to a browser-compatible ReadableStream
    const readableStream = new ReadableStream<any>({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    // transform that into Message objects
    const transform = await this.transformStream<any, Message>(
      readableStream,
      (deltaChunk: any) => {
        return this.chunk(deltaChunk);
      }
    );

    // auto-mode logic
    const automodeStream = await this.transformAutoMode(
      transform,
      async () => {
        // If we need "multi-turn" or "tool usage", we can re-call streaming. 
        // For now, let's re-do the entire request with updated messages.
        const updatedChatMessages = this.agent.inputs.flatMap((m) =>
          this.fromInputToParam(m)
        );
        const nextRequest: OpenAIAPI.Chat.ChatCompletionCreateParams = {
          ...request,
          messages: [
            {
              role: "system",
              content: system,
            },
            ...updatedChatMessages,
          ],
          stream: true,
        };

        const stream2 = await this.openai.chat.completions.create(nextRequest);

        const newStream = new ReadableStream<any>({
          async start(controller) {
            for await (const chunk of stream2) {
              controller.enqueue(chunk);
            }
            controller.close();
          },
        });

        return this.transformStream<any, Message>(newStream, (deltaChunk: any) =>
          this.chunk(deltaChunk)
        );
      },
      this.onTool?.bind(this.agent)
    );

    return automodeStream;
  }

  private async performTaskNonStream(
    prompt: string,
    system: string,
    input: MessageInput[]
  ): Promise<Message> {
    const messagesInput = this.includeLastPrompt(prompt, input);
    const chatMessages = messagesInput.flatMap((m) => this.fromInputToParam(m));

    const request: OpenAIAPI.Chat.ChatCompletionCreateParams = {
      model: this.options.model,
      messages: [
        {
          role: "system",
          content: system,
        },
        ...chatMessages,
      ],
      max_tokens: this.maxTokens,
    };

    // reset
    this.cache.tokens.input = 0;
    this.cache.tokens.output = 0;

    let response = await this.openai.chat.completions.create(request);

    // record usage
    this.cache.tokens.input = response.usage?.prompt_tokens ?? this.cache.tokens.input;
    this.cache.tokens.output = response.usage?.completion_tokens ?? this.cache.tokens.output;

    let finishReason = response.choices[0].finish_reason;
    let role = response.choices[0].message?.role || "assistant";
    let content = response.choices[0].message?.content || "";

    // If finishReason is "length" => error
    // If tool usage is needed => we can re-call
    // For simplicity, do a loop if needed:
    while (finishReason === "length") {
      request.messages.push({
        role: role as any,
        content,
      });
      // Re-call
      response = await this.openai.chat.completions.create(request);
      finishReason = response.choices[0].finish_reason;
      role = response.choices[0].message?.role || "assistant";
      content = response.choices[0].message?.content || "";
      this.cache.tokens.input += response.usage?.prompt_tokens ?? 0;
      this.cache.tokens.output += response.usage?.completion_tokens ?? 0;
    }
    // Build final message
    return {
      id: response.id || "openai-non-stream-id",
      role: role === "assistant" ? "assistant" : "assistant",
      type: "message",
      content: [
        {
          type: "text",
          text: content,
        },
      ],
    };
  }


  private chunk(
    chunk: any
  ): Message | null {
    if (chunk.type === "content_block_start") {
      if (chunk.content_block.type === 'tool_use') {
        this.cache.chunks = null
        this.cache.toolInput = chunk.content_block;
        this.cache.toolInput!.input = ""
        const toolUseBlock: ToolUseBlock = chunk.content_block
        this.cache.toolInput = toolUseBlock;
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_start',
          content: [
            toolUseBlock
          ]
        }
      }
    } else if (chunk.type === "content_block_delta") {
      const delta = chunk.delta;
      if (delta.type === 'text_delta') {
        return {
          id: this.cache.chunks!,
          role: 'assistant',
          type: 'message',
          chunk: true,
          content: [
            {
              type: 'text',
              text: delta.text,
            }
          ]
        }
      } else if (delta.type === 'input_json_delta') {
        this.cache.chunks = null
        const toolInputBlock: ToolInputDelta = {
          type: 'tool_delta',
          partial: delta.partial_json
        }
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_delta',
          content: [toolInputBlock]
        }
      }
    } else if (chunk.type === "content_block_stop") {
      this.cache.chunks = null
      const isTool = this.cache.toolInput?.type === "tool_use";
      if (isTool) {
        const toolInput = this.cache.toolInput as ToolUseBlock;
        this.cache.toolInput = null
        return {
          id: v4(),
          role: 'assistant',
          type: 'tool_use',
          content: [toolInput]
        }
      }
    } else if (chunk.type === "message_delta") {
      this.cache.tokens.output = chunk.usage.output_tokens;
      this.cache.chunks = null;

      if (chunk.delta.stop_reason === "max_tokens") {
        const errorBlock: ErrorBlock = {
          type: 'error',
          message: `Exceeding the token limit, ${chunk.usage.output_tokens}`
        }
        return {
          id: v4(),
          role: 'assistant',
          type: 'error',
          content: [
            errorBlock
          ]
        }

      } else {
        const usageBlock: UsageBlock = {
          type: "usage",
          output: chunk.usage.output_tokens,
          input: this.cache.tokens.input
        }
        return {
          id: v4(),
          role: 'assistant',
          type: 'delta',
          content: [
            chunk.delta as DeltaBlock,
            usageBlock
          ]
        }
      }
    } else if (chunk.type === "message_start") {
      this.cache.chunks = chunk.message.id;
      this.cache.toolInput = null
      this.cache.tokens.input = chunk.message.usage.input_tokens;
      const usageBlock: UsageBlock = {
        type: "usage",
        output: 0,
        input: this.cache.tokens.input
      }
      return {
        id: v4(),
        role: 'assistant',
        type: 'usage',
        content: [
          usageBlock
        ]
      }
    }
    return null
  }
} 