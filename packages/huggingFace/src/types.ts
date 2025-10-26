import type { BaseLLMOptions } from "@uaito/sdk";
import type { Tensor } from "@huggingface/transformers";

/**
 * Defines the structure of tensor data required by Hugging Face models,
 * including input IDs, attention mask, and optional token type IDs.
 * @type
 */
export type TensorDataType = {
    /**
     * The input IDs tensor.
     * @type {Tensor}
     */
    input_ids: Tensor;
    /**
     * The attention mask tensor.
     * @type {Tensor}
     */
    attention_mask: Tensor;
    /**
     * Optional tensor for token type IDs, used in models that distinguish between different sentences.
     * @type {(Tensor | undefined)}
     */
    token_type_ids?: Tensor;
}
/**
 * An enumeration of the available Hugging Face ONNX models that are optimized for web execution.
 * These models are suitable for running locally in the browser with WebGPU or WASM.
 * @enum {string}
 */
export enum HuggingFaceONNXModels {
    JANO = "onnx-community/Jan-nano-ONNX",

    
    LUCY="onnx-community/Lucy-ONNX",
    LUCY_128K='onnx-community/Lucy-128k-ONNX',

    GRANITE="onnx-community/granite-4.0-micro-ONNX-web",
    
    GEMMA3='onnx-community/gemma-3-1b-it-ONNX-GQA'

  }

/**
 * Defines the configuration options for the `HuggingFaceONNX` client.
 * It extends `BaseLLMOptions` with properties specific to running ONNX models,
 * such as the model identifier, data type, and execution device.
 * @type
 */
export type HuggingFaceONNXOptions =  BaseLLMOptions & {
    /**
     * The identifier of the Hugging Face ONNX model to use.
     * @type {HuggingFaceONNXModels}
     */
    model: HuggingFaceONNXModels,
    /**
     * The data type (precision) to use for the model, e.g., 'fp32' or 'q4'.
     * Can be a single value or a record specifying different types for different model parts.
     * @type {DType}
     */
    dtype: DType,
    /**
     * The device to run the model on, e.g., 'webgpu' or 'wasm'.
     * Can be a single value or a record specifying different devices for different model parts.
     * @type {("auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu" | Record<string, "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm"  | "webnn-cpu"> | undefined)}
     */
    device: "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu" | Record<string, "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm"  | "webnn-cpu"> | undefined
  };
  
  /**
   * A union of possible data types for model quantization and execution.
   * `auto` allows the library to choose the best type based on the model and hardware.
   * Other values specify the precision, like `fp32` (32-bit float) or `q4` (4-bit quantized).
   * @type
   */
  export type DType = "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16" | Record<string, "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16"> | undefined
  
  