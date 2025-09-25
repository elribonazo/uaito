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

Defined in: [domain/types.ts:722](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L722)

Represents the type of a block.
