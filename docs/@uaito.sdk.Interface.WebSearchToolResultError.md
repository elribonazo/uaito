[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / WebSearchToolResultError

# Interface: WebSearchToolResultError

Defined in: [domain/types.ts:145](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L145)

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

Defined in: [domain/types.ts:150](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L150)

The error code.

***

### type

```ts
type: "web_search_tool_result_error";
```

Defined in: [domain/types.ts:161](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/sdk/src/domain/types.ts#L161)

The type of the block.
