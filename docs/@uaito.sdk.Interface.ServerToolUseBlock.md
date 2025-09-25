[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ServerToolUseBlock

# Interface: ServerToolUseBlock

Defined in: [domain/types.ts:193](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L193)

Represents a server tool use block.
 ServerToolUseBlock

## Properties

### id

```ts
id: string;
```

Defined in: [domain/types.ts:198](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L198)

The unique ID of the tool use.

***

### input

```ts
input: unknown;
```

Defined in: [domain/types.ts:204](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L204)

The input for the tool.

***

### name

```ts
name: "web_search";
```

Defined in: [domain/types.ts:210](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L210)

The name of the tool.

***

### type

```ts
type: "server_tool_use";
```

Defined in: [domain/types.ts:216](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L216)

The type of the block.
