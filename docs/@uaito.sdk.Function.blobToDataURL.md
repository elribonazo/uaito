<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / blobToDataURL

# Function: blobToDataURL()

```ts
function blobToDataURL(blob): Promise<string>;
```

Defined in: [domain/utils.ts:6](https://github.com/elribonazo/uaito/blob/7d193aae630d32597c1be974f6ce03fc7e0727a3/packages/sdk/src/domain/utils.ts#L6)

Converts a Blob to a data URL.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blob` | `Blob` | The Blob to convert. |

## Returns

`Promise`\<`string`\>

A promise that resolves to the data URL.
