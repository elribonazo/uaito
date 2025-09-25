<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/openai](@uaito.openai.md) / OpenAIOptions

# Type Alias: OpenAIOptions

```ts
type OpenAIOptions = {
  apiKey?: string;
} & BaseLLMOptions;
```

Defined in: [types.ts:22](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/openai/src/types.ts#L22)

Type alias for OpenAI options, extending BaseLLMOptions with an optional apiKey.

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `apiKey?` | `string` | [types.ts:22](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/openai/src/types.ts#L22) |
