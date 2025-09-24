[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/api](../README.md) / UaitoAPIOptions

# Type Alias: UaitoAPIOptions

> **UaitoAPIOptions** = `object` & `BaseLLMOptions`

Defined in: [types.ts:5](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/api/src/types.ts#L5)

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
