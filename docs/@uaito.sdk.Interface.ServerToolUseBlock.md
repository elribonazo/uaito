<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ServerToolUseBlock

# Interface: ServerToolUseBlock

Defined in: [domain/types.ts:202](https://github.com/elribonazo/uaito/blob/21a549544853753e42a17dde391efee677cbe2b5/packages/sdk/src/domain/types.ts#L202)

Represents a block for a tool that is executed on the server-side.
 ServerToolUseBlock

## Properties

### id

```ts
id: string;
```

Defined in: [domain/types.ts:207](https://github.com/elribonazo/uaito/blob/21a549544853753e42a17dde391efee677cbe2b5/packages/sdk/src/domain/types.ts#L207)

The unique ID of the tool use.

***

### input

```ts
input: unknown;
```

Defined in: [domain/types.ts:213](https://github.com/elribonazo/uaito/blob/21a549544853753e42a17dde391efee677cbe2b5/packages/sdk/src/domain/types.ts#L213)

The input for the tool.

***

### name

```ts
name: "web_search";
```

Defined in: [domain/types.ts:219](https://github.com/elribonazo/uaito/blob/21a549544853753e42a17dde391efee677cbe2b5/packages/sdk/src/domain/types.ts#L219)

The name of the tool.

***

### type

```ts
type: "server_tool_use";
```

Defined in: [domain/types.ts:225](https://github.com/elribonazo/uaito/blob/21a549544853753e42a17dde391efee677cbe2b5/packages/sdk/src/domain/types.ts#L225)

The type of the block, indicating a server-side tool use.
