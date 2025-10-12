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

Defined in: [domain/types.ts:750](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L750)

The core message structure used throughout the SDK.

## Properties

### chunk?

```ts
optional chunk: boolean;
```

Defined in: [domain/types.ts:770](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L770)

Indicates if the message is a partial chunk from a stream.

***

### content

```ts
content: BlockType[];
```

Defined in: [domain/types.ts:765](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L765)

An array of content blocks that make up the message.

***

### id

```ts
id: string;
```

Defined in: [domain/types.ts:755](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L755)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:775](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L775)

The role of the message.

***

### type

```ts
type: MessageType;
```

Defined in: [domain/types.ts:760](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L760)

The type of the message.
