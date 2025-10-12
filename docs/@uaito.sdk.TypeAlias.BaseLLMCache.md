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

Defined in: [domain/types.ts:19](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L19)

Defines the structure for a cache used by a `BaseLLM` instance.
This can be used to store intermediate data like partial tool inputs or response chunks.

## Properties

### chunks

```ts
chunks: string | null;
```

Defined in: [domain/types.ts:29](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L29)

A buffer for accumulating response chunks from the stream.

***

### tokens

```ts
tokens: {
  input: number;
  output: number;
};
```

Defined in: [domain/types.ts:34](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L34)

Tracks the number of input and output tokens for a request.

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

Defined in: [domain/types.ts:24](https://github.com/elribonazo/uaito/blob/e0747004e756945db95e651c1acbbc56d72b8bba/packages/sdk/src/domain/types.ts#L24)

Stores partial input for a tool as it's being streamed.
