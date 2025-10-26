import { v4 } from "uuid";

import type {
  BaseLLMCache,
  OnTool,
  ReadableStreamWithAsyncIterable,
  Message,
  MessageInput,
  BlockType,
} from "@uaito/sdk";
import { LLMProvider } from "@uaito/sdk";
import { MessageArray } from "@uaito/sdk";
import type { HuggingFaceONNXOptions } from "./types";

import type {
  PreTrainedTokenizer,
  ImageProcessor,
} from "@huggingface/transformers";
import {
  AutoTokenizer,
  MultiModalityCausalLM,
  AutoProcessor,
  AutoConfig,
} from "@huggingface/transformers";
import { BaseLLM } from "@uaito/sdk";



/**
 * A class for handling text-to-image generation using a Hugging Face ONNX model locally in the browser.
 * It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK,
 * managing the loading of multimodal models, processing inputs, and generating images.
 *
 * @class HuggingFaceONNXTextToImage
 * @extends {BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>}
 *
 * @example
 * ```typescript
 * const imageGenerator = new HuggingFaceONNXTextToImage({
 *   options: {
 *     model: 'onnx-community/Janus-Pro-1B-ONNX', // Or another compatible model
 *   }
 * });
 *
 * await imageGenerator.load();
 * const { response } = await imageGenerator.performTaskStream("A photorealistic image of a cat playing a piano");
 * for await (const chunk of response) {
 *   // Process the image message chunk
 * }
 * ```
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
   * @type {Map<string, {loaded: number, total: number}>}
   */
  public loadProgress = new Map<string, {loaded: number, total: number}>();
  /**
   * An array of message inputs.
   * @public
   * @type {MessageArray<MessageInput>}
   */
  public inputs: MessageArray<MessageInput> = new MessageArray();

  /**
   * The multimodal causal language model for image generation.
   * @private
   * @type {MultiModalityCausalLM}
   */
  private model!: MultiModalityCausalLM;
  /**
   * The tokenizer for processing text inputs.
   * @private
   * @type {PreTrainedTokenizer}
   */
  private tokenizer!: PreTrainedTokenizer;
  /**
   * The processor for handling model-specific input transformations.
   * @private
   * @type {any}
   */
  private processor!: any;
  /**
   * An optional callback function that is triggered when a tool is used.
   * @type {OnTool | undefined}
   */
  public onTool?: OnTool
  /**
   * Creates an instance of `HuggingFaceONNXTextToImage`.
   * @param {{ options: HuggingFaceONNXOptions }} params - The configuration options for the client.
   * @param {OnTool} [onTool] - An optional callback for handling tool usage.
   */
  constructor({ options }: { options: HuggingFaceONNXOptions }, onTool?: OnTool) {
    super(LLMProvider.Local, options);
    this.data.progress = 0;

    this.onTool = onTool ?? options.onTool;
  }

  /**
   * Loads the image generation model, processor, and tokenizer from Hugging Face.
   * It automatically detects support for FP16 and configures the model for optimal performance
   * on the available hardware (WebGPU or WASM).
   * @returns {Promise<void>}
   */
  async load() {
    const modelId = 'onnx-community/Janus-Pro-1B-ONNX';
    async function hasFp16() {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter();
        return adapter.features.has("shader-f16");
      } catch {
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
    },) as MultiModalityCausalLM;
    this.processor ??= await AutoProcessor.from_pretrained(modelId);
    this.tokenizer ??= await AutoTokenizer.from_pretrained(modelId);
  }

 
  /**
   * Performs the text-to-image generation task. It processes the input prompt,
   * runs the model to generate an image, and returns the image as a blob URL
   * within a `Message` object in a readable stream.
   * @param {string} prompt - The text prompt for the image generation.
   * @param {string} [chainOfThought] - The chain of thought for the task (currently unused).
   * @param {string} [system] - The system prompt (currently unused).
   * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of messages containing the image.
   */
  async performTaskStream(prompt: string | BlockType[], chainOfThought?: string, system?: string): Promise<ReadableStreamWithAsyncIterable<Message>> {
    await this.load();
    const stream = new ReadableStream<Message>({
      start: async (controller) => {
        let conversation: {
          role: string;
          content: string;
      }[] = [];
        let options: { chat_template: string } | undefined = undefined;
        
        
        if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
          controller.error(new Error("No prompt provided"));
          return;
        }

        conversation = [
          {
            role: "<|User|>",
            content: prompt
          },
        ];
        if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
          controller.error(new Error("No prompt provided"));
          return;
        }
        options = { chat_template: "text_to_image" }

        const inputs = await this.processor(conversation,options);
        const num_image_tokens = this.processor.num_image_tokens;
        const outputs = await this.model.generate_images({
          ...inputs,
          min_new_tokens: num_image_tokens,
          max_new_tokens: num_image_tokens,
          do_sample: true,
        });
        ;
        const [generatedImage] = outputs;
        const blobUrl = URL.createObjectURL( await generatedImage.toBlob()   );
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