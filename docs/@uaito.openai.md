<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / @uaito/openai

# @uaito/openai

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [GrokModels](@uaito.openai.Enumeration.GrokModels.md) | An enumeration of the available Grok models. |
| [OpenAIImageModels](@uaito.openai.Enumeration.OpenAIImageModels.md) | An enumeration of the available OpenAI image generation models. |
| [OpenAIModels](@uaito.openai.Enumeration.OpenAIModels.md) | An enumeration of the available OpenAI models that can be used with the SDK. Each enum member maps to a specific model identifier provided by OpenAI. |

## Classes

| Class | Description |
| ------ | ------ |
| [OpenAI](@uaito.openai.Class.OpenAI.md) | A class for interacting with OpenAI-compatible APIs, including OpenAI and Grok. It extends the `BaseLLM` class to provide a standardized interface for streaming responses, handling tool usage (including image generation), and managing conversation history. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ImageGenConfig](@uaito.openai.TypeAlias.ImageGenConfig.md) | Defines the configuration for image generation when using the OpenAI provider. |
| [OpenAIOptions](@uaito.openai.TypeAlias.OpenAIOptions.md) | Defines the configuration options for the `OpenAI` client, which can be used for both OpenAI and Grok providers. It extends `BaseLLMOptions` with provider-specific properties. |
