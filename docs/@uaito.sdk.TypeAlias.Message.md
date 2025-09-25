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

Defined in: [domain/types.ts:729](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L729)

Represents a message.

## Properties

### chunk?

```ts
optional chunk: boolean;
```

Defined in: [domain/types.ts:749](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L749)

Whether the message is a chunk.

***

### content

```ts
content: BlockType[];
```

Defined in: [domain/types.ts:744](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L744)

The content of the message.

***

### id

```ts
id: string;
```

Defined in: [domain/types.ts:734](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L734)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:754](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L754)

The role of the message.

***

### type

```ts
type: MessageType;
```

Defined in: [domain/types.ts:739](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L739)

The type of the message.
