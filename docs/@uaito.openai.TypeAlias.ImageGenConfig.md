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

Defined in: [types.ts:65](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/openai/src/types.ts#L65)

Defines the configuration for image generation when using the OpenAI provider.

## Properties

### input\_fidelity

```ts
input_fidelity: "high" | "low";
```

Defined in: [types.ts:90](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/openai/src/types.ts#L90)

The fidelity of the input image, if one is provided for editing.

***

### model

```ts
model: OpenAIImageModels;
```

Defined in: [types.ts:70](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/openai/src/types.ts#L70)

The specific image generation model to use.

***

### output\_format

```ts
output_format: "png" | "jpeg";
```

Defined in: [types.ts:80](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/openai/src/types.ts#L80)

The output format for the generated image.

***

### quality

```ts
quality: "high" | "low";
```

Defined in: [types.ts:75](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/openai/src/types.ts#L75)

The desired quality of the generated image. 'high' provides better detail at a higher cost.

***

### size

```ts
size: "auto" | "1024x1024" | "1024x1536" | "1536x1024";
```

Defined in: [types.ts:85](https://github.com/elribonazo/uaito/blob/da3c3d501590ce3df6d04b765a1a97716886b610/packages/openai/src/types.ts#L85)

The desired size of the generated image. 'auto' allows the model to choose an appropriate size.
