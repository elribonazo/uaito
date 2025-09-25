<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ToolUseBlock

# Type Alias: ToolUseBlock

```ts
type ToolUseBlock = {
  id: string;
  input: unknown;
  name: string;
  type: "tool_use";
};
```

Defined in: [domain/types.ts:580](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L580)

Represents a tool use block.

## Properties

### id

```ts
id: string;
```

Defined in: [domain/types.ts:585](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L585)

The unique ID of the tool use.

***

### input

```ts
input: unknown;
```

Defined in: [domain/types.ts:590](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L590)

The input for the tool.

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:595](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L595)

The name of the tool.

***

### type

```ts
type: "tool_use";
```

Defined in: [domain/types.ts:600](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L600)

The type of the block.
