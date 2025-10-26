<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / Role

# Type Alias: Role

```ts
type Role = "assistant" | "user" | "system" | "tool";
```

Defined in: [domain/types.ts:106](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L106)

Represents the role of the message's author.
- `user`: The end-user.
- `assistant`: The AI model.
- `system`: A configuration or instruction message.
- `tool`: A message containing the output of a tool.
