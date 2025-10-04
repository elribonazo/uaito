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

Defined in: [domain/types.ts:674](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L674)

Represents a tool result block.

## Properties

### content?

```ts
optional content: MessageContent[];
```

Defined in: [domain/types.ts:694](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L694)

The content of the block.

***

### isError?

```ts
optional isError: boolean;
```

Defined in: [domain/types.ts:699](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L699)

Whether the tool result is an error.

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:684](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L684)

The name of the tool.

***

### tool\_use\_id

```ts
tool_use_id: string;
```

Defined in: [domain/types.ts:679](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L679)

The ID of the tool use.

***

### type

```ts
type: "tool_result";
```

Defined in: [domain/types.ts:689](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L689)

The type of the block.
