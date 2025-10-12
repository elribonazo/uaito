<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ErrorBlock

# Type Alias: ErrorBlock

```ts
type ErrorBlock = {
  message: string;
  type: "error";
};
```

Defined in: [domain/types.ts:456](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L456)

Represents a block containing an error message.

## Properties

### message

```ts
message: string;
```

Defined in: [domain/types.ts:466](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L466)

The error message.

***

### type

```ts
type: "error";
```

Defined in: [domain/types.ts:461](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L461)

The type of the block.
