import OpenAIAPI from 'openai';
import { v4 } from 'uuid';
import { BaseLLM } from "./Base";
import {
  LLMProvider,
  OpenAIOptions,
  Message,
  MessageInput,
  ToolUseBlock,
  OnTool,
  DeltaBlock,
  TextBlock,
  BaseLLMCache,
  ReadableStreamWithAsyncIterable
} from "../types";
import {
  ChatCompletionContentPart,
  ChatCompletionContentPartText,
  ChatCompletionContentPartImage,
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
  FunctionDefinition,
  ChatCompletionAssistantMessageParam,
} from 'openai/resources';
import { ToolInputDelta } from '../types';
import { Stream } from 'openai/streaming';
import { MessageArray } from '..';


/**
 * A more complete implementation of the OpenAI-based LLM,
 * mirroring the structure and patterns found in the Anthropic class.
 */
export class OpenAI extends BaseLLM<LLMProvider.OpenAI, OpenAIOptions> {
  private onTool?: OnTool;
  private openai: OpenAIAPI;
  public inputs: MessageArray<MessageInput> = new MessageArray();

  public cache: BaseLLMCache = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } }

  constructor(
    { options }: { options: OpenAIOptions },
    onTool?: OnTool
  ) {
    super(LLMProvider.OpenAI, options);
    this.onTool = onTool;

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

  private fromInputToParam(model: MessageInput): ChatCompletionMessageParam {
    const content: Array<ChatCompletionContentPart> = [];
    const filteredContent = model.content
      .filter((c) =>
        c.type !== "tool_delta" &&
        c.type !== "usage" &&
        c.type !== "delta" &&
        c.type !== "error"
      );

    const messageParam: ChatCompletionMessageParam = {
      role: model.role as any,
      content:[],
    };

    for (const c of filteredContent) {

      if (c.type === "text") {
        const textBlock: ChatCompletionContentPartText = {
          type: 'text',
          text: c.text,
        };
        content.push(textBlock);
      } else if (c.type === "image") {
        const imageBlock: ChatCompletionContentPartImage = {
          type: 'image_url',
          image_url: {
            url: c.source.data,
          },
        };
        content.push(imageBlock);
      } else if (c.type === "tool_result") {
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
        });

        content.push(...toolContent);


        (messageParam as unknown as ChatCompletionToolMessageParam).tool_call_id = c.tool_use_id;
        (messageParam as unknown as ChatCompletionToolMessageParam).role = "tool";

      } else if (c.type === "tool_use") {
        (messageParam as ChatCompletionAssistantMessageParam).tool_calls = [
          {
            id: c.id!,
            type: "function",
            function: {
              name: c.name!,
              arguments:JSON.stringify(c.input),
            }
          }
        ]
        messageParam.content = null
      }
    }

    if (messageParam.content !== null) {
      messageParam.content = content;
    }

    return messageParam;
  }

  get tools() {
    return this.options.tools?.map((tool) => {
      const parsedTool = JSON.parse(JSON.stringify(tool));
      const functionDefinition: FunctionDefinition = {
        name: parsedTool.name,
        description: parsedTool.description,
        parameters: parsedTool.input_schema
      }
      return {
        type: "function" as const,
        function: functionDefinition
      }
    })
  }


  get llmInputs() {
    return this.inputs
    .flatMap((input) => this.fromInputToParam(input))
    .filter((c) => {
      if (Array.isArray(c.content) && c.content.length === 0) {
        return false;
      }
      return true;
    })
  }

   async performTaskStream(
    prompt: string,
    chainOfThought: string,
    system: string,
  ): Promise<ReadableStreamWithAsyncIterable<Message>> {

    this.inputs = this.includeLastPrompt(prompt, chainOfThought, this.inputs);
    
    const tools = this.tools && this.tools.length > 0 ? this.tools : undefined;

    let request: OpenAIAPI.Chat.ChatCompletionCreateParams = {
      model: this.options.model,
      messages: [
        {
          role: "system",
          content: system,
        },
        ...this.llmInputs,
      ],
      max_tokens: this.maxTokens,
      stream: true,
      tools
    };

    // Try to preserve usage if we have it
    this.cache.tokens.input = 0;
    this.cache.tokens.output = 0;

    const createStream = async (params: OpenAIAPI.Chat.ChatCompletionCreateParams) => {
      return this.retryApiCall(async () => {
        const stream = await this.openai.chat.completions.create(params) as Stream<OpenAIAPI.Chat.Completions.ChatCompletionChunk>;
        return stream.toReadableStream() as ReadableStreamWithAsyncIterable<OpenAIAPI.Chat.Completions.ChatCompletionChunk>
      });
    };

    const stream = await createStream(request);
    const transform = await this.transformStream<
      OpenAIAPI.Chat.Completions.ChatCompletionChunk, 
      Message
    >(
      stream,
      this.chunk.bind(this)
    );

    // auto-mode logic
    const automodeStream = await this.transformAutoMode(
      transform,
      async () => {
        const newStream = await createStream({
          ...request,
          messages: [
            {
              role: "system",
              content: system,
            },
            ...this.llmInputs
          ],
          stream: true,
        });
        return this.transformStream<OpenAIAPI.Chat.Completions.ChatCompletionChunk, Message>(
          newStream,
          this.chunk.bind(this)
        );
      },
      this.onTool?.bind(this)
    );

    return automodeStream;
  }

   async performTaskNonStream(
    prompt: string,
    chainOfThought: string,
    system: string,
  ): Promise<Message> {
    this.inputs.push(...this.includeLastPrompt(prompt, chainOfThought, this.inputs))
    this.cache.tokens.input = 0;
    this.cache.tokens.output = 0;
    let sdkMessage: Message;
    const tools = this.tools && this.tools.length > 0 ? this.tools : undefined;

    while(true) {
      const request: OpenAIAPI.Chat.ChatCompletionCreateParams = {
        model: this.options.model,
        messages: [
          {
            role: "system",
            content: system,
          },
          ...this.inputs.map(this.fromInputToParam),
        ],
        max_tokens: this.maxTokens,
        tools
      };
      const response = await this.openai.chat.completions.create(request);
      this.cache.tokens.input = response.usage?.prompt_tokens ?? this.cache.tokens.input;
      this.cache.tokens.output = response.usage?.completion_tokens ?? this.cache.tokens.output;
      const [{ finish_reason, message }] = response.choices;
      let role = message?.role || "assistant";
      let content = message?.content || "";
      if (finish_reason === "tool_calls") {
        const toolCall = message?.tool_calls?.[0];
        if (toolCall &&
          this.onTool &&
          this.tools?.find((t) => t.function.name === toolCall.function.name)) {
          const toolInputBlock: ToolUseBlock = {
            type: 'tool_use',
            input: toolCall.function.arguments,
            name: toolCall.function.name,
            id: toolCall.id,
          }
          sdkMessage = {
            id: v4(),
            role: role,
            type: 'tool_use',
            content: [toolInputBlock]
          }
          this.inputs.push(sdkMessage)

          await this.onTool?.bind(this)(sdkMessage, this.options.signal);
        }
      } else if (finish_reason === "stop") {
        const textBlock: TextBlock = {
          type: 'text',
          text: content
        }
        sdkMessage = {
          id: v4(),
          role: role,
          type: 'message',
          content: [textBlock]
        }
        this.inputs.push(sdkMessage)

        break;
      } else if (finish_reason === "length" || finish_reason === "content_filter") {
        const textBlock: TextBlock = {
          type: "text",
          text: content
        };
        sdkMessage = {
          id: v4(),
          role,
          type: "message",
          content: [textBlock]
        };
        this.inputs.push(sdkMessage)

        break;
      } else {
        const fallbackBlock: TextBlock = {
          type: 'text',
          text: content
        };
        sdkMessage = {
          id: v4(),
          role,
          type: 'message',
          content: [fallbackBlock]
        };
        this.inputs.push(sdkMessage)

        break;
      }
    }
    return {
      id: sdkMessage!.id,
      role: sdkMessage!.role,
      type: "message",
      content: sdkMessage!.content
    };
  }


  private chunk(
    chunk: OpenAIAPI.Chat.Completions.ChatCompletionChunk,
  ): Message | null {
    if (chunk.object !== "chat.completion.chunk") {
      return null;
    }
    const [choice] = chunk.choices;
    if (!choice) {
      return null;
    }

    const delta = choice.delta;
    //Tools
    if (delta && delta.tool_calls) {
      const toolCall = delta.tool_calls[0];
      const args = !toolCall.function || toolCall.function.arguments === ""
        ? "{}"
        : (toolCall.function.arguments ?? "{}");

      if (toolCall.function?.name) {
        const tool_delta: ToolInputDelta = {
          id: toolCall.id!,
          name: toolCall.function?.name,
          type: 'tool_delta',
          partial: args,
        };
        this.cache.toolInput = tool_delta;
        const message:Message =  {
          id: chunk.id,
          role: 'assistant',
          type: 'tool_delta',
          content: [tool_delta]
        };
        return message;
      }
    }

    const finishReason = choice.finish_reason;

    if (finishReason === "tool_calls") {
      const deltaBlock = this.cache.toolInput! as ToolInputDelta;
      const toolUseBlock: ToolUseBlock = {
        id: deltaBlock.id!,
        name: deltaBlock.name!,
        input: JSON.parse(deltaBlock.partial),
        type: 'tool_use'
      }
      const message:Message =  {
        id: chunk.id,
        role: 'assistant',
        type: 'tool_use',
        content: [toolUseBlock]
      };
      return message;
    }

    if (finishReason === "stop" || finishReason === "length") {
      const deltaBlock: DeltaBlock = {
        type: 'delta',
        // "stop_reason" can be "stop", "length", etc.
        // For simplicity, just set it to "end_turn" if "stop".
        stop_reason: finishReason === "stop"
          ? "end_turn"
          : "max_tokens",
        stop_sequence: null
      };
      const message:Message =  {
        id: chunk.id,
        role: 'assistant',
        type: 'delta',
        content: [deltaBlock]
      };
      return message;
    }

    // 3) Check if there's partial text content
    if (choice.delta?.content) {
      const textBlock: TextBlock = {
        type: 'text',
        text: choice.delta.content
      };
      const message:Message =  {
        id: chunk.id,
        role: 'assistant',
        type: 'message',
        chunk: true,
        content: [textBlock]
      };
      return message;
    }

    return null;
  }
} 