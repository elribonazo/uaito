[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / OnTool

# Type Alias: OnTool()

```ts
type OnTool = (this, message, signal?) => Promise<void>;
```

Defined in: [domain/types.ts:409](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L409)

Represents a callback for tool usage.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | [`BaseAgent`](@uaito.sdk.Class.BaseAgent.md) |
| `message` | [`Message`](@uaito.sdk.TypeAlias.Message.md) |
| `signal?` | `AbortSignal` |

## Returns

`Promise`\<`void`\>
