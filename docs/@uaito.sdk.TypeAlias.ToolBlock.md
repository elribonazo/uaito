<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ToolBlock

# Type Alias: ToolBlock

```ts
type ToolBlock = 
  | ToolInputDelta
  | ToolUseBlock
  | ToolResultBlock;
```

Defined in: [domain/types.ts:97](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L97)

A union type representing all possible tool-related blocks in a message.
This includes tool inputs, tool usage requests, and tool results.
