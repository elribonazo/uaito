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

Defined in: [types.ts:46](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L46)

Type alias for OpenAI options, extending BaseLLMOptions with an optional apiKey.

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `apiKey?` | `string` | [types.ts:49](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L49) |
| `baseURL?` | `string` | [types.ts:50](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L50) |
| `imageGenConfig?` | [`ImageGenConfig`](@uaito.openai.TypeAlias.ImageGenConfig.md) | [types.ts:52](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L52) |
| `model` | `LLMProviderToOpenAIModel`\[`T`\] | [types.ts:51](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L51) |
| `type` | `T` | [types.ts:48](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L48) |

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `OpenAIProviderType` |
