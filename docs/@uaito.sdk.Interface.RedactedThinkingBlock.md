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

Defined in: [domain/types.ts:495](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L495)

Represents a thinking or reasoning block from the model that has been redacted.
 RedactedThinkingBlock

## Properties

### data

```ts
data: string;
```

Defined in: [domain/types.ts:500](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L500)

The redacted data.

***

### type

```ts
type: "redacted_thinking";
```

Defined in: [domain/types.ts:506](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L506)

The type of the block, indicating redacted thinking.
