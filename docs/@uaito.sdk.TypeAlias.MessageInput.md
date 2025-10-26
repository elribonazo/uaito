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

Defined in: [domain/types.ts:712](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L712)

Represents the structure of a message when it is being passed as input to an LLM.

## Properties

### content

```ts
content: MessageContent[];
```

Defined in: [domain/types.ts:732](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L732)

The content of the message.

***

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:717](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L717)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:727](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L727)

The role of the message.

***

### type?

```ts
optional type: MessageType;
```

Defined in: [domain/types.ts:722](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L722)

The type of the message.
