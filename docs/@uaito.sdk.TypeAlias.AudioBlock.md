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

Defined in: [domain/types.ts:541](https://github.com/elribonazo/uaito/blob/b53056b16a9c7699ff09c12f8dbdb7b63f986f14/packages/sdk/src/domain/types.ts#L541)

Represents an audio block.

## Properties

### source

```ts
source: {
  data: string;
  media_type: "audio/wav";
  type: "base64";
};
```

Defined in: [domain/types.ts:546](https://github.com/elribonazo/uaito/blob/b53056b16a9c7699ff09c12f8dbdb7b63f986f14/packages/sdk/src/domain/types.ts#L546)

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

Defined in: [domain/types.ts:555](https://github.com/elribonazo/uaito/blob/b53056b16a9c7699ff09c12f8dbdb7b63f986f14/packages/sdk/src/domain/types.ts#L555)

The type of the block.
