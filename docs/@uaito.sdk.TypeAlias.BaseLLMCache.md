<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / BaseLLMCache

# Type Alias: BaseLLMCache

```ts
type BaseLLMCache = {
  chunks: string | null;
  tokens: {
     input: number;
     output: number;
  };
  toolInput: BlockType | null;
};
```

Defined in: [domain/types.ts:18](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L18)

Represents the cache for a base LLM.

## Properties

### chunks

```ts
chunks: string | null;
```

Defined in: [domain/types.ts:28](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L28)

The chunks of the response.

***

### tokens

```ts
tokens: {
  input: number;
  output: number;
};
```

Defined in: [domain/types.ts:33](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L33)

The number of input and output tokens.

#### input

```ts
input: number;
```

#### output

```ts
output: number;
```

***

### toolInput

```ts
toolInput: BlockType | null;
```

Defined in: [domain/types.ts:23](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L23)

The input for a tool.
