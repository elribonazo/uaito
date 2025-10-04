<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / OnTool

# Type Alias: OnTool()

```ts
type OnTool = (this, message, signal?) => Promise<void>;
```

Defined in: [domain/types.ts:409](https://github.com/elribonazo/uaito/blob/870f2f65de42d3455a95b7b9a6d0b1b49e6b01cd/packages/sdk/src/domain/types.ts#L409)

Represents a callback for tool usage.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | [`BaseAgent`](@uaito.sdk.Class.BaseAgent.md) |
| `message` | [`Message`](@uaito.sdk.TypeAlias.Message.md) |
| `signal?` | `AbortSignal` |

## Returns

`Promise`\<`void`\>
