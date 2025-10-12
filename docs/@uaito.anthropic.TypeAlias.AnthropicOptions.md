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

Defined in: [types.ts:20](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/anthropic/src/types.ts#L20)

Type alias for Anthropic options, extending BaseLLMOptions with an optional apiKey.

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `apiKey?` | `string` | [types.ts:20](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/anthropic/src/types.ts#L20) |
