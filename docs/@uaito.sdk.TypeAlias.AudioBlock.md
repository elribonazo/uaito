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

Defined in: [domain/types.ts:560](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/sdk/src/domain/types.ts#L560)

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

Defined in: [domain/types.ts:565](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/sdk/src/domain/types.ts#L565)

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

Defined in: [domain/types.ts:574](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/sdk/src/domain/types.ts#L574)

The type of the block, indicating audio.
