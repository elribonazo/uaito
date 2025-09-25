[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / TransformStreamFn

# Type Alias: TransformStreamFn()\<T, M\>

```ts
type TransformStreamFn<T, M> = (chunk) => Promise<M | null>;
```

Defined in: [domain/types.ts:11](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L11)

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
