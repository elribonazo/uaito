<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / @uaito/anthropic

# @uaito/anthropic

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [AnthropicModels](@uaito.anthropic.Enumeration.AnthropicModels.md) | An enumeration of the available Anthropic models that can be used with the SDK. Each enum member maps to a specific model identifier provided by Anthropic. |

## Classes

| Class | Description |
| ------ | ------ |
| [Anthropic](@uaito.anthropic.Class.Anthropic.md) | A class for interacting with the Anthropic API, providing a standardized interface for streaming responses, handling tool usage, and managing conversation history. It extends the `BaseLLM` class to ensure compatibility with the Uaito SDK. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AnthropicOptions](@uaito.anthropic.TypeAlias.AnthropicOptions.md) | Defines the configuration options for the `Anthropic` LLM client. It extends the `BaseLLMOptions` with an optional `apiKey`. |
