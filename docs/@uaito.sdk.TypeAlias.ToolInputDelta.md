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

Defined in: [domain/types.ts:607](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L607)

Represents a tool input delta.

## Properties

### id?

```ts
optional id: string;
```

Defined in: [domain/types.ts:612](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L612)

The unique ID of the tool input.

***

### name?

```ts
optional name: string;
```

Defined in: [domain/types.ts:617](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L617)

The name of the tool.

***

### partial

```ts
partial: string;
```

Defined in: [domain/types.ts:622](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L622)

The partial input for the tool.

***

### type

```ts
type: "tool_delta";
```

Defined in: [domain/types.ts:627](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L627)

The type of the block.
