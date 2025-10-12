<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ImageBlock

# Type Alias: ImageBlock

```ts
type ImageBlock = {
  imageGenerationCallId?: string;
  source: {
     data: string;
     media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
     type: "base64";
  };
  type: "image";
};
```

Defined in: [domain/types.ts:534](https://github.com/elribonazo/uaito/blob/a08130038b69653f097dc58d6aedccf1beff2999/packages/sdk/src/domain/types.ts#L534)

Represents a block containing an image.

## Properties

### imageGenerationCallId?

```ts
optional imageGenerationCallId: string;
```

Defined in: [domain/types.ts:553](https://github.com/elribonazo/uaito/blob/a08130038b69653f097dc58d6aedccf1beff2999/packages/sdk/src/domain/types.ts#L553)

Optional ID reference to a previous image generation call (for multi-turn editing).

***

### source

```ts
source: {
  data: string;
  media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  type: "base64";
};
```

Defined in: [domain/types.ts:539](https://github.com/elribonazo/uaito/blob/a08130038b69653f097dc58d6aedccf1beff2999/packages/sdk/src/domain/types.ts#L539)

The source of the image.

#### data

```ts
data: string;
```

#### media\_type

```ts
media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
```

#### type

```ts
type: "base64";
```

***

### type

```ts
type: "image";
```

Defined in: [domain/types.ts:548](https://github.com/elribonazo/uaito/blob/a08130038b69653f097dc58d6aedccf1beff2999/packages/sdk/src/domain/types.ts#L548)

The type of the block, indicating an image.
