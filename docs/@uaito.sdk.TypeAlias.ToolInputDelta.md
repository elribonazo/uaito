<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ToolInputDelta

# Type Alias: ToolInputDelta

```ts
type ToolInputDelta = {
  id?: string;
  name?: string;
  partial: string;
  type: "tool_delta";
};
```

Defined in: [domain/types.ts:607](https://github.com/elribonazo/uaito/blob/780947ea6c24067fd2792374e0d02fcaf4cab1a7/packages/sdk/src/domain/types.ts#L607)

Represents a tool input delta.

## Properties

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:612](https://github.com/elribonazo/uaito/blob/780947ea6c24067fd2792374e0d02fcaf4cab1a7/packages/sdk/src/domain/types.ts#L612)

The unique ID of the tool input.

***

### name?

```ts
optional name: string;
```

Defined in: [domain/types.ts:617](https://github.com/elribonazo/uaito/blob/780947ea6c24067fd2792374e0d02fcaf4cab1a7/packages/sdk/src/domain/types.ts#L617)

The name of the tool.

***

### partial

```ts
partial: string;
```

Defined in: [domain/types.ts:622](https://github.com/elribonazo/uaito/blob/780947ea6c24067fd2792374e0d02fcaf4cab1a7/packages/sdk/src/domain/types.ts#L622)

The partial input for the tool.

***

### type

```ts
type: "tool_delta";
```

Defined in: [domain/types.ts:627](https://github.com/elribonazo/uaito/blob/780947ea6c24067fd2792374e0d02fcaf4cab1a7/packages/sdk/src/domain/types.ts#L627)

The type of the block.
