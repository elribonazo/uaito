<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ServerToolUseBlock

# Interface: ServerToolUseBlock

Defined in: [domain/types.ts:193](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L193)

Represents a server tool use block.
 ServerToolUseBlock

## Properties

### id

```ts
id: string;
```

Defined in: [domain/types.ts:198](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L198)

The unique ID of the tool use.

***

### input

```ts
input: unknown;
```

Defined in: [domain/types.ts:204](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L204)

The input for the tool.

***

### name

```ts
name: "web_search";
```

Defined in: [domain/types.ts:210](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L210)

The name of the tool.

***

### type

```ts
type: "server_tool_use";
```

Defined in: [domain/types.ts:216](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L216)

The type of the block.
