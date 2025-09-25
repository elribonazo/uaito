[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / HuggingFaceONNXOptions

# Type Alias: HuggingFaceONNXOptions

```ts
type HuggingFaceONNXOptions = BaseLLMOptions & {
  device:   | "auto"
     | "webgpu"
     | "cpu"
     | "cuda"
     | "gpu"
     | "wasm"
     | "dml"
     | "webnn"
     | "webnn-npu"
     | "webnn-gpu"
     | "webnn-cpu"
     | Record<string, "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm" | "webnn-cpu">
     | undefined;
  dtype: DType;
  model: HuggingFaceONNXModels;
};
```

Defined in: [types.ts:47](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/huggingFace/src/types.ts#L47)

Type alias for Hugging Face ONNX options, extending BaseLLMOptions with model, dtype, and device.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `device` | \| `"auto"` \| `"webgpu"` \| `"cpu"` \| `"cuda"` \| `"gpu"` \| `"wasm"` \| `"dml"` \| `"webnn"` \| `"webnn-npu"` \| `"webnn-gpu"` \| `"webnn-cpu"` \| `Record`\<`string`, `"auto"` \| `"webgpu"` \| `"cpu"` \| `"cuda"` \| `"gpu"` \| `"wasm"` \| `"webnn-cpu"`\> \| `undefined` | The device to run the model on. | [types.ts:62](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/huggingFace/src/types.ts#L62) |
| `dtype` | [`DType`](@uaito.huggingface.TypeAlias.DType.md) | The data type for the model. | [types.ts:57](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/huggingFace/src/types.ts#L57) |
| `model` | [`HuggingFaceONNXModels`](@uaito.huggingface.Enumeration.HuggingFaceONNXModels.md) | The Hugging Face ONNX model to use. | [types.ts:52](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/huggingFace/src/types.ts#L52) |
