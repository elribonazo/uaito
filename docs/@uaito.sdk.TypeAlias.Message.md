<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / Message

# Type Alias: Message

```ts
type Message = {
  chunk?: boolean;
  content: BlockType[];
  id: string;
  role: Role;
  type: MessageType;
};
```

Defined in: [domain/types.ts:797](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L797)

The core message structure used throughout the SDK.

## Properties

### chunk?

```ts
optional chunk: boolean;
```

Defined in: [domain/types.ts:817](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L817)

Indicates if the message is a partial chunk from a stream.

***

### content

```ts
content: BlockType[];
```

Defined in: [domain/types.ts:812](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L812)

An array of content blocks that make up the message.

***

### id

```ts
id: string;
```

Defined in: [domain/types.ts:802](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L802)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:822](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L822)

The role of the message.

***

### type

```ts
type: MessageType;
```

Defined in: [domain/types.ts:807](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L807)

The type of the message.
