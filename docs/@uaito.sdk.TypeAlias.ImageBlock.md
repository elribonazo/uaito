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
  source: {
     data: string;
     media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
     type: "base64";
  };
  type: "image";
};
```

Defined in: [domain/types.ts:520](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/sdk/src/domain/types.ts#L520)

Represents an image block.

## Properties

### source

```ts
source: {
  data: string;
  media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  type: "base64";
};
```

Defined in: [domain/types.ts:525](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/sdk/src/domain/types.ts#L525)

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

Defined in: [domain/types.ts:534](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/sdk/src/domain/types.ts#L534)

The type of the block.
