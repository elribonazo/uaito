<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / encodeWAV

# Function: encodeWAV()

```ts
function encodeWAV(samples, sampleRate?): ArrayBuffer;
```

Defined in: [HuggingFaceONNXAudio.ts:72](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L72)

Encodes audio samples into a WAV format buffer.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `samples` | `any` | `undefined` | The audio samples to encode. |
| `sampleRate?` | `number` | `16000` | The sample rate of the audio. |

## Returns

`ArrayBuffer`

The encoded WAV buffer.
