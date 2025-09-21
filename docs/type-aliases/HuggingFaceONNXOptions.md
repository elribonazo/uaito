[**@uaito/sdk**](../README.md)

***

[@uaito/sdk](../README.md) / HuggingFaceONNXOptions

# Type Alias: HuggingFaceONNXOptions

> **HuggingFaceONNXOptions** = [`BaseLLMOptions`](BaseLLMOptions.md) & `object`

Defined in: [llm/huggingface/types.ts:49](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/llm/huggingface/types.ts#L49)

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
