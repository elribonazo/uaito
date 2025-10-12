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

Defined in: [domain/types.ts:11](https://github.com/elribonazo/uaito/blob/196a16fe5e5b60bfd7ea97e89a09a17b4f97d7ed/packages/sdk/src/domain/types.ts#L11)

A function that transforms a chunk of data from a provider's stream into the SDK's standard `Message` format.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of the input chunk from the provider's stream. |
| `M` | The type of the output message, which must extend `Message`. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `chunk` | `T` | The input chunk to be transformed. |

## Returns

`Promise`\<`M` \| `null`\>

A promise that resolves to the transformed message or null if the chunk should be ignored.
