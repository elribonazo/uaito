[**@uaito/sdk**](../README.md)

***

[@uaito/sdk](../packages.md) / Message

# Type Alias: Message

> **Message** = `object`

Defined in: [domain/types.ts:724](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L724)

Represents a message.

## Properties

### chunk?

> `optional` **chunk**: `boolean`

Defined in: [domain/types.ts:744](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L744)

Whether the message is a chunk.

***

### content

> **content**: [`BlockType`](BlockType.md)[]

Defined in: [domain/types.ts:739](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L739)

The content of the message.

***

### id

> **id**: `string`

Defined in: [domain/types.ts:729](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L729)

The unique ID of the message.

***

### role

> **role**: [`Role`](Role.md)

Defined in: [domain/types.ts:749](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L749)

The role of the message.

***

### type

> **type**: [`MessageType`](MessageType.md)

Defined in: [domain/types.ts:734](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L734)

The type of the message.
