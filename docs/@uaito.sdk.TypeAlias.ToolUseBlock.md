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
  name: string;
  type: "tool_use";
};
```

Defined in: [domain/types.ts:580](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/sdk/src/domain/types.ts#L580)

Represents a tool use block.

## Properties

### id

```ts
id: string;
```

Defined in: [domain/types.ts:585](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/sdk/src/domain/types.ts#L585)

The unique ID of the tool use.

***

### input

```ts
input: unknown;
```

Defined in: [domain/types.ts:590](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/sdk/src/domain/types.ts#L590)

The input for the tool.

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:595](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/sdk/src/domain/types.ts#L595)

The name of the tool.

***

### type

```ts
type: "tool_use";
```

Defined in: [domain/types.ts:600](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/sdk/src/domain/types.ts#L600)

The type of the block.
