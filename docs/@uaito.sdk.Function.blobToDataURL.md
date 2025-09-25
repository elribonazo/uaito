<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / blobToDataURL

# Function: blobToDataURL()

```ts
function blobToDataURL(blob): Promise<string>;
```

Defined in: [domain/utils.ts:6](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/utils.ts#L6)

Converts a Blob to a data URL.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `blob` | `Blob` | The Blob to convert. |

## Returns

`Promise`\<`string`\>

A promise that resolves to the data URL.
