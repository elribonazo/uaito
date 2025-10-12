<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / share

# Function: share()

```ts
function share(body, settings): Promise<void>;
```

Defined in: [HuggingFaceONNXAudio.ts:132](https://github.com/elribonazo/uaito/blob/891267acfac775627ab8d2c9451db44d1413ce7c/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L132)

A utility function to share a generated audio file to a Hugging Face Space discussion.
This is primarily for demonstration and sharing purposes.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | `Blob` | The audio file as a `Blob`. |
| `settings` | \{ `prompt`: `string`; \} | The settings for the share, including the prompt. |
| `settings.prompt` | `string` | - |

## Returns

`Promise`\<`void`\>
