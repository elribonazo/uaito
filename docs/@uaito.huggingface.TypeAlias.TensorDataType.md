<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / TensorDataType

# Type Alias: TensorDataType

```ts
type TensorDataType = {
  attention_mask: Tensor;
  input_ids: Tensor;
  token_type_ids?: Tensor;
};
```

Defined in: [types.ts:9](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/huggingFace/src/types.ts#L9)

Defines the structure of tensor data required by Hugging Face models,
including input IDs, attention mask, and optional token type IDs.

## Properties

### attention\_mask

```ts
attention_mask: Tensor;
```

Defined in: [types.ts:19](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/huggingFace/src/types.ts#L19)

The attention mask tensor.

***

### input\_ids

```ts
input_ids: Tensor;
```

Defined in: [types.ts:14](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/huggingFace/src/types.ts#L14)

The input IDs tensor.

***

### token\_type\_ids?

```ts
optional token_type_ids: Tensor;
```

Defined in: [types.ts:24](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/huggingFace/src/types.ts#L24)

Optional tensor for token type IDs, used in models that distinguish between different sentences.
