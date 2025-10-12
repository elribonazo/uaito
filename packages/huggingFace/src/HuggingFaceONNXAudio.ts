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

import { MessageArray } from "@uaito/sdk";
import { BaseLLM } from "@uaito/sdk";
import { HuggingFaceONNXOptions } from "./types";

/**
 * A custom streamer class that extends `BaseStreamer` to execute a callback function
 * for each value that is streamed. This is useful for tracking the progress of a generation task.
 * @class CallbackStreamer
 * @extends {BaseStreamer}
 */
class CallbackStreamer extends BaseStreamer {
  /**
   * The callback function to execute for each streamed value.
   * @type {(value?: any) => any}
   */
  callback_fn: (value?: unknown) => unknown;
  /**
   * Creates an instance of `CallbackStreamer`.
   * @param {(value?: any) => any} callback_fn - The callback function.
   */
  constructor(callback_fn: (value?: unknown) => unknown) {
    super();
    this.callback_fn = callback_fn;
  }

  /**
   * Processes a value from the stream and executes the callback.
   * @param {any} value - The value to process.
   * @returns {any} The result of the callback function.
   */
  put(value: unknown): unknown {
    return this.callback_fn(value);
  }

  /**
   * Finalizes the stream and executes the callback one last time.
   * @returns {any} The result of the callback function.
   */
  end(): unknown {
    return this.callback_fn();
  }
}

/**
 * Encodes raw audio samples into a WAV format `ArrayBuffer`.
 * This is a utility function for creating a valid WAV file from audio data.
 * @param {Float32Array} samples - The raw audio samples to encode.
 * @param {number} [sampleRate=16000] - The sample rate of the audio.
 * @returns {ArrayBuffer} The encoded WAV buffer.
 */
export function encodeWAV(samples: Float32Array, sampleRate = 16000): ArrayBuffer {
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
/**
 * A utility function to write a string to a `DataView` at a specified offset.
 * @param {DataView} view - The `DataView` to write to.
 * @param {number} offset - The offset at which to start writing.
 * @param {string} string - The string to write.
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; ++i) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * A utility function to share a generated audio file to a Hugging Face Space discussion.
 * This is primarily for demonstration and sharing purposes.
 * @param {Blob} body - The audio file as a `Blob`.
 * @param {{ prompt: string }} settings - The settings for the share, including the prompt.
 * @returns {Promise<void>}
 */
export async function share(body: Blob, settings: { prompt: string }): Promise<void> {
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

/**
 * A class for handling text-to-audio generation using a Hugging Face ONNX model.
 * It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK
 * for loading models, processing inputs, and generating audio streams.
 *
 * @class HuggingFaceONNXTextToAudio
 * @extends {BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>}
 *
 * @example
 * ```typescript
 * const audioGenerator = new HuggingFaceONNXTextToAudio({
 *   options: {
 *     model: 'Xenova/musicgen-small', // Or another compatible model
 *   }
 * });
 *
 * await audioGenerator.load();
 * const { response } = await audioGenerator.performTaskStream("An upbeat pop song");
 * for await (const chunk of response) {
 *   // Process the audio message chunk
 * }
 * ```
 */
export class HuggingFaceONNXTextToAudio extends BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions> {

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
   * The multimodal causal language model for audio generation.
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
  private processor!: unknown;
  /**
   * An optional callback function that is triggered when a tool is used.
   * @type {OnTool | undefined}
   */
  public onTool?: OnTool
  /**
   * Creates an instance of `HuggingFaceONNXTextToAudio`.
   * @param {{ options: HuggingFaceONNXOptions }} params - The configuration options for the client.
   * @param {OnTool} [onTool] - An optional callback for handling tool usage.
   */
  constructor({ options }: { options: HuggingFaceONNXOptions },  onTool?: OnTool) {
    super(LLMProvider.Local, options);
    this.data.progress = 0;

    this.onTool = onTool ?? options.onTool;

  }

  /**
   * Loads the audio generation model, processor, and tokenizer from Hugging Face.
   * It provides progress callbacks for monitoring the download and setup process.
   * @returns {Promise<void>}
   */
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

 
  /**
   * Performs the text-to-audio generation task. It tokenizes the input prompt,
   * runs the model to generate audio samples, encodes the samples into a WAV file,
   * and returns the result as a `Message` in a readable stream.
   * @param {string} prompt - The text prompt for the audio generation.
   * @returns {Promise<ReadableStreamWithAsyncIterable<Message>>} A promise that resolves to a readable stream of messages containing the audio.
   */
  async performTaskStream(prompt: string | BlockType[]): Promise<ReadableStreamWithAsyncIterable<Message>> {
    await this.load();
    const stream = new ReadableStream<Message>({
      start: async (controller) => {
        const duration = 6;

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
        const audio_values = await (this.model as unknown as { generate: (inputs: unknown) => Promise<{ data: Float32Array }> }).generate({
          // Inputs
          ...inputs,
    
          // Generation parameters
          max_length,
          guidance_scale:3,
          temperature:1,
    
          // Outputs
          streamer,
        });
    
    
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