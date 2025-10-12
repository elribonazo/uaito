<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/openai](@uaito.openai.md) / ImageGenConfig

# Type Alias: ImageGenConfig

```ts
type ImageGenConfig = {
  input_fidelity: "high" | "low";
  model: OpenAIImageModels;
  output_format: "png" | "jpeg";
  quality: "high" | "low";
  size: "auto" | "1024x1024" | "1024x1536" | "1536x1024";
};
```

Defined in: [types.ts:34](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L34)

## Properties

### input\_fidelity

```ts
input_fidelity: "high" | "low";
```

Defined in: [types.ts:39](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L39)

***

### model

```ts
model: OpenAIImageModels;
```

Defined in: [types.ts:35](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L35)

***

### output\_format

```ts
output_format: "png" | "jpeg";
```

Defined in: [types.ts:37](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L37)

***

### quality

```ts
quality: "high" | "low";
```

Defined in: [types.ts:36](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L36)

***

### size

```ts
size: "auto" | "1024x1024" | "1024x1536" | "1536x1024";
```

Defined in: [types.ts:38](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/openai/src/types.ts#L38)
