<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / WebSearchToolResultBlock

# Interface: WebSearchToolResultBlock

Defined in: [domain/types.ts:169](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L169)

Represents a web search tool result block.
 WebSearchToolResultBlock

## Properties

### content

```ts
content: WebSearchToolResultBlockContent;
```

Defined in: [domain/types.ts:174](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L174)

The content of the block.

***

### tool\_use\_id

```ts
tool_use_id: string;
```

Defined in: [domain/types.ts:180](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L180)

The ID of the tool use.

***

### type

```ts
type: "web_search_tool_result";
```

Defined in: [domain/types.ts:186](https://github.com/elribonazo/uaito/blob/23d7d061485e237b2bbd2381e70b698200803cd7/packages/sdk/src/domain/types.ts#L186)

The type of the block.
