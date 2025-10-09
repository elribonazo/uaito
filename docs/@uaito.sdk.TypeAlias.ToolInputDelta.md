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

Defined in: [domain/types.ts:614](https://github.com/elribonazo/uaito/blob/14cc5d8874ee2252c5294c529f579706013fa351/packages/sdk/src/domain/types.ts#L614)

Represents a tool input delta.

## Properties

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:619](https://github.com/elribonazo/uaito/blob/14cc5d8874ee2252c5294c529f579706013fa351/packages/sdk/src/domain/types.ts#L619)

The unique ID of the tool input.

***

### name?

```ts
optional name: string;
```

Defined in: [domain/types.ts:624](https://github.com/elribonazo/uaito/blob/14cc5d8874ee2252c5294c529f579706013fa351/packages/sdk/src/domain/types.ts#L624)

The name of the tool.

***

### partial

```ts
partial: string;
```

Defined in: [domain/types.ts:629](https://github.com/elribonazo/uaito/blob/14cc5d8874ee2252c5294c529f579706013fa351/packages/sdk/src/domain/types.ts#L629)

The partial input for the tool.

***

### type

```ts
type: "tool_delta";
```

Defined in: [domain/types.ts:634](https://github.com/elribonazo/uaito/blob/14cc5d8874ee2252c5294c529f579706013fa351/packages/sdk/src/domain/types.ts#L634)

The type of the block.
