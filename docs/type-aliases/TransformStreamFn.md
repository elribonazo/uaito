[**@uaito/sdk**](../README.md)

***

[@uaito/sdk](../README.md) / TransformStreamFn

# Type Alias: TransformStreamFn()\<T, M\>

> **TransformStreamFn**\<`T`, `M`\> = (`chunk`) => `Promise`\<`M` \| `null`\>

Defined in: [domain/types.ts:11](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L11)

Represents a function that transforms a chunk of data in a stream.

## Type Parameters

### T

`T`

The type of the input chunk.

### M

`M`

The type of the output message.

## Parameters

### chunk

`T`

The input chunk to be transformed.

## Returns

`Promise`\<`M` \| `null`\>

A promise that resolves to the transformed message or null.
