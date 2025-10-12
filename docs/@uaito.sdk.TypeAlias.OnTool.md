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

Defined in: [domain/types.ts:423](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/types.ts#L423)

A callback function that is invoked when an LLM uses a tool.
The `this` context within the callback is bound to the `BaseAgent` instance.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | [`BaseAgent`](@uaito.sdk.Class.BaseAgent.md) | - |
| `message` | [`Message`](@uaito.sdk.TypeAlias.Message.md) | The message containing the tool use block. |
| `signal?` | `AbortSignal` | An optional abort signal to cancel the tool execution. |

## Returns

`Promise`\<`void`\>
