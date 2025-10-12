<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / HuggingFaceONNXModels

# Enumeration: HuggingFaceONNXModels

Defined in: [types.ts:31](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/huggingFace/src/types.ts#L31)

An enumeration of the available Hugging Face ONNX models that are optimized for web execution.
These models are suitable for running locally in the browser with WebGPU or WASM.

## Enumeration Members

| Enumeration Member | Value | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="granite"></a> `GRANITE` | `"onnx-community/granite-4.0-micro-ONNX-web"` | A micro-sized version of the Granite model, optimized for web environments. | [types.ts:44](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/huggingFace/src/types.ts#L44) |
| <a id="jano"></a> `JANO` | `"onnx-community/Jan-nano-ONNX"` | A small and efficient model suitable for general-purpose tasks. | [types.ts:35](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/huggingFace/src/types.ts#L35) |
| <a id="lucy"></a> `LUCY` | `"onnx-community/Lucy-ONNX"` | A model with a good balance of performance and size. | [types.ts:39](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/huggingFace/src/types.ts#L39) |
