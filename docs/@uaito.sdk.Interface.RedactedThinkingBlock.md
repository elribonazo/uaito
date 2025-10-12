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

Defined in: [domain/types.ts:472](https://github.com/elribonazo/uaito/blob/196a16fe5e5b60bfd7ea97e89a09a17b4f97d7ed/packages/sdk/src/domain/types.ts#L472)

Represents a thinking or reasoning block from the model that has been redacted.
 RedactedThinkingBlock

## Properties

### data

```ts
data: string;
```

Defined in: [domain/types.ts:477](https://github.com/elribonazo/uaito/blob/196a16fe5e5b60bfd7ea97e89a09a17b4f97d7ed/packages/sdk/src/domain/types.ts#L477)

The redacted data.

***

### type

```ts
type: "redacted_thinking";
```

Defined in: [domain/types.ts:483](https://github.com/elribonazo/uaito/blob/196a16fe5e5b60bfd7ea97e89a09a17b4f97d7ed/packages/sdk/src/domain/types.ts#L483)

The type of the block, indicating redacted thinking.
