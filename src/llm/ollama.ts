import { v4 } from 'uuid';

import { BaseLLM } from "./base";

import {
  Ollama as OllamaApi,
  ChatRequest,
  Message as OllamaMessage,
  Tool as OllamaTool,
  AbortableAsyncIterator,
  ChatResponse
} from 'ollama'

import { Agent } from "../agents";
import {
  LLMProvider,
  Message,
  MessageInput,
  OnTool,
  BaseLLMCache,
  OllamaOptions,
  ToolUseBlock,
  TextBlock,
  ReadableStreamWithAsyncIterable,
} from "../types";

type OllamaRequest = ChatRequest & {
  stream?: false;
};

type OllamaRequestStream = ChatRequest & {
  stream: true;
};

type ReduceOllamaMessage = Pick<OllamaMessage, 'role' | 'content' | 'images' | 'tool_calls'>


/**
 * A more complete implementation of the OpenAI-based LLM,
 * mirroring the structure and patterns found in the Anthropic class.
 */
export class Ollama extends BaseLLM<LLMProvider.Ollama, OllamaOptions> {
  protected agent: Agent;
  private onTool?: OnTool;
  private ollama: OllamaApi;

  public cache: BaseLLMCache = {
    toolInput: null,
    chunks: '',
    tokens: { input: 0, output: 0 }
  };

  constructor(
    { options }: { options: OllamaOptions },
    agent: Agent,
    onTool?: OnTool
  ) {
    super(LLMProvider.Ollama, options);
    this.onTool = onTool;
    this.agent = agent;
    this.ollama = new OllamaApi(options);
  }

  /**
   * Return max tokens or a default (e.g. 4096).
   */
  get maxTokens() {
    return this.options.maxTokens ?? 4096;
  }

  /**
   * Convert your internal message structure to parameters compatible
   * with the Ollama API or your custom integration.
   */
  private fromInputToParam(model: MessageInput): OllamaMessage {
    const ollamaMessage = model.content.reduce<ReduceOllamaMessage>((all, current) => {
      if (current.type === 'text') {
        all.content += current.text;
      } else if (current.type === "tool_result") {
        if (current.content) {
          for (const content of current.content) {
            if (content.type === "text") {
              all.content += content.text;
              all.role = "tool";
            } else {
              throw new Error("Not implemented");
            }
          }
        }
      } else if (current.type === "tool_use") {
        if (!all.tool_calls) {
          all.tool_calls = [];
        }
        all.tool_calls?.push({
          function: {
            name: current.name,
            arguments: current.input as { [key: string]: any; }
          }
        })
      } else {
        debugger;
      }
      return all
    }, {
      role: model.role,
      content: '',
      images: [],
      tool_calls: []
    })

    return ollamaMessage
  }

  /**
   * Return the messages with your internal format mapped to Ollama-compatible parameters.
   */
  get llmInputs() {
    return this.agent.inputs
    .flatMap((input) => this.fromInputToParam(input))
  }

  /**
   * Example chunk function that mimics partial streaming logic:
   */
  private chunk(chunk: ChatResponse): Message {
    const message = chunk.message;
    if (message.tool_calls?.length) {
      const toolCall = message.tool_calls[0];
      const toolUse: ToolUseBlock = {
        id: v4(),
        input: toolCall.function.arguments,
        name: toolCall.function.name,
        type: 'tool_use',
      }
      this.cache.toolInput = toolUse;
      return {
        id: v4(),
        type: 'tool_use',
        content: [toolUse],
        role: 'assistant',
      }
    } else if (typeof message.content === "string") {
      const textBlock: TextBlock = {
        type: 'text',
        text: message.content,
      }
      return {
        id: v4(),
        type: 'message',
        chunk: false,
        content: [textBlock],
        role: 'assistant',
      }
    }
    throw new Error("Not implemented");
  }

  

  /**
   * Example streaming task, similar to the Anthropic / OpenAI classes.
   */
  async performTaskStream(prompt: string, chainOfThought: string, system: string): Promise<ReadableStreamWithAsyncIterable<Message>> {

    this.agent.inputs = this.includeLastPrompt(prompt, chainOfThought, this.agent.inputs);

    const request: OllamaRequestStream = {
      model: this.options.model,
      stream: true,
      messages: [
        {
          role: "system",
          content: system,
        },
        ...this.agent.inputs.map(this.fromInputToParam)
      ],
      tools: this.ollamaTools
    };

    this.cache.tokens.input = 0;
    this.cache.tokens.output = 0;

    const createStream = async (params: OllamaRequestStream):Promise<ReadableStreamWithAsyncIterable<any>> => {
      return this.agent.retryApiCall(async () => {
        const stream:AbortableAsyncIterator<ChatResponse> = await this.agent.retryApiCall(async () => this.ollama.chat(params));
        const redeable =  new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of stream) {
                controller.enqueue(chunk);
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          }
        });
        return redeable as ReadableStreamWithAsyncIterable<ChatResponse>
      });
    };

    const stream = await createStream(request);
    const transform = await this.transformStream<
      ChatResponse, 
      Message
    >(
      stream, 
      this.chunk.bind(this)
    );

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
        return this.transformStream<ChatResponse, Message>(
          newStream,
          this.chunk.bind(this)
        );
      },
      this.onTool?.bind(this.agent)
    );

    return automodeStream;
  }


  get ollamaTools() {
    const tools = this.agent.tools ?? [];
    return tools.map((tool: any) => {
      const ollamaTool: OllamaTool = {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.input_schema
        }
      }
      return ollamaTool;
    })
  }

  /**
   * Example non-streaming task
   */
  async performTaskNonStream(prompt: string, chainOfThought: string, system: string): Promise<Message> {
    this.agent.inputs.push(...this.includeLastPrompt(prompt, chainOfThought, this.agent.inputs))
    await this.ollama.pull({ model: this.options.model });
    while (true) {
      const request: OllamaRequest = {
        model: this.options.model,
        stream: false,
        messages: this.agent.inputs.map(this.fromInputToParam),
        tools: this.ollamaTools
      };
      const response = await this.agent.retryApiCall(async () => this.ollama.chat(request));
      const message = this.chunk(response);
      this.agent.inputs.push(message)
      if (message.type === "tool_use") {
        const toolUse = message.content[0] as ToolUseBlock;
        const tool = this.agent.tools.find((tool: any) => tool.name === toolUse.name);
        if (tool && this.onTool) {
          await this.onTool.bind(this.agent)(message, this.options.signal);
        }
      } else {
        if (response.done && response.done_reason === "stop") {
          return message;
        }
      }
    }
    throw new Error("Invalid response");
  }
} 