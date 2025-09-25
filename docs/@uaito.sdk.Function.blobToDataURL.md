<div style="display:flex; align-items:center;">
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

Defined in: [domain/utils.ts:6](https://github.com/elribonazo/uaito/blob/d8262c821d12f33c37a2c9be05a267c0d95eb7a1/packages/sdk/src/domain/utils.ts#L6)

Converts a Blob to a data URL.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blob` | `Blob` | The Blob to convert. |

## Returns

`Promise`\<`string`\>

A promise that resolves to the data URL.
