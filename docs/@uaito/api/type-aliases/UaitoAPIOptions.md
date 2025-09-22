[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/api](../README.md) / UaitoAPIOptions

# Type Alias: UaitoAPIOptions

> **UaitoAPIOptions** = `object` & `BaseLLMOptions`

Defined in: [types.ts:5](https://github.com/elribonazo/uaito/blob/31c0fa3f3740ebed4d8141441f73c3b47e4aa6f9/packages/api/src/types.ts#L5)

## Type Declaration

### agent?

> `optional` **agent**: `string`

### apiKey

> **apiKey**: `string`

### baseUrl?

> `optional` **baseUrl**: `string`

### inputs?

> `optional` **inputs**: `MessageArray`\<`MessageInput`\>

### model?

> `optional` **model**: `string`

### provider

> **provider**: `LLMProvider.Anthropic` \| `LLMProvider.OpenAI`

### signal?

> `optional` **signal**: `AbortSignal`
