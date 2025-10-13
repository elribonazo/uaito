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

Defined in: [domain/types.ts:628](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/sdk/src/domain/types.ts#L628)

Represents a delta in the input of a tool as it's being streamed.

## Properties

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:633](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/sdk/src/domain/types.ts#L633)

The unique ID of the tool input.

***

### name?

```ts
optional name: string;
```

Defined in: [domain/types.ts:638](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/sdk/src/domain/types.ts#L638)

The name of the tool.

***

### partial

```ts
partial: string;
```

Defined in: [domain/types.ts:643](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/sdk/src/domain/types.ts#L643)

The partial input for the tool as a JSON string.

***

### type

```ts
type: "tool_delta";
```

Defined in: [domain/types.ts:648](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/sdk/src/domain/types.ts#L648)

The type of the block, indicating a tool delta.
