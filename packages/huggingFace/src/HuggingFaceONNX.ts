import {
  InterruptableStoppingCriteria,
  TextStreamer,
  Message as HMessage,
  PreTrainedTokenizer,
  PreTrainedModel,
  Tensor,
  AutoTokenizer,
  AutoConfig,
  AutoModelForCausalLM,
} from '@huggingface/transformers'
import { v4 } from "uuid";

import { BaseLLM, DeltaBlock } from "@uaito/sdk";
import { MessageType, BaseLLMCache, MessageInput, OnTool, TextBlock, ToolUseBlock, ToolResultBlock, ImageBlock, ReadableStreamWithAsyncIterable, ErrorBlock, ToolInputDelta, Message, LLMProvider, MessageArray, FileBlock, BlockType } from "@uaito/sdk";
import { type TensorDataType, type HuggingFaceONNXOptions, HuggingFaceONNXModels } from "./types";
import { MessageCache } from "./utils";


/**
 * A string representing the end of an imitation tag, used for parsing model outputs.
 * @type {string}
 */
const IM_END_TAG = '<|im_end|>';
/**
 * A cache for storing pre-trained models to avoid redundant downloads.
 * The key is the model identifier, and the value is the `PreTrainedModel` instance.
 * @type {Map<string, PreTrainedModel>}
 */
const modelCache = new Map<string, PreTrainedModel>();
/**
 * A cache for storing pre-trained tokenizers to avoid redundant downloads.
 * The key is the model identifier, and the value is the `PreTrainedTokenizer` instance.
 * @type {Map<string, PreTrainedTokenizer>}
 */
const tokenizerCache = new Map<string, PreTrainedTokenizer>();

/**
 * Extends the Hugging Face `Message` type to include an optional `type` and `id`.
 * @interface
 */
type HuggingFaceMessage = HMessage & {
  type?: MessageType,
  id?: string
}

/**
 * An interface representing a generative model with a `generate` method.
 * This is used to ensure type compatibility with the Hugging Face `PreTrainedModel`.
 * @interface
 */
type GenerativeModel = PreTrainedModel & {
  generate: (inputs: unknown, options?: unknown) => Promise<unknown>;
};

/**
 * Represents the output of a generation task from a Hugging Face model.
 * @interface
 */
type GenerateOutput = {
  sequences: Tensor,
  past_key_values: unknown
}




/**
 * A class for running Hugging Face ONNX models locally in the browser using WebGPU or WASM.
 * It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK,
 * handling model loading, tokenization, stream processing, and tool usage.
 *
 * @class HuggingFaceONNX
 * @extends {BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>}
 *
 * @example
 * ```typescript
 * const onnx = new HuggingFaceONNX({
 *   options: {
 *     model: HuggingFaceONNXModels.JANO,
 *     device: 'webgpu',
 *   }
 * });
 *
 * await onnx.load();
 * const { response } = await onnx.performTaskStream("Hello, world!", "", "");
 * for await (const chunk of response) {
 *   // Process each message chunk
 * }
 * ```
 */
