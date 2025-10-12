<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ArrayElementType

# Type Alias: ArrayElementType\<T\>

```ts
type ArrayElementType<T> = T extends infer U[] ? U : never;
```

Defined in: [domain/types.ts:654](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/sdk/src/domain/types.ts#L654)

A utility type to extract the element type from an array.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
