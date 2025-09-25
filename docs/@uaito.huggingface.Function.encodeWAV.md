[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / encodeWAV

# Function: encodeWAV()

```ts
function encodeWAV(samples, sampleRate?): ArrayBuffer;
```

Defined in: [HuggingFaceONNXAudio.ts:72](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L72)

Encodes audio samples into a WAV format buffer.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `samples` | `any` | `undefined` | The audio samples to encode. |
| `sampleRate?` | `number` | `16000` | The sample rate of the audio. |

## Returns

`ArrayBuffer`

The encoded WAV buffer.
