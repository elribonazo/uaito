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

Defined in: [domain/types.ts:722](https://github.com/elribonazo/uaito/blob/4dd0eb0a789ce253f2bab714de6ccbcb99265776/packages/sdk/src/domain/types.ts#L722)

Represents the type of a block.
