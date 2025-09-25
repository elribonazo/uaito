[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / encodeWAV

# Function: encodeWAV()

```ts
function encodeWAV(samples, sampleRate?): ArrayBuffer;
```

Defined in: [HuggingFaceONNXAudio.ts:72](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L72)

Encodes audio samples into a WAV format buffer.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `samples` | `any` | `undefined` | The audio samples to encode. |
| `sampleRate?` | `number` | `16000` | The sample rate of the audio. |

## Returns

`ArrayBuffer`

The encoded WAV buffer.
