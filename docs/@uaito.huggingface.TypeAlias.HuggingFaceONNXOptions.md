<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

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

Defined in: [types.ts:152](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/huggingFace/src/types.ts#L152)

Type alias for Hugging Face ONNX options, extending BaseLLMOptions with model, dtype, and device.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `device` | \| `"auto"` \| `"webgpu"` \| `"cpu"` \| `"cuda"` \| `"gpu"` \| `"wasm"` \| `"dml"` \| `"webnn"` \| `"webnn-npu"` \| `"webnn-gpu"` \| `"webnn-cpu"` \| `Record`\<`string`, `"auto"` \| `"webgpu"` \| `"cpu"` \| `"cuda"` \| `"gpu"` \| `"wasm"` \| `"webnn-cpu"`\> \| `undefined` | The device to run the model on. | [types.ts:167](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/huggingFace/src/types.ts#L167) |
| `dtype` | [`DType`](@uaito.huggingface.TypeAlias.DType.md) | The data type for the model. | [types.ts:162](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/huggingFace/src/types.ts#L162) |
| `model` | [`HuggingFaceONNXModels`](@uaito.huggingface.Enumeration.HuggingFaceONNXModels.md) | The Hugging Face ONNX model to use. | [types.ts:157](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/huggingFace/src/types.ts#L157) |
