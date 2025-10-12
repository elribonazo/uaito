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

Defined in: [domain/types.ts:599](https://github.com/elribonazo/uaito/blob/11a62aa88ccfadb7acae2cd0c0e9264cbc6ec939/packages/sdk/src/domain/types.ts#L599)

Represents a block indicating that the model wants to use a tool.

## Properties

### id

```ts
id: string;
```

Defined in: [domain/types.ts:604](https://github.com/elribonazo/uaito/blob/11a62aa88ccfadb7acae2cd0c0e9264cbc6ec939/packages/sdk/src/domain/types.ts#L604)

The unique ID of the tool use.

***

### input

```ts
input: unknown;
```

Defined in: [domain/types.ts:609](https://github.com/elribonazo/uaito/blob/11a62aa88ccfadb7acae2cd0c0e9264cbc6ec939/packages/sdk/src/domain/types.ts#L609)

The input for the tool.

***

### isRemote?

```ts
optional isRemote: boolean;
```

Defined in: [domain/types.ts:621](https://github.com/elribonazo/uaito/blob/11a62aa88ccfadb7acae2cd0c0e9264cbc6ec939/packages/sdk/src/domain/types.ts#L621)

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:614](https://github.com/elribonazo/uaito/blob/11a62aa88ccfadb7acae2cd0c0e9264cbc6ec939/packages/sdk/src/domain/types.ts#L614)

The name of the tool.

***

### type

```ts
type: "tool_use";
```

Defined in: [domain/types.ts:619](https://github.com/elribonazo/uaito/blob/11a62aa88ccfadb7acae2cd0c0e9264cbc6ec939/packages/sdk/src/domain/types.ts#L619)

The type of the block, indicating a tool use request.
