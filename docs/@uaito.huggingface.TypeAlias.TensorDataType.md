<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
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

Defined in: [types.ts:8](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/huggingFace/src/types.ts#L8)

Type alias for tensor data types.

## Properties

### attention\_mask

```ts
attention_mask: Tensor;
```

Defined in: [types.ts:18](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/huggingFace/src/types.ts#L18)

The attention mask tensor.

***

### input\_ids

```ts
input_ids: Tensor;
```

Defined in: [types.ts:13](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/huggingFace/src/types.ts#L13)

The input IDs tensor.

***

### token\_type\_ids?

```ts
optional token_type_ids: Tensor;
```

Defined in: [types.ts:23](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/huggingFace/src/types.ts#L23)

The token type IDs tensor.
