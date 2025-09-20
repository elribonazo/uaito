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
  MusicgenForConditionalGeneration,
  BaseStreamer,
} from "@huggingface/transformers";

import { BaseLLM } from "./Base";
import { MessageArray } from "../utils";

class CallbackStreamer extends BaseStreamer {
  callback_fn: any;
  constructor(callback_fn: any) {
    super();
    this.callback_fn = callback_fn;
  }

  put(value) {
    return this.callback_fn(value);
  }

  end() {
    return this.callback_fn();
  }
}

// Adapted from https://www.npmjs.com/package/audiobuffer-to-wav
export function encodeWAV(samples, sampleRate = 16000) {
  let offset = 44;
  const buffer = new ArrayBuffer(offset + samples.length * 4);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, "RIFF");
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 4, true);
  /* RIFF type */
  writeString(view, 8, "WAVE");
  /* format chunk identifier */
  writeString(view, 12, "fmt ");
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 3, true);
  /* channel count */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 4, true);
  /* bits per sample */
  view.setUint16(34, 32, true);
  /* data chunk identifier */
  writeString(view, 36, "data");
  /* data chunk length */
  view.setUint32(40, samples.length * 4, true);

  for (let i = 0; i < samples.length; ++i, offset += 4) {
    view.setFloat32(offset, samples[i], true);
  }

  return buffer;
}
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; ++i) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export async function share(body, settings) {
  const response = await fetch("https://huggingface.co/uploads", {
    method: "POST",
    body,
  });
  if (!response.ok)
    throw new Error(`Failed to upload audio: ${response.statusText}`);
  const url = await response.text();

  const params = new URLSearchParams({
    title: `🎵 ${settings.prompt}`,
    description: `<audio controls src="${url}"></audio>\n${JSON.stringify(settings, null, 2)}`,
  });

  const shareURL = `https://huggingface.co/spaces/Xenova/musicgen-web/discussions/new?${params.toString()}`;
  window.open(shareURL, "_blank");
}

export class HuggingFaceONNXTextToAudio extends BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions> {

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
    const modelId = 'Xenova/musicgen-small';

    const config = await AutoConfig.from_pretrained(modelId);
    this.model ??= await MusicgenForConditionalGeneration.from_pretrained(modelId, {
        ...config,
      dtype: {
        text_encoder: "q8",
        decoder_model_merged: "q8",
        encodec_decode: "fp32",
      },
    device: 'wasm',
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
    await this.load();
    const stream = new ReadableStream<Message>({
      start: async (controller) => {
        const duration = 35;

        const max_length = Math.min(
          Math.max(Math.floor(duration * 50), 1) + 4,
          this.model?.generation_config?.max_length ?? 1500,
        );
    
        // Create a streamer to update progress
        let num_tokens = 0;
        const streamer = new CallbackStreamer((value) => {
          const percent = value === undefined ? 1 : ++num_tokens / max_length;
          this.log(`Generating (${(percent * 100).toFixed()}%)...`);
          if (this.options.onProgress) {
            this.options.onProgress(percent);
          }
        });
    
        // Tokenize input text
        const inputs = this.tokenizer(prompt);
        // Generate music
        const audio_values = await this.model.generate({
          // Inputs
          ...inputs,
    
          // Generation parameters
          max_length,
          guidance_scale:3,
          temperature:1,
    
          // Outputs
          streamer,
        }) as any;
    
    
        // Encode audio values to WAV
        const sampling_rate = 16000;
        const wav = encodeWAV(audio_values.data, sampling_rate);
        const blob = new Blob([wav], { type: "audio/wav" });

        const message: Message = {
            id: v4(),
            role: 'assistant',
            type: 'message',
            content: [
              { type: 'text', text: `<audio>${URL.createObjectURL(blob)}</audio>` },
            ]
        };

        controller.enqueue(message);
        controller.close();
      },
    });
    return stream as ReadableStreamWithAsyncIterable<Message>;
  }
}