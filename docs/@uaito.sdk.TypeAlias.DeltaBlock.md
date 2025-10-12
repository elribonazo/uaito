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

Defined in: [domain/types.ts:232](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/sdk/src/domain/types.ts#L232)

Represents a delta block in a streamed response, indicating changes or stop reasons.

## Properties

### stop\_reason

```ts
stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use" | null;
```

Defined in: [domain/types.ts:242](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/sdk/src/domain/types.ts#L242)

The reason the stream stopped.

***

### stop\_sequence

```ts
stop_sequence: string | null;
```

Defined in: [domain/types.ts:248](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/sdk/src/domain/types.ts#L248)

The stop sequence.

***

### type

```ts
type: "delta";
```

Defined in: [domain/types.ts:237](https://github.com/elribonazo/uaito/blob/99a686d3e1c6bf4b79ff32413a32495226a544bc/packages/sdk/src/domain/types.ts#L237)

The type of the block.
