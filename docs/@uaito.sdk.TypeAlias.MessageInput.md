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

Defined in: [domain/types.ts:646](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L646)

Represents a message input.

## Properties

### content

```ts
content: MessageContent[];
```

Defined in: [domain/types.ts:666](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L666)

The content of the message.

***

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:651](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L651)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:661](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L661)

The role of the message.

***

### type?

```ts
optional type: MessageType;
```

Defined in: [domain/types.ts:656](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L656)

The type of the message.
