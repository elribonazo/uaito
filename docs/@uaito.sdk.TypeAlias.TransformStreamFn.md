<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / TransformStreamFn

# Type Alias: TransformStreamFn()\<T, M\>

```ts
type TransformStreamFn<T, M> = (chunk) => Promise<M | null>;
```

Defined in: [domain/types.ts:11](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/sdk/src/domain/types.ts#L11)

Represents a function that transforms a chunk of data in a stream.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of the input chunk. |
| `M` | The type of the output message. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `chunk` | `T` | The input chunk to be transformed. |

## Returns

`Promise`\<`M` \| `null`\>

A promise that resolves to the transformed message or null.
