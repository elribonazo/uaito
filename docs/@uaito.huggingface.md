<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / @uaito/huggingface

# @uaito/huggingface

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [HuggingFaceONNXModels](@uaito.huggingface.Enumeration.HuggingFaceONNXModels.md) | An enumeration of the available Hugging Face ONNX models that are optimized for web execution. These models are suitable for running locally in the browser with WebGPU or WASM. |

## Classes

| Class | Description |
| ------ | ------ |
| [HuggingFaceONNX](@uaito.huggingface.Class.HuggingFaceONNX.md) | A class for running Hugging Face ONNX models locally in the browser using WebGPU or WASM. It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK, handling model loading, tokenization, stream processing, and tool usage. |
| [HuggingFaceONNXTextToAudio](@uaito.huggingface.Class.HuggingFaceONNXTextToAudio.md) | A class for handling text-to-audio generation using a Hugging Face ONNX model. It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK for loading models, processing inputs, and generating audio streams. |
| [HuggingFaceONNXTextToImage](@uaito.huggingface.Class.HuggingFaceONNXTextToImage.md) | A class for handling text-to-image generation using a Hugging Face ONNX model locally in the browser. It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK, managing the loading of multimodal models, processing inputs, and generating images. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [DType](@uaito.huggingface.TypeAlias.DType.md) | A union of possible data types for model quantization and execution. `auto` allows the library to choose the best type based on the model and hardware. Other values specify the precision, like `fp32` (32-bit float) or `q4` (4-bit quantized). |
| [HuggingFaceONNXOptions](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md) | Defines the configuration options for the `HuggingFaceONNX` client. It extends `BaseLLMOptions` with properties specific to running ONNX models, such as the model identifier, data type, and execution device. |
| [TensorDataType](@uaito.huggingface.TypeAlias.TensorDataType.md) | Defines the structure of tensor data required by Hugging Face models, including input IDs, attention mask, and optional token type IDs. |

## Functions

| Function | Description |
| ------ | ------ |
| [encodeWAV](@uaito.huggingface.Function.encodeWAV.md) | Encodes raw audio samples into a WAV format `ArrayBuffer`. This is a utility function for creating a valid WAV file from audio data. |
| [share](@uaito.huggingface.Function.share.md) | A utility function to share a generated audio file to a Hugging Face Space discussion. This is primarily for demonstration and sharing purposes. |
