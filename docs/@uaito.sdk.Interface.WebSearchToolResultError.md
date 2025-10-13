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

Defined in: [domain/types.ts:154](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/sdk/src/domain/types.ts#L154)

Represents an error that occurred during a web search tool execution.
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

Defined in: [domain/types.ts:159](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/sdk/src/domain/types.ts#L159)

The error code.

***

### type

```ts
type: "web_search_tool_result_error";
```

Defined in: [domain/types.ts:170](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/sdk/src/domain/types.ts#L170)

The type of the block, indicating a web search error.
