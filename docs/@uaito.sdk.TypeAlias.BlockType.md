<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / BlockType

# Type Alias: BlockType

```ts
type BlockType = 
  | ErrorBlock
  | TextBlock
  | ToolBlock
  | ImageBlock
  | DeltaBlock
  | UsageBlock
  | AudioBlock
  | ThinkingBlock
  | RedactedThinkingBlock
  | ServerToolUseBlock
  | WebSearchToolResultBlock
  | SignatureDeltaBlock;
```

Defined in: [domain/types.ts:743](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L743)

A union of all possible block types that can be part of a message's content.
