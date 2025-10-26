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

Defined in: [domain/types.ts:740](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L740)

Represents the result of a tool's execution.

## Properties

### content?

```ts
optional content: MessageContent[];
```

Defined in: [domain/types.ts:760](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L760)

The content of the block.

***

### isError?

```ts
optional isError: boolean;
```

Defined in: [domain/types.ts:765](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L765)

Indicates whether the tool execution resulted in an error.

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:750](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L750)

The name of the tool.

***

### tool\_use\_id

```ts
tool_use_id: string;
```

Defined in: [domain/types.ts:745](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L745)

The ID of the tool use.

***

### type

```ts
type: "tool_result";
```

Defined in: [domain/types.ts:755](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L755)

The type of the block, indicating a tool result.
