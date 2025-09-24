[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / Message

# Type Alias: Message

> **Message** = `object`

Defined in: [domain/types.ts:729](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L729)

Represents a message.

## Properties

### chunk?

> `optional` **chunk**: `boolean`

Defined in: [domain/types.ts:749](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L749)

Whether the message is a chunk.

***

### content

> **content**: [`BlockType`](BlockType.md)[]

Defined in: [domain/types.ts:744](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L744)

The content of the message.

***

### id

> **id**: `string`

Defined in: [domain/types.ts:734](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L734)

The unique ID of the message.

***

### role

> **role**: [`Role`](Role.md)

Defined in: [domain/types.ts:754](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L754)

The role of the message.

***

### type

> **type**: [`MessageType`](MessageType.md)

Defined in: [domain/types.ts:739](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/sdk/src/domain/types.ts#L739)

The type of the message.
