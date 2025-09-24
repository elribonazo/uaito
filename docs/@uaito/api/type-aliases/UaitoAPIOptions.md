[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/api](../README.md) / UaitoAPIOptions

# Type Alias: UaitoAPIOptions

> **UaitoAPIOptions** = `object` & `BaseLLMOptions`

Defined in: [types.ts:5](https://github.com/elribonazo/uaito/blob/2bed7d2eb6bfa6c768bdfa8c5f599b6d51e03cd7/packages/api/src/types.ts#L5)

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
