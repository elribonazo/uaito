<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / FileBlock

# Type Alias: FileBlock

```ts
type FileBlock = {
  source: {
     content: string;
     media_type: "text/plain" | "text/markdown" | "text/csv" | "application/json";
     name: string;
     type: "string";
  };
  type: "file";
};
```

Defined in: [domain/types.ts:557](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L557)

Represents a block containing a file.

## Properties

### source

```ts
source: {
  content: string;
  media_type: "text/plain" | "text/markdown" | "text/csv" | "application/json";
  name: string;
  type: "string";
};
```

Defined in: [domain/types.ts:562](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L562)

The source of the file.

#### content

```ts
content: string;
```

#### media\_type

```ts
media_type: "text/plain" | "text/markdown" | "text/csv" | "application/json";
```

#### name

```ts
name: string;
```

#### type

```ts
type: "string";
```

***

### type

```ts
type: "file";
```

Defined in: [domain/types.ts:572](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L572)

The type of the block, indicating a file.
