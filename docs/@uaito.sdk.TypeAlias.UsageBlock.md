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

Defined in: [domain/types.ts:434](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/sdk/src/domain/types.ts#L434)

Represents a block containing token usage information for a request.

## Properties

### input?

```ts
optional input: number;
```

Defined in: [domain/types.ts:444](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/sdk/src/domain/types.ts#L444)

The number of input tokens.

***

### output?

```ts
optional output: number;
```

Defined in: [domain/types.ts:449](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/sdk/src/domain/types.ts#L449)

The number of output tokens.

***

### type

```ts
type: "usage";
```

Defined in: [domain/types.ts:439](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/sdk/src/domain/types.ts#L439)

The type of the block.
