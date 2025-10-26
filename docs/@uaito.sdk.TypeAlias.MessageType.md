<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / MessageType

# Type Alias: MessageType

```ts
type MessageType = 
  | "message"
  | ToolInputDelta["type"]
  | ToolUseBlock["type"]
  | ToolResultBlock["type"]
  | DeltaBlock["type"]
  | UsageBlock["type"]
  | ErrorBlock["type"]
  | ThinkingBlock["type"]
  | RedactedThinkingBlock["type"]
  | SignatureDeltaBlock["type"]
  | FileBlock["type"]
  | ProgressBlock["type"];
```

Defined in: [domain/types.ts:772](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L772)

A union of all possible message types.
