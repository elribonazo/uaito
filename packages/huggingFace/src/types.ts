import { BaseLLMOptions } from "@uaito/sdk";
import { Tensor } from "@huggingface/transformers";

/**
 * Type alias for tensor data types.
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
     * The token type IDs tensor.
     * @type {(Tensor | undefined)}
     */
    token_type_ids?: Tensor;
}
/**
 * Enumeration of the available Hugging Face ONNX models.
 * @enum {string}
 */
export enum HuggingFaceONNXModels {
    /**
     * The JANO model.
     */
    JANO = "onnx-community/Jan-nano-ONNX",
    /**
     * The LUCY model.
     */
    LUCY="onnx-community/Lucy-ONNX",
    /**
     * The QWEN3 model.
     */
    QWEN3 = "onnx-community/Qwen3-0.6B-ONNX"
  }
/**
 * Type alias for Hugging Face ONNX options, extending BaseLLMOptions with model, dtype, and device.
 * @type
 */
export type HuggingFaceONNXOptions =  BaseLLMOptions & {
    /**
     * The Hugging Face ONNX model to use.
     * @type {HuggingFaceONNXModels}
     */
    model: HuggingFaceONNXModels,
    /**
     * The data type for the model.
     * @type {DType}
     */
    dtype: DType,
    /**
     * The device to run the model on.
     * @type {("auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu" | Record<string, "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm"  | "webnn-cpu"> | undefined)}
     */
    device: "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu" | Record<string, "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm"  | "webnn-cpu"> | undefined
  };
  
  /**
   * Type alias for the data types supported by the model.
   * @type
   */
  export type DType = "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16" | Record<string, "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16"> | undefined
  
  