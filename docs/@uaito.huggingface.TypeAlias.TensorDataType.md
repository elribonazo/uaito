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

Defined in: [types.ts:8](https://github.com/elribonazo/uaito/blob/02b540c7fb117ee73578d4c4974ca392894aea8b/packages/huggingFace/src/types.ts#L8)

Type alias for tensor data types.

## Properties

### attention\_mask

```ts
attention_mask: Tensor;
```

Defined in: [types.ts:18](https://github.com/elribonazo/uaito/blob/02b540c7fb117ee73578d4c4974ca392894aea8b/packages/huggingFace/src/types.ts#L18)

The attention mask tensor.

***

### input\_ids

```ts
input_ids: Tensor;
```

Defined in: [types.ts:13](https://github.com/elribonazo/uaito/blob/02b540c7fb117ee73578d4c4974ca392894aea8b/packages/huggingFace/src/types.ts#L13)

The input IDs tensor.

***

### token\_type\_ids?

```ts
optional token_type_ids: Tensor;
```

Defined in: [types.ts:23](https://github.com/elribonazo/uaito/blob/02b540c7fb117ee73578d4c4974ca392894aea8b/packages/huggingFace/src/types.ts#L23)

The token type IDs tensor.
