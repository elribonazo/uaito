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

Defined in: [domain/types.ts:812](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/sdk/src/domain/types.ts#L812)

Represents a readable stream with an async iterable.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
