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

Defined in: [domain/types.ts:736](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L736)

Represents a message.

## Properties

### chunk?

```ts
optional chunk: boolean;
```

Defined in: [domain/types.ts:756](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L756)

Whether the message is a chunk.

***

### content

```ts
content: BlockType[];
```

Defined in: [domain/types.ts:751](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L751)

The content of the message.

***

### id

```ts
id: string;
```

Defined in: [domain/types.ts:741](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L741)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:761](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L761)

The role of the message.

***

### type

```ts
type: MessageType;
```

Defined in: [domain/types.ts:746](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/types.ts#L746)

The type of the message.
