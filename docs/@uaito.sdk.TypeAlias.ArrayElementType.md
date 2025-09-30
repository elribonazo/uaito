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

Defined in: [domain/types.ts:633](https://github.com/elribonazo/uaito/blob/3b85b1ba4c186b820d14bf055553422e84019aef/packages/sdk/src/domain/types.ts#L633)

Gets the element type of an array.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
