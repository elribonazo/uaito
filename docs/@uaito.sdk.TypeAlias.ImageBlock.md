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

Defined in: [domain/types.ts:520](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L520)

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

Defined in: [domain/types.ts:525](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L525)

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

Defined in: [domain/types.ts:534](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/types.ts#L534)

The type of the block.
