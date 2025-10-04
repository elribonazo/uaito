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
  | SignatureDeltaBlock["type"];
```

Defined in: [domain/types.ts:706](https://github.com/elribonazo/uaito/blob/f7cb352fea9d23c9e96ddab16e6a9d7a49becc32/packages/sdk/src/domain/types.ts#L706)

Represents the type of a message.
