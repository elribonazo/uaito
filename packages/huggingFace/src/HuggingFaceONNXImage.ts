import { v4 } from "uuid";

import type {
  BaseLLMCache,
  OnTool,
  ReadableStreamWithAsyncIterable,
  Message,
  MessageInput,
} from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";
import { MessageArray } from "@uaito/sdk";
import { HuggingFaceONNXOptions } from "./types";

import type {
  PreTrainedTokenizer,
} from "@huggingface/transformers";
import {
  AutoTokenizer,
  MultiModalityCausalLM,
  AutoProcessor,
  AutoConfig,
} from "@huggingface/transformers";
import { BaseLLM } from "@uaito/sdk";



/**
 * A class for handling text-to-image generation using a Hugging Face ONNX model.
 * @class HuggingFaceONNXTextToImage
 * @extends {BaseLLM<LLMProvider.Local>}
 */
export class HuggingFaceONNXTextToImage extends BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions> {

  /**
   * The cache for the LLM.
   * @public
   * @type {BaseLLMCache}
   */
  public cache: BaseLLMCache = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } };
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
   * The multimodal causal language model.
   * @private
   * @type {MultiModalityCausalLM}
   */
  private model!: MultiModalityCausalLM;
  /**
   * The tokenizer for the model.
   * @private
   * @type {PreTrainedTokenizer}
   */
  private tokenizer!: PreTrainedTokenizer;
  /**
   * The processor for the model.
   * @private
   * @type {*}
   */
  private processor!: any;
  public onTool?: OnTool
  /**
   * Creates an instance of HuggingFaceONNXTextToImage.
   * @param {{ options: HuggingFaceONNXOptions }} { options } - The options for the LLM.
   * @param {OnTool} [onTool] - Optional callback for tool usage.
   */
  constructor({ options }: { options: HuggingFaceONNXOptions }, onTool?: OnTool) {
    super(LLMProvider.Local, options);
    this.data.progress = 0;

    this.onTool = onTool ?? options.onTool;
  }

  /**
   * Loads the model and tokenizer.
   * @returns {Promise<void>}
   */
  async load() {
    const modelId = 'onnx-community/Janus-Pro-1B-ONNX';
    async function hasFp16() {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter();
        return adapter.features.has("shader-f16");
      } catch (e) {
        return false;
      }
    }
    const supportsFp16 = await hasFp16();
    const config = await AutoConfig.from_pretrained(modelId);
    this.model ??= await MultiModalityCausalLM.from_pretrained(modelId, {
        ...config,
      dtype: supportsFp16
      ? {
          prepare_inputs_embeds: "q4",
          language_model: "q4f16",
          lm_head: "fp16",
          gen_head: "fp16",
          gen_img_embeds: "fp16",
          image_decode: "fp32",
        }
      : {
          prepare_inputs_embeds: "fp32",
          language_model: "q4",
          lm_head: "fp32",
          gen_head: "fp32",
          gen_img_embeds: "fp32",
          image_decode: "fp32",
        },
    device: {
      prepare_inputs_embeds: "wasm", // TODO use "webgpu" when bug is fixed
      language_model: "webgpu",
      lm_head: "webgpu",
      gen_head: "webgpu",
      gen_img_embeds: "webgpu",
      image_decode: "webgpu",
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
    },) as MultiModalityCausalLM;
    this.processor ??= await AutoProcessor.from_pretrained(modelId);
    this.tokenizer ??= await AutoTokenizer.from_pretrained(modelId);
  }

 
  /**
   * Performs a text-to-image task stream.
   * @param {string} prompt - The prompt for the task.
   * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of messages.
   */
  async performTaskStream(prompt: string): Promise<ReadableStreamWithAsyncIterable<Message>> {
    await this.load();
    const stream = new ReadableStream<Message>({
      start: async (controller) => {
        const conversation = [
          {
            role: "<|User|>",
            content: prompt
          },
        ];
        if (!prompt || prompt.trim() === "") {
          controller.error(new Error("No prompt provided"));
          return;
        }
        const inputs = await this.processor(conversation, { chat_template: "text_to_image" });
        const num_image_tokens = this.processor.num_image_tokens;
        const outputs = await this.model.generate_images({
          ...inputs,
          min_new_tokens: num_image_tokens,
          max_new_tokens: num_image_tokens,
          do_sample: true,
        });
        ;
        const [image] = outputs;
        const blobUrl = URL.createObjectURL( await image.toBlob()   );
        const message: Message = {
            id: v4(),
            role: 'assistant',
            type: 'message',
            content: [
              { type: 'text', text: `<image>${blobUrl}</image>` },
            ]
        };

        controller.enqueue(message);
        controller.close();
      },
    });
    return stream as ReadableStreamWithAsyncIterable<Message>;
  }
}