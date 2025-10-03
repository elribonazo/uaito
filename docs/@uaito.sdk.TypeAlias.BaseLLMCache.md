<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
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

Defined in: [domain/types.ts:18](https://github.com/elribonazo/uaito/blob/b53056b16a9c7699ff09c12f8dbdb7b63f986f14/packages/sdk/src/domain/types.ts#L18)

Represents the cache for a base LLM.

## Properties

### chunks

```ts
chunks: string | null;
```

Defined in: [domain/types.ts:28](https://github.com/elribonazo/uaito/blob/b53056b16a9c7699ff09c12f8dbdb7b63f986f14/packages/sdk/src/domain/types.ts#L28)

The chunks of the response.

***

### tokens

```ts
tokens: {
  input: number;
  output: number;
};
```

Defined in: [domain/types.ts:33](https://github.com/elribonazo/uaito/blob/b53056b16a9c7699ff09c12f8dbdb7b63f986f14/packages/sdk/src/domain/types.ts#L33)

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

Defined in: [domain/types.ts:23](https://github.com/elribonazo/uaito/blob/b53056b16a9c7699ff09c12f8dbdb7b63f986f14/packages/sdk/src/domain/types.ts#L23)

The input for a tool.
