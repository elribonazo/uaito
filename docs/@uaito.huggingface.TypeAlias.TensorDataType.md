<div style="display:flex; align-items:center;">
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

Defined in: [types.ts:8](https://github.com/elribonazo/uaito/blob/d8262c821d12f33c37a2c9be05a267c0d95eb7a1/packages/huggingFace/src/types.ts#L8)

Type alias for tensor data types.

## Properties

### attention\_mask

```ts
attention_mask: Tensor;
```

Defined in: [types.ts:18](https://github.com/elribonazo/uaito/blob/d8262c821d12f33c37a2c9be05a267c0d95eb7a1/packages/huggingFace/src/types.ts#L18)

The attention mask tensor.

***

### input\_ids

```ts
input_ids: Tensor;
```

Defined in: [types.ts:13](https://github.com/elribonazo/uaito/blob/d8262c821d12f33c37a2c9be05a267c0d95eb7a1/packages/huggingFace/src/types.ts#L13)

The input IDs tensor.

***

### token\_type\_ids?

```ts
optional token_type_ids: Tensor;
```

Defined in: [types.ts:23](https://github.com/elribonazo/uaito/blob/d8262c821d12f33c37a2c9be05a267c0d95eb7a1/packages/huggingFace/src/types.ts#L23)

The token type IDs tensor.
