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

Defined in: [domain/types.ts:706](https://github.com/elribonazo/uaito/blob/870f2f65de42d3455a95b7b9a6d0b1b49e6b01cd/packages/sdk/src/domain/types.ts#L706)

Represents the type of a message.
