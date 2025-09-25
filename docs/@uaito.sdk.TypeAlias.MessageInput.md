<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
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

Defined in: [domain/types.ts:646](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L646)

Represents a message input.

## Properties

### content

```ts
content: MessageContent[];
```

Defined in: [domain/types.ts:666](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L666)

The content of the message.

***

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:651](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L651)

The unique ID of the message.

***

### role

```ts
role: Role;
```

Defined in: [domain/types.ts:661](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L661)

The role of the message.

***

### type?

```ts
optional type: MessageType;
```

Defined in: [domain/types.ts:656](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L656)

The type of the message.
