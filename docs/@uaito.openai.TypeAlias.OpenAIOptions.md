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

Defined in: [types.ts:95](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/openai/src/types.ts#L95)

Defines the configuration options for the `OpenAI` client, which can be used for both
OpenAI and Grok providers. It extends `BaseLLMOptions` with provider-specific properties.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `apiKey?` | `string` | The API key for the selected provider. | [types.ts:106](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/openai/src/types.ts#L106) |
| `baseURL?` | `string` | An optional base URL for the API, useful for proxying or using custom endpoints. | [types.ts:111](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/openai/src/types.ts#L111) |
| `imageGenConfig?` | [`ImageGenConfig`](@uaito.openai.TypeAlias.ImageGenConfig.md) | Optional configuration for image generation when using the OpenAI provider. | [types.ts:121](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/openai/src/types.ts#L121) |
| `model` | `LLMProviderToOpenAIModel`\[`T`\] | The specific model to use, which is typed based on the selected provider. | [types.ts:116](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/openai/src/types.ts#L116) |
| `type` | `T` | The type of the provider, either `LLMProvider.OpenAI` or `LLMProvider.Grok`. | [types.ts:101](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/openai/src/types.ts#L101) |

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `OpenAIProviderType` |
