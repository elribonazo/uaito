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

Defined in: [domain/types.ts:409](https://github.com/elribonazo/uaito/blob/4dd0eb0a789ce253f2bab714de6ccbcb99265776/packages/sdk/src/domain/types.ts#L409)

Represents a callback for tool usage.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | [`BaseAgent`](@uaito.sdk.Class.BaseAgent.md) |
| `message` | [`Message`](@uaito.sdk.TypeAlias.Message.md) |
| `signal?` | `AbortSignal` |

## Returns

`Promise`\<`void`\>
