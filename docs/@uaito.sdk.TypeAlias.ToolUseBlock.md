<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ToolUseBlock

# Type Alias: ToolUseBlock

```ts
type ToolUseBlock = {
  id: string;
  input: unknown;
  isRemote?: boolean;
  name: string;
  type: "tool_use";
};
```

Defined in: [domain/types.ts:644](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L644)

Represents a block indicating that the model wants to use a tool.

## Properties

### id

```ts
id: string;
```

Defined in: [domain/types.ts:649](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L649)

The unique ID of the tool use.

***

### input

```ts
input: unknown;
```

Defined in: [domain/types.ts:654](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L654)

The input for the tool.

***

### isRemote?

```ts
optional isRemote: boolean;
```

Defined in: [domain/types.ts:666](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L666)

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:659](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L659)

The name of the tool.

***

### type

```ts
type: "tool_use";
```

Defined in: [domain/types.ts:664](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L664)

The type of the block, indicating a tool use request.
