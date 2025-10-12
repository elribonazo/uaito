<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / WebSearchToolResultError

# Interface: WebSearchToolResultError

Defined in: [domain/types.ts:145](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/sdk/src/domain/types.ts#L145)

Represents a web search tool result error.
 WebSearchToolResultError

## Properties

### error\_code

```ts
error_code: 
  | "invalid_tool_input"
  | "unavailable"
  | "max_uses_exceeded"
  | "too_many_requests"
  | "query_too_long";
```

Defined in: [domain/types.ts:150](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/sdk/src/domain/types.ts#L150)

The error code.

***

### type

```ts
type: "web_search_tool_result_error";
```

Defined in: [domain/types.ts:161](https://github.com/elribonazo/uaito/blob/45fe78be02d2e8093f6553d8593d16a88041733d/packages/sdk/src/domain/types.ts#L161)

The type of the block.
