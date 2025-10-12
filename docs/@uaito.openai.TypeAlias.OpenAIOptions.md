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

Defined in: [types.ts:32](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/openai/src/types.ts#L32)

Type alias for OpenAI options, extending BaseLLMOptions with an optional apiKey.

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `apiKey?` | `string` | [types.ts:32](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/openai/src/types.ts#L32) |
| `baseURL?` | `string` | [types.ts:32](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/openai/src/types.ts#L32) |
| `model` | `LLMProviderToOpenAIModel`\[`T`\] | [types.ts:32](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/openai/src/types.ts#L32) |
| `type` | `T` | [types.ts:32](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/openai/src/types.ts#L32) |

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `OpenAIProviderType` |
