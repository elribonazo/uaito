<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ReadableStreamWithAsyncIterable

# Type Alias: ReadableStreamWithAsyncIterable\<T\>

```ts
type ReadableStreamWithAsyncIterable<T> = ReadableStream<T> & AsyncIterable<T>;
```

Defined in: [domain/types.ts:874](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L874)

A type that combines a `ReadableStream` with an `AsyncIterable`, allowing it to be used
with both `for await...of` loops and standard stream consumers.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
