<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / WebSearchToolResultBlockContent

# Type Alias: WebSearchToolResultBlockContent

```ts
type WebSearchToolResultBlockContent = 
  | WebSearchToolResultError
  | WebSearchResultBlock[];
```

Defined in: [domain/types.ts:149](https://github.com/elribonazo/uaito/blob/5e718d4c4365447ef5056696ab53cf4e29d9d11a/packages/sdk/src/domain/types.ts#L149)

Represents the content of a `WebSearchToolResultBlock`, which can either be an array of `WebSearchResultBlock` or a `WebSearchToolResultError`.
