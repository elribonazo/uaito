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

Defined in: [types.ts:171](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/huggingFace/src/types.ts#L171)

Defines the configuration options for the `HuggingFaceONNX` client.
It extends `BaseLLMOptions` with properties specific to running ONNX models,
such as the model identifier, data type, and execution device.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `device` | \| `"auto"` \| `"webgpu"` \| `"cpu"` \| `"cuda"` \| `"gpu"` \| `"wasm"` \| `"dml"` \| `"webnn"` \| `"webnn-npu"` \| `"webnn-gpu"` \| `"webnn-cpu"` \| `Record`\<`string`, `"auto"` \| `"webgpu"` \| `"cpu"` \| `"cuda"` \| `"gpu"` \| `"wasm"` \| `"webnn-cpu"`\> \| `undefined` | The device to run the model on, e.g., 'webgpu' or 'wasm'. Can be a single value or a record specifying different devices for different model parts. | [types.ts:188](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/huggingFace/src/types.ts#L188) |
| `dtype` | [`DType`](@uaito.huggingface.TypeAlias.DType.md) | The data type (precision) to use for the model, e.g., 'fp32' or 'q4'. Can be a single value or a record specifying different types for different model parts. | [types.ts:182](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/huggingFace/src/types.ts#L182) |
| `model` | [`HuggingFaceONNXModels`](@uaito.huggingface.Enumeration.HuggingFaceONNXModels.md) | The identifier of the Hugging Face ONNX model to use. | [types.ts:176](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/huggingFace/src/types.ts#L176) |
