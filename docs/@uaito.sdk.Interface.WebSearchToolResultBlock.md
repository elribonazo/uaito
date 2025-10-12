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

Defined in: [domain/types.ts:178](https://github.com/elribonazo/uaito/blob/eff2fa84665b7b5951a821a9e4de2f23c3c0bbde/packages/sdk/src/domain/types.ts#L178)

Represents the result block from a web search tool.
 WebSearchToolResultBlock

## Properties

### content

```ts
content: WebSearchToolResultBlockContent;
```

Defined in: [domain/types.ts:183](https://github.com/elribonazo/uaito/blob/eff2fa84665b7b5951a821a9e4de2f23c3c0bbde/packages/sdk/src/domain/types.ts#L183)

The content of the block.

***

### tool\_use\_id

```ts
tool_use_id: string;
```

Defined in: [domain/types.ts:189](https://github.com/elribonazo/uaito/blob/eff2fa84665b7b5951a821a9e4de2f23c3c0bbde/packages/sdk/src/domain/types.ts#L189)

The ID of the tool use.

***

### type

```ts
type: "web_search_tool_result";
```

Defined in: [domain/types.ts:195](https://github.com/elribonazo/uaito/blob/eff2fa84665b7b5951a821a9e4de2f23c3c0bbde/packages/sdk/src/domain/types.ts#L195)

The type of the block, indicating a web search result.
