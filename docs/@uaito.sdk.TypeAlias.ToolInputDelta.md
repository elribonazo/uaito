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

Defined in: [domain/types.ts:673](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L673)

Represents a delta in the input of a tool as it's being streamed.

## Properties

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:678](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L678)

The unique ID of the tool input.

***

### name?

```ts
optional name: string;
```

Defined in: [domain/types.ts:683](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L683)

The name of the tool.

***

### partial

```ts
partial: string;
```

Defined in: [domain/types.ts:688](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L688)

The partial input for the tool as a JSON string.

***

### type

```ts
type: "tool_delta";
```

Defined in: [domain/types.ts:693](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/sdk/src/domain/types.ts#L693)

The type of the block, indicating a tool delta.
