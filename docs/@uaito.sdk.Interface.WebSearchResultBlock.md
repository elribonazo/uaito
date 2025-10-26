<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / WebSearchResultBlock

# Interface: WebSearchResultBlock

Defined in: [domain/types.ts:113](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L113)

Represents a web search result block.
 WebSearchResultBlock

## Properties

### encrypted\_content

```ts
encrypted_content: string;
```

Defined in: [domain/types.ts:118](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L118)

The encrypted content of the search result.

***

### page\_age

```ts
page_age: null | string;
```

Defined in: [domain/types.ts:124](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L124)

The age of the page.

***

### title

```ts
title: string;
```

Defined in: [domain/types.ts:130](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L130)

The title of the search result.

***

### type

```ts
type: "web_search_result";
```

Defined in: [domain/types.ts:136](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L136)

The type of the block.

***

### url

```ts
url: string;
```

Defined in: [domain/types.ts:142](https://github.com/elribonazo/uaito/blob/507f1613d5e6a6e111b8b8a3ecd27bd8ac04f333/packages/sdk/src/domain/types.ts#L142)

The URL of the search result.
