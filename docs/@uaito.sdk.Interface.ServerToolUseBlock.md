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

Defined in: [domain/types.ts:193](https://github.com/elribonazo/uaito/blob/3b85b1ba4c186b820d14bf055553422e84019aef/packages/sdk/src/domain/types.ts#L193)

Represents a server tool use block.
 ServerToolUseBlock

## Properties

### id

```ts
id: string;
```

Defined in: [domain/types.ts:198](https://github.com/elribonazo/uaito/blob/3b85b1ba4c186b820d14bf055553422e84019aef/packages/sdk/src/domain/types.ts#L198)

The unique ID of the tool use.

***

### input

```ts
input: unknown;
```

Defined in: [domain/types.ts:204](https://github.com/elribonazo/uaito/blob/3b85b1ba4c186b820d14bf055553422e84019aef/packages/sdk/src/domain/types.ts#L204)

The input for the tool.

***

### name

```ts
name: "web_search";
```

Defined in: [domain/types.ts:210](https://github.com/elribonazo/uaito/blob/3b85b1ba4c186b820d14bf055553422e84019aef/packages/sdk/src/domain/types.ts#L210)

The name of the tool.

***

### type

```ts
type: "server_tool_use";
```

Defined in: [domain/types.ts:216](https://github.com/elribonazo/uaito/blob/3b85b1ba4c186b820d14bf055553422e84019aef/packages/sdk/src/domain/types.ts#L216)

The type of the block.
