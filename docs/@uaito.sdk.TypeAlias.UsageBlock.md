<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
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

Defined in: [domain/types.ts:420](https://github.com/elribonazo/uaito/blob/86493a842e0d07c9f10872ff549129f89a4683d7/packages/sdk/src/domain/types.ts#L420)

Represents a usage block.

## Properties

### input?

```ts
optional input: number;
```

Defined in: [domain/types.ts:430](https://github.com/elribonazo/uaito/blob/86493a842e0d07c9f10872ff549129f89a4683d7/packages/sdk/src/domain/types.ts#L430)

The number of input tokens.

***

### output?

```ts
optional output: number;
```

Defined in: [domain/types.ts:435](https://github.com/elribonazo/uaito/blob/86493a842e0d07c9f10872ff549129f89a4683d7/packages/sdk/src/domain/types.ts#L435)

The number of output tokens.

***

### type

```ts
type: "usage";
```

Defined in: [domain/types.ts:425](https://github.com/elribonazo/uaito/blob/86493a842e0d07c9f10872ff549129f89a4683d7/packages/sdk/src/domain/types.ts#L425)

The type of the block.
