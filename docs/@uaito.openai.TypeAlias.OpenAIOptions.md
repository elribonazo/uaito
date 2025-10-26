<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/openai](@uaito.openai.md) / OpenAIOptions

# Type Alias: OpenAIOptions\<T\>

```ts
type OpenAIOptions<T> = BaseLLMOptions & {
  apiKey?: string;
  baseURL?: string;
  imageGenConfig?: ImageGenConfig;
  model: LLMProviderToOpenAIModel[T];
  type: T;
};
```

Defined in: [types.ts:98](https://github.com/elribonazo/uaito/blob/5e718d4c4365447ef5056696ab53cf4e29d9d11a/packages/openai/src/types.ts#L98)

Defines the configuration options for the `OpenAI` client, which can be used for both
OpenAI and Grok providers. It extends `BaseLLMOptions` with provider-specific properties.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `apiKey?` | `string` | The API key for the selected provider. | [types.ts:109](https://github.com/elribonazo/uaito/blob/5e718d4c4365447ef5056696ab53cf4e29d9d11a/packages/openai/src/types.ts#L109) |
| `baseURL?` | `string` | An optional base URL for the API, useful for proxying or using custom endpoints. | [types.ts:114](https://github.com/elribonazo/uaito/blob/5e718d4c4365447ef5056696ab53cf4e29d9d11a/packages/openai/src/types.ts#L114) |
| `imageGenConfig?` | [`ImageGenConfig`](@uaito.openai.TypeAlias.ImageGenConfig.md) | Optional configuration for image generation when using the OpenAI provider. | [types.ts:124](https://github.com/elribonazo/uaito/blob/5e718d4c4365447ef5056696ab53cf4e29d9d11a/packages/openai/src/types.ts#L124) |
| `model` | `LLMProviderToOpenAIModel`\[`T`\] | The specific model to use, which is typed based on the selected provider. | [types.ts:119](https://github.com/elribonazo/uaito/blob/5e718d4c4365447ef5056696ab53cf4e29d9d11a/packages/openai/src/types.ts#L119) |
| `type` | `T` | The type of the provider, either `LLMProvider.OpenAI` or `LLMProvider.Grok`. | [types.ts:104](https://github.com/elribonazo/uaito/blob/5e718d4c4365447ef5056696ab53cf4e29d9d11a/packages/openai/src/types.ts#L104) |

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `OpenAIProviderType` |
