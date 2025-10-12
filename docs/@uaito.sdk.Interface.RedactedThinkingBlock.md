<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / RedactedThinkingBlock

# Interface: RedactedThinkingBlock

Defined in: [domain/types.ts:472](https://github.com/elribonazo/uaito/blob/48ca7e9100abb23d088dbfc6eb0d1c39d55fdcbf/packages/sdk/src/domain/types.ts#L472)

Represents a thinking or reasoning block from the model that has been redacted.
 RedactedThinkingBlock

## Properties

### data

```ts
data: string;
```

Defined in: [domain/types.ts:477](https://github.com/elribonazo/uaito/blob/48ca7e9100abb23d088dbfc6eb0d1c39d55fdcbf/packages/sdk/src/domain/types.ts#L477)

The redacted data.

***

### type

```ts
type: "redacted_thinking";
```

Defined in: [domain/types.ts:483](https://github.com/elribonazo/uaito/blob/48ca7e9100abb23d088dbfc6eb0d1c39d55fdcbf/packages/sdk/src/domain/types.ts#L483)

The type of the block, indicating redacted thinking.
