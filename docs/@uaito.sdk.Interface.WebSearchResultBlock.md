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

Defined in: [domain/types.ts:104](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L104)

Represents a web search result block.
 WebSearchResultBlock

## Properties

### encrypted\_content

```ts
encrypted_content: string;
```

Defined in: [domain/types.ts:109](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L109)

The encrypted content of the search result.

***

### page\_age

```ts
page_age: null | string;
```

Defined in: [domain/types.ts:115](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L115)

The age of the page.

***

### title

```ts
title: string;
```

Defined in: [domain/types.ts:121](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L121)

The title of the search result.

***

### type

```ts
type: "web_search_result";
```

Defined in: [domain/types.ts:127](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L127)

The type of the block.

***

### url

```ts
url: string;
```

Defined in: [domain/types.ts:133](https://github.com/elribonazo/uaito/blob/91c83b1555092b9f034f87c6de2e2d4cee9b809c/packages/sdk/src/domain/types.ts#L133)

The URL of the search result.
