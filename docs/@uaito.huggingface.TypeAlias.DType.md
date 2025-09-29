<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / DType

# Type Alias: DType

```ts
type DType = 
  | "auto"
  | "fp32"
  | "fp16"
  | "q8"
  | "int8"
  | "uint8"
  | "q4"
  | "bnb4"
  | "q4f16"
  | Record<string, "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16">
  | undefined;
```

Defined in: [types.ts:69](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/types.ts#L69)

Type alias for the data types supported by the model.
