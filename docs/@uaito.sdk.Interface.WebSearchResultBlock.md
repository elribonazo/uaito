<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / WebSearchResultBlock

# Interface: WebSearchResultBlock

Defined in: [domain/types.ts:104](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L104)

Represents a web search result block.
 WebSearchResultBlock

## Properties

### encrypted\_content

```ts
encrypted_content: string;
```

Defined in: [domain/types.ts:109](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L109)

The encrypted content of the search result.

***

### page\_age

```ts
page_age: null | string;
```

Defined in: [domain/types.ts:115](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L115)

The age of the page.

***

### title

```ts
title: string;
```

Defined in: [domain/types.ts:121](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L121)

The title of the search result.

***

### type

```ts
type: "web_search_result";
```

Defined in: [domain/types.ts:127](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L127)

The type of the block.

***

### url

```ts
url: string;
```

Defined in: [domain/types.ts:133](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L133)

The URL of the search result.
