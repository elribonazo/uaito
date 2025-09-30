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

Defined in: [types.ts:18](https://github.com/elribonazo/uaito/blob/e8a99a51ecef50ca2ab658a9a05f1b268e4bdc19/packages/anthropic/src/types.ts#L18)

Type alias for Anthropic options, extending BaseLLMOptions with an optional apiKey.

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `apiKey?` | `string` | [types.ts:18](https://github.com/elribonazo/uaito/blob/e8a99a51ecef50ca2ab658a9a05f1b268e4bdc19/packages/anthropic/src/types.ts#L18) |
