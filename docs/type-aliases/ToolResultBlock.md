[**@uaito/sdk**](../README.md)

***

[@uaito/sdk](../packages.md) / ToolResultBlock

# Type Alias: ToolResultBlock

> **ToolResultBlock** = `object`

Defined in: [domain/types.ts:669](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L669)

Represents a tool result block.

## Properties

### content?

> `optional` **content**: [`MessageContent`](MessageContent.md)[]

Defined in: [domain/types.ts:689](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L689)

The content of the block.

***

### isError?

> `optional` **isError**: `boolean`

Defined in: [domain/types.ts:694](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L694)

Whether the tool result is an error.

***

### name

> **name**: `string`

Defined in: [domain/types.ts:679](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L679)

The name of the tool.

***

### tool\_use\_id

> **tool\_use\_id**: `string`

Defined in: [domain/types.ts:674](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L674)

The ID of the tool use.

***

### type

> **type**: `"tool_result"`

Defined in: [domain/types.ts:684](https://github.com/elribonazo/uaito/blob/9ab1ff2aae36a9b426eb3035857a3fddbfc0ec37/packages/sdk/src/domain/types.ts#L684)

The type of the block.
