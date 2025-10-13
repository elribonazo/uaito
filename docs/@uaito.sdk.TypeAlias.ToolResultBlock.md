<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ToolResultBlock

# Type Alias: ToolResultBlock

```ts
type ToolResultBlock = {
  content?: MessageContent[];
  isError?: boolean;
  name: string;
  tool_use_id: string;
  type: "tool_result";
};
```

Defined in: [domain/types.ts:695](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/domain/types.ts#L695)

Represents the result of a tool's execution.

## Properties

### content?

```ts
optional content: MessageContent[];
```

Defined in: [domain/types.ts:715](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/domain/types.ts#L715)

The content of the block.

***

### isError?

```ts
optional isError: boolean;
```

Defined in: [domain/types.ts:720](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/domain/types.ts#L720)

Indicates whether the tool execution resulted in an error.

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:705](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/domain/types.ts#L705)

The name of the tool.

***

### tool\_use\_id

```ts
tool_use_id: string;
```

Defined in: [domain/types.ts:700](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/domain/types.ts#L700)

The ID of the tool use.

***

### type

```ts
type: "tool_result";
```

Defined in: [domain/types.ts:710](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/domain/types.ts#L710)

The type of the block, indicating a tool result.
