[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ArrayElementType

# Type Alias: ArrayElementType\<T\>

```ts
type ArrayElementType<T> = T extends infer U[] ? U : never;
```

Defined in: [domain/types.ts:633](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L633)

Gets the element type of an array.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |
