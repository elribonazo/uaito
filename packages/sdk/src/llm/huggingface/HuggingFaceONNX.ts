import {
  Message as HMessage,
  PreTrainedTokenizer,
  PreTrainedModel,
  Tensor,
  InterruptableStoppingCriteria,
  AutoTokenizer,
  AutoConfig,
  AutoModelForCausalLM,
  TextStreamer,
} from "@huggingface/transformers";
import { v4 } from "uuid";

import { BaseLLM } from "@/domain/BaseLLM";
import { MessageType, BaseLLMCache, MessageInput, OnTool, TextBlock, ToolUseBlock, ToolResultBlock, ImageBlock, ReadableStreamWithAsyncIterable, ErrorBlock, ToolInputDelta, Message } from "@/domain/types";
import { LLMProvider } from "@/types";
import { MessageArray } from "@/utils";
import { TensorDataType, HuggingFaceONNXOptions } from "./types";
import { MessageCache } from "./utils";

/**
 * End tag for an imitation.
 * @type {string}
 */
const IM_END_TAG = '<|im_end|>';
/**
 * Cache for storing pre-trained models.
 * @type {Map<string, PreTrainedModel>}
 */
const modelCache = new Map<string, PreTrainedModel>();
/**
 * Cache for storing pre-trained tokenizers.
 * @type {Map<string, PreTrainedTokenizer>}
 */
const tokenizerCache = new Map<string, PreTrainedTokenizer>();

/**
 * Represents a Hugging Face message.
 * @interface
 */
type HuggingFaceMessage = HMessage & {
  type?: MessageType,
  id?: string
}

/**
 * Represents a generative model.
 * @interface
 */
type GenerativeModel = PreTrainedModel & {
  generate: (inputs: unknown, options?: unknown) => Promise<unknown>;
};

/**
 * Represents the output of a generation task.
 * @interface
 */
type GenerateOutput = {
  sequences: Tensor,
  past_key_values: unknown
}




/**
 * A class for handling Hugging Face ONNX models.
 * @export
 * @class HuggingFaceONNX
 * @extends {BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>}
 */
