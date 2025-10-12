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

Defined in: [types.ts:197](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/huggingFace/src/types.ts#L197)

A union of possible data types for model quantization and execution.
`auto` allows the library to choose the best type based on the model and hardware.
Other values specify the precision, like `fp32` (32-bit float) or `q4` (4-bit quantized).
