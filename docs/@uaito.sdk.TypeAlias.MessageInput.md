<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / MessageInput

# Type Alias: MessageInput

```ts
type MessageInput = {
  content: MessageContent[];
  id?: string;
  role: Role;
  type?: MessageType;
};
```

Defined in: [domain/types.ts:667](https://github.com/elribonazo/uaito/blob/a6f1c59724f590c9aee06115593ac990cf447b39/packages/sdk/src/domain/types.ts#L667)

Represents the structure of a message when it is being passed as input to an LLM.

## Properties

### content

```ts
content: MessageContent[];
```

Defined in: [domain/types.ts:687](https://github.com/elribonazo/uaito/blob/a6f1c59724f590c9aee06115593ac990cf447b39/packages/sdk/src/domain/types.ts#L687)

The content of the message.

***

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:672](https://github.com/elribonazo/uaito/blob/a6f1c59724f590c9aee06115593ac990cf447b39/packages/sdk/src/domain/types.ts#L672)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:682](https://github.com/elribonazo/uaito/blob/a6f1c59724f590c9aee06115593ac990cf447b39/packages/sdk/src/domain/types.ts#L682)

The role of the message.

***

### type?

```ts
optional type: MessageType;
```

Defined in: [domain/types.ts:677](https://github.com/elribonazo/uaito/blob/a6f1c59724f590c9aee06115593ac990cf447b39/packages/sdk/src/domain/types.ts#L677)

The type of the message.
