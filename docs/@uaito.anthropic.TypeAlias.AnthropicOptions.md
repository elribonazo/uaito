<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/anthropic](@uaito.anthropic.md) / AnthropicOptions

# Type Alias: AnthropicOptions

```ts
type AnthropicOptions = {
  apiKey?: string;
} & BaseLLMOptions;
```

Defined in: [types.ts:23](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/anthropic/src/types.ts#L23)

Defines the configuration options for the `Anthropic` LLM client.
It extends the `BaseLLMOptions` with an optional `apiKey`.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `apiKey?` | `string` | The API key for authenticating with the Anthropic API. If not provided, the client may attempt to use an environment variable. | [types.ts:29](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/anthropic/src/types.ts#L29) |
