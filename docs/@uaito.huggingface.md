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
| [HuggingFaceONNXModels](@uaito.huggingface.Enumeration.HuggingFaceONNXModels.md) | Enumeration of the available Hugging Face ONNX models. |

## Classes

| Class | Description |
| ------ | ------ |
| [HuggingFaceONNX](@uaito.huggingface.Class.HuggingFaceONNX.md) | A class for handling Hugging Face ONNX models. HuggingFaceONNX |
| [HuggingFaceONNXTextToAudio](@uaito.huggingface.Class.HuggingFaceONNXTextToAudio.md) | A class for handling text-to-audio generation using a Hugging Face ONNX model. HuggingFaceONNXTextToAudio |
| [HuggingFaceONNXTextToImage](@uaito.huggingface.Class.HuggingFaceONNXTextToImage.md) | A class for handling text-to-image generation using a Hugging Face ONNX model. HuggingFaceONNXTextToImage |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [DType](@uaito.huggingface.TypeAlias.DType.md) | Type alias for the data types supported by the model. |
| [HuggingFaceONNXOptions](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md) | Type alias for Hugging Face ONNX options, extending BaseLLMOptions with model, dtype, and device. |
| [TensorDataType](@uaito.huggingface.TypeAlias.TensorDataType.md) | Type alias for tensor data types. |

## Functions

| Function | Description |
| ------ | ------ |
| [encodeWAV](@uaito.huggingface.Function.encodeWAV.md) | Encodes audio samples into a WAV format buffer. |
| [share](@uaito.huggingface.Function.share.md) | Shares a file to Hugging Face. |