export class HuggingFaceONNX extends BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions> {
  /**
   * The cache for the LLM.
   * @public
   * @type {BaseLLMCache & { thinkingId?: string | null, textId?: string | null, imageId?: string | null }}
   */
  public cache: BaseLLMCache & { thinkingId?: string | null, textId?: string | null, imageId?: string | null } = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } }
  /**
   * The progress of loading the model.
   * @public
   * @type {number}
   */
  public loadProgress: number = 0;
  /**
   * An array of message inputs.
   * @public
   * @type {MessageArray<MessageInput>}
   */
  public inputs: MessageArray<MessageInput> = new MessageArray();
  /**
   * The tokenizer for the model.
   * @private
   * @type {PreTrainedTokenizer}
   */
  private tokenizer!: PreTrainedTokenizer;
  /**
   * The pre-trained model.
   * @private
   * @type {PreTrainedModel}
   */
  private model!: PreTrainedModel;
  /**
   * The stopping criteria for the model.
   * @private
   * @type {InterruptableStoppingCriteria}
   */
  private stoppingCriteria = new InterruptableStoppingCriteria();
  /**
   * The message cache for the model.
   * @private
   * @type {MessageCache}
   */
  private messageCache!: MessageCache;




  /**
   * Creates an instance of HuggingFaceONNX.
   * @param {{ options: HuggingFaceONNXOptions }} { options } - The options for the LLM.
   * @param {OnTool} [onTool] - Optional callback for tool usage.
   */
  constructor(
    { options }: { options: HuggingFaceONNXOptions },
    public onTool?: OnTool
  ) {
    super(LLMProvider.Local, options);
    this.data.progress = 0;
  }

  /**
   * Processes a chunk of the response stream.
   * @private
   * @param {string} chunk - The chunk to process.
   * @returns {Promise<Message | null>} The processed message or null.
   */
  private async chunk(chunk: string): Promise<Message | null> {
    return this.messageCache.processChunk(chunk);
  }


  /**
   * Runs an abortable promise.
   * @template Fn
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
   * Loads the model and tokenizer.
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
      const config = await AutoConfig.from_pretrained(modelId);

      this.model ??= await AutoModelForCausalLM.from_pretrained(modelId, {
        device: this.options.device ?? "webgpu",
        dtype: this.options.dtype ?? "auto",
        config: {
          ...config,
          'transformers.js_config': {
            ...config["transformers.js_config"],
            kv_cache_dtype: {
              "q4f16": "float16" as const,
              "fp16": "float16" as const
            } as never
          }
        },
        progress_callback: (info: Record<string, unknown>) => {
          if (info.status === "progress") {
            const progress = parseInt(info.progress as string, 10);
            this.data.progress = progress;
            if (this.options.onProgress) {
              this.options.onProgress(progress);
            }
          } else {
            this.log(`Model loading status: ${info.status}`);
          }
        },
      });
      modelCache.set(modelId, this.model);
    }
    this.log(`Model loaded: ${modelId}`);
  }

  /**
   * Converts a MessageInput object to a HuggingFaceMessage object.
   * @private
   * @param {MessageInput} message - The MessageInput object to convert.
   * @returns {HuggingFaceMessage} The converted HuggingFaceMessage object.
   */
  private fromInputToParam(message: MessageInput): HuggingFaceMessage {
    const { content } = message;
    const textContent = content
      .filter((c): c is TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("\n\n");

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

    const finalContent = [textContent].filter(Boolean).join('\n\n');
    return {
      role: message.role,
      content: finalContent,
    };
  }

  /**
   * Gets the tensor data for the model.
   * @private
   * @returns {TensorDataType} The tensor data.
   */
  private getTensorData() {
    const currentInputs = MessageArray.from(this.inputs).map(this.fromInputToParam);
    this.log(`Current inputs: ${JSON.stringify(currentInputs)}`);
    const tensor = this.tokenizer.apply_chat_template(currentInputs, {
      add_generation_prompt: true,
      return_dict: true,
      tools: this.options.tools,
    }) as TensorDataType;

    this.log(`Tensor created. Shape: ${tensor.input_ids.dims}`);

    return tensor;
  }

  /**
   * Creates a readable stream of strings.
   * @returns {Promise<ReadableStreamWithAsyncIterable<string>>} A promise that resolves to a readable stream of strings.
   */
  async createStream(): Promise<ReadableStreamWithAsyncIterable<string>> {
    const input = this.getTensorData();
    const stopping_criteria = new InterruptableStoppingCriteria();

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
                  .batch_decode(sequences.slice(null, [input.input_ids.dims[1], 0]), {
                    skip_special_tokens: false,
                  })[0]
                  .replace(IM_END_TAG, "");
                  
                this.inputs.push({
                  id: v4(),
                  role: 'assistant',
                  type: 'message',
                  content: [{ type: 'text', text: response }]
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
   * Adds default items to the inputs.
   * @private
   * @param {string} prompt - The user prompt.
   * @param {string} chainOfThought - The chain of thought for the task.
   * @param {string} system - The system prompt.
   */
  private addDefaultItems(prompt: string, chainOfThought: string, system: string) {
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
    this.inputs = MessageArray.from(
      [
        ...this.inputs,
        { role: 'user', content: [{ type: 'text', text: `${prompt}${chainOfThought !== '' ? `\r\n\r\n${chainOfThought}` : ''}` }] }
      ]
    )
  }

  

  /**
   * Performs a task stream using the LLM.
   * @param {string} prompt - The user prompt.
   * @param {string} chainOfThought - The chain of thought for the task.
   * @param {string} system - The system prompt.
   * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of messages.
   */
  async performTaskStream(prompt: string, chainOfThought: string, system: string): Promise<ReadableStreamWithAsyncIterable<Message>> {
    this.stoppingCriteria.reset();
    this.messageCache = new MessageCache(this.options.tools ?? [], this.log);

    this.log("Starting performTaskStream");
    await this.load();
    this.addDefaultItems(prompt, system, chainOfThought);
    const rawStream = await this.createStream();
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
   * Transforms an input stream using the provided transform function.
   * @template T The type of the input chunk.
   * @template S The type of the output stream, extending ReadableStream.
   * @param {S} input - The input stream to be transformed.
   * @param {TransformStreamFn<T, S>} transform - The function to transform each chunk.
   * @returns {Promise<ReadableStream<S>>} A promise that resolves to the transformed readable stream.
   */
   override async transformAutoMode<AChunk extends Message> (
      input: ReadableStreamWithAsyncIterable<AChunk>,
      getNext: () => Promise<ReadableStreamWithAsyncIterable<AChunk>>,
      onTool?:OnTool
    ) {
      let activateLoop = false;
      const stream = new ReadableStream({
         start: async (controller) => {
          let reader: ReadableStreamDefaultReader<AChunk> = input.getReader();
          while (true) {
            const readerResult = await reader.read();
            if (readerResult.done) {
              if (activateLoop) {
                activateLoop = false;
                const newStream = await getNext.bind(this)();
                const oldReader = reader;
                reader = newStream.getReader()
                oldReader.releaseLock()
              } else {
                break;
              }
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
              } else if (tChunk.type === "thinking" || tChunk.type === "redacted_thinking" || tChunk.type === "signature_delta") {
                // Only push non-chunked thinking/signature blocks to inputs for context preservation
                const lastInput = this.inputs[this.inputs.length - 1];
                if (lastInput.type !== "thinking" && lastInput.type !== "signature_delta") {
                  this.inputs.push(tChunk);
                } else {
                  if (tChunk.type === "thinking") {
                    (this.inputs[this.inputs.length - 1].content[0] as any).thinking += (tChunk.content[0] as any).thinking;
                  } else {
                    (this.inputs[this.inputs.length - 1].content[0] as any).signature += (tChunk.content[0] as any).signature;
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
                  const cacheEntry:ToolInputDelta = { input: tChunk.content[0].input} as any
                  const partial = cacheEntry?.partial || (cacheEntry as any).input;
                  if (partial) {
                    try {
                      toolUse.input = JSON.parse(partial)
                    } catch {
                    }
                  } else {
                    toolUse.input = typeof partial === "string" ? JSON.parse(partial === "" ? "{}" : partial) : partial;
                  }
  
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

                  activateLoop = true;
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