export class HuggingFaceONNX extends BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions> {
  /**
   * The cache for the LLM, extended with optional IDs for tracking thinking, text, and image blocks.
   * @public
   * @type {BaseLLMCache & { thinkingId?: string | null, textId?: string | null, imageId?: string | null }}
   */
  public cache: BaseLLMCache & { thinkingId?: string | null, textId?: string | null, imageId?: string | null } = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } }
  /**
   * The progress of loading the model.
   * @public
   * @type {number}
   */
  public loadProgress = new Map<string, {loaded: number, total: number}>();
  /**
   * An array that holds the history of messages for the conversation.
   * @public
   * @type {MessageArray<MessageInput>}
   */
  public inputs: MessageArray<MessageInput> = new MessageArray();
  /**
   * The tokenizer instance for the loaded model.
   * @private
   * @type {PreTrainedTokenizer}
   */
  private tokenizer!: PreTrainedTokenizer;
  /**
   * The pre-trained model instance.
   * @private
   * @type {PreTrainedModel}
   */
  private model!: PreTrainedModel;
  /**
   * A stopping criteria instance that can be used to interrupt model generation.
   * @private
   * @type {InterruptableStoppingCriteria}
   */
  private stoppingCriteria = new InterruptableStoppingCriteria();
  /**
   * A cache for processing and assembling messages from stream chunks.
   * @private
   * @type {MessageCache}
   */
  private messageCache!: MessageCache;

  /**
   * An optional callback function that is triggered when a tool is used.
   * @type {OnTool | undefined}
   */
  public onTool?: OnTool


  /**
   * Creates an instance of `HuggingFaceONNX`.
   * @param {{ options: HuggingFaceONNXOptions }} params - The configuration options for the client.
   * @param {OnTool} [onTool] - An optional callback for handling tool usage, which can also be provided in the options.
   */
  constructor(
    { options }: { options: HuggingFaceONNXOptions },
    onTool?: OnTool
  ) {
    super(LLMProvider.Local, options);
    this.data.progress = 0;
    this.onTool = onTool ?? options.onTool;
    this.options.signal?.addEventListener('abort', () => {
      this.stoppingCriteria.interrupt();
    });
  }

  /**
   * Processes a chunk of text from the response stream and transforms it into a `Message` object.
   * This method relies on a `MessageCache` to handle the parsing of structured content like tool calls.
   * @private
   * @param {string} chunk - The chunk of text to process.
   * @returns {Promise<Message | null>} A promise that resolves to the processed `Message` or `null`.
   */
  private async chunk(chunk: string): Promise<Message | null> {
    return this.messageCache.processChunk(chunk);
  }


  /**
   * A wrapper for running a promise that can be aborted via an `AbortSignal`.
   * If the signal is aborted, the promise is rejected and the model's generation is interrupted.
   * @template Fn - The type of the promise to run.
   * @param {Fn} fn - The promise to run.
   * @returns {Promise<unknown>} The result of the promise.
   */
  async runAbortable<Fn extends Promise<unknown>>(fn: Fn) {
    return new Promise((resolve, reject) => {
      this.options.signal?.addEventListener('abort', () => {
        if (!this.stoppingCriteria.interrupted) {
          this.stoppingCriteria.interrupt();
        }
        reject(new Error('Operation aborted'));
      });
      fn.then(resolve).catch(reject);
    });
  }

  /**
   * Loads the pre-trained model and tokenizer from Hugging Face. It uses a cache to avoid
   * redundant downloads. This method also handles the configuration of the model for
   * WebGPU or WASM execution and provides progress callbacks.
   * @returns {Promise<void>}
   */
  async load() {
    this.log(`Loading model: ${this.options.model}`);
    const modelId = this.options.model;

    if (tokenizerCache.has(modelId)) {
      const tokenizer = tokenizerCache.get(modelId);
      if (tokenizer) {
        this.tokenizer ??= tokenizer;
      }
    } else {
      this.tokenizer ??= await AutoTokenizer.from_pretrained(modelId);
      tokenizerCache.set(modelId, this.tokenizer);
    }

    this.log(`Tokenizer loaded for ${modelId}`);
    if (modelCache.has(modelId)) {
      const model = modelCache.get(modelId);
      if (model) {
        this.model ??= model;
      }
    } else {
      const defaultConfig = await AutoConfig.from_pretrained(modelId);
      const configPerModel = {
        __default: {
          device: this.options.device ?? "webgpu",
          dtype: this.options.dtype ?? "auto",
          config: {
            ...defaultConfig,
            'transformers.js_config': {
              ...defaultConfig["transformers.js_config"],
              kv_cache_dtype: {
                "q4f16": "float16" as const,
                "fp16": "float16" as const
              } as never
            }
          },
        },
        [HuggingFaceONNXModels.LUCY]: {
          device: "webgpu",
          dtype:  "q4f16",
          config:defaultConfig
        },
      }

      const config = configPerModel[modelId] ?? configPerModel.__default;
      this.model ??= await AutoModelForCausalLM.from_pretrained(modelId, {
        ...config,
        progress_callback: (info: Record<string, any>) => {
          if (info.status !== 'progress') return;
                this.loadProgress.set(info.file, { loaded: info.loaded, total: info.total });
                if (this.loadProgress.size >= 2) {
                  const aggregate = [...this.loadProgress.values()].reduce((acc, { loaded, total }) => {
                    acc.loaded += loaded;
                    acc.total += total;
                    return acc;
                  }, { loaded: 0, total: 0 });
                  const percent = aggregate.total > 0 ? ((aggregate.loaded / aggregate.total) * 100).toFixed(2) : '0.00';
                  if (this.options.onProgress) {
                    this.options.onProgress(parseInt(percent, 10));
                  }
                }
        },
      });
      modelCache.set(modelId, this.model);
    }
    this.log(`Model loaded: ${modelId}`);
  }

  /**
   * Converts a Uaito SDK `MessageInput` object into a `HuggingFaceMessage` object.
   * This method handles the serialization of different content types (text, images, tool calls)
   * into a format that can be processed by the tokenizer's chat template.
   * @private
   * @param {MessageInput} message - The `MessageInput` object to convert.
   * @returns {HuggingFaceMessage} The converted `HuggingFaceMessage` object.
   */
  private fromInputToParam(message: MessageInput): HuggingFaceMessage {
    const { content } = message;
    const textContent = content
      .filter((c): c is TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("\n\n");

    const fileContent = content
      .filter((c): c is FileBlock => c.type === "file")
      .map((c) => `File: ${c.source.name}\n\n${c.source.content}`)
      .join("\n\n");

    const imagesContent = content
      .filter((c): c is ImageBlock => c.type === "image")
      .map((c) => c.source)
      .map((c) => {
        const decodedImage = Buffer.from(c.data, 'base64');
        const blob = new Blob([decodedImage], { type: c.media_type });
        return URL.createObjectURL(blob);
      })
      .join("");

    const toolUseContent = content
      .filter((c): c is ToolUseBlock => c.type === "tool_use")
      .map((toolUse) =>
        JSON.stringify({
          id: toolUse.id,
          name: toolUse.name,
          parameters: toolUse.input,
          type: 'tool_use'
        })
      )
      .join("\n");

    const toolResultContent = content
      .filter((c): c is ToolResultBlock => c.type === "tool_result")
      .map((toolResult) => {

        let textContent = (toolResult.content ?? [])
          .filter((c): c is TextBlock => c.type === "text")
          .map((c) => c.text)
          .join("\n\n");

        const imagesContent = (toolResult.content ?? [])
          .filter((c): c is ImageBlock => c.type === "image")
          .map((c) => c.source)

        imagesContent.map((c) => {
          const decodedImage = Buffer.from(c.data, 'base64');
          const blob = new Blob([decodedImage]);
          const url = URL.createObjectURL(blob);
          textContent += `\n\nGenerated image can be found in this url: ${url}. Attach this to any message where you want to use it`;
        })
        return JSON.stringify({
          tool_use_id: toolResult.tool_use_id,
          name: toolResult.name,
          content: textContent,
          is_error: toolResult.isError ?? false,
        });
      })
      .join("\n");


    if (toolUseContent) {
      return {
        role: 'assistant',
        content: toolUseContent,
      };

    }

    if (toolResultContent) {
      return {
        role: 'assistant',
        content: toolResultContent,
      };
    }

    const finalContent = [textContent, fileContent].filter(Boolean).join('\n\n');

    if (imagesContent) {
      return {
        role: message.role,
        content:`${finalContent}\n\n${imagesContent}`,
      };
    }

    return {
      role: message.role,
      content: finalContent,
    };
  }

  /**
   * Prepares the tensor data for the model by applying the chat template to the message history.
   * This converts the conversation into a format that the model can understand.
   * @private
   * @returns {TensorDataType} The tensor data for the model.
   */
  private getTensorData() {
    const currentInputs = MessageArray.from(this.inputs).map(this.fromInputToParam);
    this.log(`Current inputs: ${JSON.stringify(currentInputs)}`);
    const tensor = this.tokenizer.apply_chat_template(currentInputs, {
      add_generation_prompt: true,
      return_dict: true,
      tools: this.options.tools,
    } as any) as unknown as TensorDataType;

    this.log(`Tensor created. Shape: ${tensor.input_ids.dims}`);

    return tensor;
  }

  /**
   * Creates a readable stream of strings by running the model's generation process.
   * It uses a `TextStreamer` to decode the model's output tokens into text in real-time.
   * @returns {Promise<ReadableStreamWithAsyncIterable<string>>} A promise that resolves to a readable stream of strings.
   */
  async createStream(): Promise<ReadableStreamWithAsyncIterable<string>> {
    // Ensure stopping criteria is fresh for this generation
    this.stoppingCriteria.reset();
    const input = this.getTensorData();
    const stopping_criteria = this.stoppingCriteria;

    this.log("createStream called.");

    let __past_key_values: unknown = null;

    const stream = new ReadableStream<string>({
      start: async (controller) => {
        this.log("ReadableStream started for model generation.");
        try {
          const streamer = new TextStreamer(this.tokenizer, {
            skip_prompt: true,
            skip_special_tokens: false,
            callback_function: (value: string) => {
              const chunk = value.replace(IM_END_TAG, "");
              controller.enqueue(chunk);
            },
          });
            try {
              const { sequences,past_key_values } = await (this.model as GenerativeModel).generate({
                ...input,
                past_key_values: __past_key_values,
                do_sample: false,
                generation_config: {
                  output_attentions: true,
                  max_new_tokens: this.options.maxTokens ?? 4096,
                },
                streamer,
                return_dict_in_generate: true,
                stopping_criteria
              }) as GenerateOutput;
  
              __past_key_values = past_key_values;
  
              if (sequences) { 
                  const response = this.tokenizer
                  .batch_decode(
                    sequences.slice(null, [input.input_ids.dims[1], 0]), {skip_special_tokens: false})[0];
                  

                    if (response.includes(IM_END_TAG)) {
                      const delta: DeltaBlock = {
                        type: 'delta',
                        stop_reason:'end_turn',
                        stop_sequence: IM_END_TAG
                      }
                      controller.enqueue( {
                        id: v4(),
                        role: 'assistant',
                        type: 'delta',
                        content: [delta]
                      } as any)
                    }


                 const responseWithoutEndTag = response.replace(IM_END_TAG, "");
                  
                this.inputs.push({
                  id: v4(),
                  role: 'assistant',
                  type: 'message',
                  content: [{ type: 'text', text: responseWithoutEndTag }]
                })
              } 

              
  
            } catch {
            }
            // 
          

        } catch (e) {
          this.log(`Model generation error: ${e}`);
          const errorBlock: ErrorBlock = {
            type: 'error',
            message: (e as Error).message
          }
          const message: Message = {
            id: v4(),
            role: 'assistant',
            type: 'message',
            content: [errorBlock]
          }
          this.inputs.push(message);
          controller.enqueue(JSON.stringify(message));
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return stream as ReadableStreamWithAsyncIterable<string>;
  }

  /**
   * Adds the system prompt and the latest user prompt to the message history before running the model.
   * @private
   * @param {any} prompt - The user prompt.
   * @param {string} chainOfThought - The chain of thought for the task.
   * @param {string} system - The system prompt.
   */
  private addDefaultItems(prompt: string | BlockType[], chainOfThought: string, system: string) {
    if (this.inputs.length === 0 && system !== '') {
      //Internal message
      const systemPrompt: Message = {
        id: v4(),
        role: "system",
        type: "message",
        content: [{
          text: system,
          type: "text"
        }]
      }
      this.inputs.push(systemPrompt as MessageInput);
    }

    if (typeof prompt === 'string') {
      const promptWithChainOfThought = `${prompt}${chainOfThought !== '' ? `\r\n\r\n${chainOfThought}` : ''}`
      const promptWithModelData = `${promptWithChainOfThought}\r\n\r\nModel loaded: ${this.options.model} from HuggingFace transformers.js`
      this.inputs = MessageArray.from(
        [
          ...this.inputs,
          { role: 'user', content: [{ type: 'text', text: promptWithModelData}] }
        ]
      )
    } else {

      const fileBlock = prompt.find((p): p is FileBlock => p.type === 'file');
      const textBlock = prompt.find((p): p is TextBlock => p.type === 'text');
      const promptWithChainOfThought = `${textBlock?.text}\n\n${fileBlock?.source.content}${chainOfThought !== '' ? `\r\n\r\n${chainOfThought}` : ''}`
      const promptWithModelData = `${promptWithChainOfThought}\r\n\r\nModel loaded: ${this.options.model} from HuggingFace transformers.js, model url: https://huggingface.co/${this.options.model}`

      this.inputs = MessageArray.from(
        [
          ...this.inputs,
          { role: 'user', content:[{ type: 'text', text: promptWithModelData}] }
        ]
      )
    }
    
  }

  

  /**
   * Executes a task by preparing the inputs, running the model's generation process,
   * and returning the response as a stream. It orchestrates the loading of the model,
   * creation of the stream, and the application of transformations for auto-mode and tool usage.
   * @param {string | BlockType[]} prompt - The user's prompt.
   * @param {string} chainOfThought - The chain of thought for the task.
   * @param {string} system - The system prompt.
   * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of `Message` objects.
   */
  async performTaskStream(prompt, chainOfThought, system): Promise<ReadableStreamWithAsyncIterable<Message>> {

    this.stoppingCriteria.reset();
    this.messageCache = new MessageCache(this.options.tools ?? [], this.log);

    this.log("Starting performTaskStream");
    await this.load();

    if (Array.isArray(prompt)) {
      const fileBlock = prompt.find((p): p is FileBlock => p.type === 'file');
      const textBlock = prompt.find((p): p is TextBlock => p.type === 'text');

      this.addDefaultItems(`${textBlock?.text}\n\n${fileBlock?.source.content}`, system, chainOfThought);
    } else {
      this.addDefaultItems(prompt, system, chainOfThought);
    }

    const rawStream = await this.createStream();


    this.options.signal?.addEventListener('abort', () => {
      rawStream.cancel()
    });

    const transformedStream = await this.transformStream<string, Message>(
      rawStream,
      this.chunk.bind(this)
    );
    
    const automodeStream = await this.transformAutoMode(
      transformedStream,
      async () => {
        const nextRawStream = await this.createStream();
        return this.transformStream<string, Message>(
          nextRawStream,
          this.chunk.bind(this)
        );
      },
      this.onTool
    );

    return automodeStream;
  }


    /**
   * A specialized version of `transformAutoMode` for handling the streaming and tool-use logic
   * of local Hugging Face models. It manages the lifecycle of the stream reader and reactivates
   * the stream after a tool call.
   * @template AChunk - The type of chunks in the stream, which must extend `Message`.
   * @param {ReadableStreamWithAsyncIterable<AChunk>} input - The initial stream from the model.
   * @param {() => Promise<ReadableStreamWithAsyncIterable<AChunk>>} getNext - A function to get the next stream after a tool call.
   * @param {OnTool} [onTool] - An optional callback for handling tool usage.
   * @returns {Promise<ReadableStreamWithAsyncIterable<AChunk>>} A promise that resolves to the final transformed stream.
   */
   override async transformAutoMode<AChunk extends Message> (
      input: ReadableStreamWithAsyncIterable<AChunk>,
      getNext: () => Promise<ReadableStreamWithAsyncIterable<AChunk>>,
      onTool?:OnTool
    ) {
      const stream = new ReadableStream({
         start: async (controller) => {
          let reader: ReadableStreamDefaultReader<AChunk> = input.getReader();
          while (true) {
            const readerResult = await reader.read();
            if (readerResult.done) {
              break;
            }
            try {
              if (!readerResult.value) {
                continue;
              }
              const tChunk:AChunk =  readerResult.value;
              this.log(`tChunk: ${tChunk.type} ${JSON.stringify(tChunk)}`);
              if (tChunk.type === "error" || 
                tChunk.type === "usage" || 
                tChunk.type === "delta" || 
                tChunk.type === "tool_delta" || 
                tChunk.type === "message"
              ) {
                controller.enqueue(tChunk)
                if (tChunk.type === "delta") {
                  const delta = (tChunk.content || []).find((c:any) => c && c.type === 'delta') as { stop_reason?: string } | undefined;
                  if (delta && (delta.stop_reason === 'end_turn' || delta.stop_reason === 'stop_sequence')) {
                    controller.close();
                    reader.releaseLock();
                    return;
                  }
                }
              } else if (tChunk.type === "thinking" || tChunk.type === "redacted_thinking" || tChunk.type === "signature_delta") {
                // Only push non-chunked thinking/signature blocks to inputs for context preservation
                const lastInput = this.inputs[this.inputs.length - 1];
                if (lastInput.type !== "thinking" && lastInput.type !== "signature_delta") {
                  this.inputs.push(tChunk);
                } else {
                  if (tChunk.type === "thinking") {
                    (this.inputs[this.inputs.length - 1].content[0] as {thinking: string}).thinking += (tChunk.content[0] as {thinking: string}).thinking;
                  } else {
                    (this.inputs[this.inputs.length - 1].content[0] as {signature: string}).signature += (tChunk.content[0] as {signature: string}).signature;
                  }
                }
                controller.enqueue(tChunk);
              } else if (tChunk.type === "tool_use") {
                this.inputs.push(tChunk);
                controller.enqueue({
                  id: tChunk.id,
                  role: tChunk.role,
                  content: tChunk.content,
                  type: 'tool_use'
                })
                if (onTool && tChunk.content[0].type === "tool_use" ) {
                  const toolUse = tChunk.content[0] as ToolUseBlock;
                  const cacheEntry:ToolInputDelta = { input: tChunk.content[0].input} as unknown as ToolInputDelta
                  const partial = cacheEntry?.partial || (cacheEntry as unknown as {input: string}).input;
                  if (partial) {
                    try {
                      toolUse.input = JSON.parse(partial)
                    } catch {
                    }
                  } else {
                    toolUse.input = typeof partial === "string" ? JSON.parse(partial === "" ? "{}" : partial) : partial;
                  }
  
                  // Interrupt current generation immediately so we can continue after tool_result
                  this.stoppingCriteria.interrupt();

                  await onTool.bind(this)(tChunk, this.options.signal);
                  const lastOutput = this.inputs[this.inputs.length - 1];
                  if (lastOutput.content[0].type !== 'tool_result') {
                      throw new Error("Tool call finished but expected to have a user reply with the tool response");
                  }
    
                  lastOutput.content[0] = {
                    ...lastOutput.content[0],
                    name: (tChunk.content[0] as ToolUseBlock).name
                  } as ToolResultBlock;

                  controller.enqueue({
                    id: v4(),
                    role:'assistant',
                    content: lastOutput.content,
                    type: 'tool_result'
                  });

                  // Immediately start next generation using the tool output, mirroring OpenAI behavior
                  const newStream = await getNext.bind(this)();
                  const oldReader = reader;
                  reader = newStream.getReader()
                  oldReader.releaseLock()
                }
              } 
            } catch (err: unknown) {
              console.error('Error in transformAutoMode:', err);
              const errorBlock: ErrorBlock = {
                type: "error",
                message: (err as Error).message
              }
              controller.enqueue({
                id: v4(),
                role:'assistant',
                type: 'error',
                content: [errorBlock]
              } as Message)
            }
          }
          controller.close();
          reader.releaseLock()
        }
      })
      return stream as ReadableStreamWithAsyncIterable<AChunk>
    }


}