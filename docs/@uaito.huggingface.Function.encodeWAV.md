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

Defined in: [HuggingFaceONNXAudio.ts:72](https://github.com/elribonazo/uaito/blob/75571bfa1ec32ece35814caf545c60b4fbdd41ce/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L72)

Encodes audio samples into a WAV format buffer.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `samples` | `any` | `undefined` | The audio samples to encode. |
| `sampleRate?` | `number` | `16000` | The sample rate of the audio. |

## Returns

`ArrayBuffer`

The encoded WAV buffer.
