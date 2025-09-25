<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / UsageBlock

# Type Alias: UsageBlock

```ts
type UsageBlock = {
  input?: number;
  output?: number;
  type: "usage";
};
```

Defined in: [domain/types.ts:420](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L420)

Represents a usage block.

## Properties

### input?

```ts
optional input: number;
```

Defined in: [domain/types.ts:430](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L430)

The number of input tokens.

***

### output?

```ts
optional output: number;
```

Defined in: [domain/types.ts:435](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L435)

The number of output tokens.

***

### type

```ts
type: "usage";
```

Defined in: [domain/types.ts:425](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L425)

The type of the block.
