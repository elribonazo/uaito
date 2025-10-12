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

Defined in: [types.ts:62](https://github.com/elribonazo/uaito/blob/f71ee49b41f4b02cf38cae1844e3a14accc1d794/packages/openai/src/types.ts#L62)

Defines the configuration for image generation when using the OpenAI provider.

## Properties

### input\_fidelity

```ts
input_fidelity: "high" | "low";
```

Defined in: [types.ts:87](https://github.com/elribonazo/uaito/blob/f71ee49b41f4b02cf38cae1844e3a14accc1d794/packages/openai/src/types.ts#L87)

The fidelity of the input image, if one is provided for editing.

***

### model

```ts
model: OpenAIImageModels;
```

Defined in: [types.ts:67](https://github.com/elribonazo/uaito/blob/f71ee49b41f4b02cf38cae1844e3a14accc1d794/packages/openai/src/types.ts#L67)

The specific image generation model to use.

***

### output\_format

```ts
output_format: "png" | "jpeg";
```

Defined in: [types.ts:77](https://github.com/elribonazo/uaito/blob/f71ee49b41f4b02cf38cae1844e3a14accc1d794/packages/openai/src/types.ts#L77)

The output format for the generated image.

***

### quality

```ts
quality: "high" | "low";
```

Defined in: [types.ts:72](https://github.com/elribonazo/uaito/blob/f71ee49b41f4b02cf38cae1844e3a14accc1d794/packages/openai/src/types.ts#L72)

The desired quality of the generated image. 'high' provides better detail at a higher cost.

***

### size

```ts
size: "auto" | "1024x1024" | "1024x1536" | "1536x1024";
```

Defined in: [types.ts:82](https://github.com/elribonazo/uaito/blob/f71ee49b41f4b02cf38cae1844e3a14accc1d794/packages/openai/src/types.ts#L82)

The desired size of the generated image. 'auto' allows the model to choose an appropriate size.
