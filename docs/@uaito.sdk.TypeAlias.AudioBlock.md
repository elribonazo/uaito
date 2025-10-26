<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / AudioBlock

# Type Alias: AudioBlock

```ts
type AudioBlock = {
  source: {
     data: string;
     media_type: "audio/wav";
     type: "base64";
  };
  type: "audio";
};
```

Defined in: [domain/types.ts:605](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L605)

Represents a block containing audio.

## Properties

### source

```ts
source: {
  data: string;
  media_type: "audio/wav";
  type: "base64";
};
```

Defined in: [domain/types.ts:610](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L610)

The source of the audio.

#### data

```ts
data: string;
```

#### media\_type

```ts
media_type: "audio/wav";
```

#### type

```ts
type: "base64";
```

***

### type

```ts
type: "audio";
```

Defined in: [domain/types.ts:619](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L619)

The type of the block, indicating audio.
