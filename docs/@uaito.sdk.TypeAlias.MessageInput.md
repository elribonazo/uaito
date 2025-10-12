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

Defined in: [domain/types.ts:653](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L653)

Represents a message input.

## Properties

### content

```ts
content: MessageContent[];
```

Defined in: [domain/types.ts:673](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L673)

The content of the message.

***

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:658](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L658)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:668](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L668)

The role of the message.

***

### type?

```ts
optional type: MessageType;
```

Defined in: [domain/types.ts:663](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L663)

The type of the message.
