<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / DeltaBlock

# Type Alias: DeltaBlock

```ts
type DeltaBlock = {
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use" | null;
  stop_sequence: string | null;
  type: "delta";
};
```

Defined in: [domain/types.ts:223](https://github.com/elribonazo/uaito/blob/f7cb352fea9d23c9e96ddab16e6a9d7a49becc32/packages/sdk/src/domain/types.ts#L223)

Represents a delta block.

## Properties

### stop\_reason

```ts
stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use" | null;
```

Defined in: [domain/types.ts:233](https://github.com/elribonazo/uaito/blob/f7cb352fea9d23c9e96ddab16e6a9d7a49becc32/packages/sdk/src/domain/types.ts#L233)

The reason the stream stopped.

***

### stop\_sequence

```ts
stop_sequence: string | null;
```

Defined in: [domain/types.ts:239](https://github.com/elribonazo/uaito/blob/f7cb352fea9d23c9e96ddab16e6a9d7a49becc32/packages/sdk/src/domain/types.ts#L239)

The stop sequence.

***

### type

```ts
type: "delta";
```

Defined in: [domain/types.ts:228](https://github.com/elribonazo/uaito/blob/f7cb352fea9d23c9e96ddab16e6a9d7a49becc32/packages/sdk/src/domain/types.ts#L228)

The type of the block.
