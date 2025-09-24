[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / BaseLLMCache

# Type Alias: BaseLLMCache

> **BaseLLMCache** = `object`

Defined in: [domain/types.ts:18](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L18)

Represents the cache for a base LLM.

## Properties

### chunks

> **chunks**: `string` \| `null`

Defined in: [domain/types.ts:28](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L28)

The chunks of the response.

***

### tokens

> **tokens**: `object`

Defined in: [domain/types.ts:33](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L33)

The number of input and output tokens.

#### input

> **input**: `number`

#### output

> **output**: `number`

***

### toolInput

> **toolInput**: [`BlockType`](BlockType.md) \| `null`

Defined in: [domain/types.ts:23](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L23)

The input for a tool.
