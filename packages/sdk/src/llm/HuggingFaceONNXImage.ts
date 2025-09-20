import { v4 } from "uuid";

import type {
  BaseLLMCache,
  OnTool,
  ReadableStreamWithAsyncIterable,
  Message,
  HuggingFaceONNXOptions,
  MessageInput,
} from "../types";
import { LLMProvider } from "../types";

import type {
  PreTrainedTokenizer,
} from "@huggingface/transformers";
import {
  AutoTokenizer,
  MultiModalityCausalLM,
  AutoProcessor,
  AutoConfig,
} from "@huggingface/transformers";

import { BaseLLM } from "./Base";
import { MessageArray } from "../utils";



export class HuggingFaceONNXTextToImage extends BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions> {

  public cache: BaseLLMCache = { toolInput: null, chunks: '', tokens: { input: 0, output: 0 } };
  public loadProgress: number = 0;
  public inputs: MessageArray<MessageInput> = new MessageArray();

  private model!: MultiModalityCausalLM;
  private tokenizer!: PreTrainedTokenizer;
  private processor!: any;

  constructor({ options }: { options: HuggingFaceONNXOptions }, public onTool?: OnTool) {
    super(LLMProvider.Local, options);
    this.data.progress = 0;
  }

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

 
  async performTaskStream(prompt: string): Promise<ReadableStreamWithAsyncIterable<Message>> {
    this.log("Starting performTaskStream");
    ;
    await this.load();
    ;
    const stream = new ReadableStream<Message>({
      start: async (controller) => {
        this.log("ReadableStream started for model generation.");
        const conversation = [
          {
            role: "<|User|>",
            content: prompt
          },
        ];
        ;
        const inputs = await this.processor(conversation, { chat_template: "text_to_image" });
        ;
        const num_image_tokens = this.processor.num_image_tokens;
        ;
        const outputs = await this.model.generate_images({
          ...inputs,
          min_new_tokens: num_image_tokens,
          max_new_tokens: num_image_tokens,
          do_sample: true,
        });
        ;
        const [image] = outputs;

        const blobUrl = URL.createObjectURL(
          await image.toBlob()
        );


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