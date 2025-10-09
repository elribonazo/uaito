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

Defined in: [domain/types.ts:681](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L681)

Represents a tool result block.

## Properties

### content?

```ts
optional content: MessageContent[];
```

Defined in: [domain/types.ts:701](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L701)

The content of the block.

***

### isError?

```ts
optional isError: boolean;
```

Defined in: [domain/types.ts:706](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L706)

Whether the tool result is an error.

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:691](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L691)

The name of the tool.

***

### tool\_use\_id

```ts
tool_use_id: string;
```

Defined in: [domain/types.ts:686](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L686)

The ID of the tool use.

***

### type

```ts
type: "tool_result";
```

Defined in: [domain/types.ts:696](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L696)

The type of the block.
