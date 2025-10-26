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

Defined in: [domain/types.ts:579](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L579)

Represents a block containing an image.

## Properties

### imageGenerationCallId?

```ts
optional imageGenerationCallId: string;
```

Defined in: [domain/types.ts:598](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L598)

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

Defined in: [domain/types.ts:584](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L584)

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

Defined in: [domain/types.ts:593](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L593)

The type of the block, indicating an image.
