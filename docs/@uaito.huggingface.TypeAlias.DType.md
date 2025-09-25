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

Defined in: [types.ts:69](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/huggingFace/src/types.ts#L69)

Type alias for the data types supported by the model.
