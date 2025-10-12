<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / encodeWAV

# Function: encodeWAV()

```ts
function encodeWAV(samples, sampleRate?): ArrayBuffer;
```

Defined in: [HuggingFaceONNXAudio.ts:75](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L75)

Encodes raw audio samples into a WAV format `ArrayBuffer`.
This is a utility function for creating a valid WAV file from audio data.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `samples` | `Float32Array` | `undefined` | The raw audio samples to encode. |
| `sampleRate?` | `number` | `16000` | The sample rate of the audio. |

## Returns

`ArrayBuffer`

The encoded WAV buffer.
