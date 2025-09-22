[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/huggingface](../README.md) / HuggingFaceONNXOptions

# Type Alias: HuggingFaceONNXOptions

> **HuggingFaceONNXOptions** = `BaseLLMOptions` & `object`

Defined in: [types.ts:47](https://github.com/elribonazo/uaito/blob/31c0fa3f3740ebed4d8141441f73c3b47e4aa6f9/packages/huggingFace/src/types.ts#L47)

Type alias for Hugging Face ONNX options, extending BaseLLMOptions with model, dtype, and device.

## Type Declaration

### device

> **device**: `"auto"` \| `"webgpu"` \| `"cpu"` \| `"cuda"` \| `"gpu"` \| `"wasm"` \| `"dml"` \| `"webnn"` \| `"webnn-npu"` \| `"webnn-gpu"` \| `"webnn-cpu"` \| `Record`\<`string`, `"auto"` \| `"webgpu"` \| `"cpu"` \| `"cuda"` \| `"gpu"` \| `"wasm"` \| `"webnn-cpu"`\> \| `undefined`

The device to run the model on.

### dtype

> **dtype**: [`DType`](DType.md)

The data type for the model.

### model

> **model**: [`HuggingFaceONNXModels`](../enumerations/HuggingFaceONNXModels.md)

The Hugging Face ONNX model to use.
