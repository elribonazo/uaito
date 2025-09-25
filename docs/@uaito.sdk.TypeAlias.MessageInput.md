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

Defined in: [domain/types.ts:646](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L646)

Represents a message input.

## Properties

### content

```ts
content: MessageContent[];
```

Defined in: [domain/types.ts:666](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L666)

The content of the message.

***

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:651](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L651)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:661](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L661)

The role of the message.

***

### type?

```ts
optional type: MessageType;
```

Defined in: [domain/types.ts:656](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L656)

The type of the message.
