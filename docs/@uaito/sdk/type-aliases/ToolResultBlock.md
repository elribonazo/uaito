[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / ToolResultBlock

# Type Alias: ToolResultBlock

> **ToolResultBlock** = `object`

Defined in: [domain/types.ts:674](https://github.com/elribonazo/uaito/blob/31c0fa3f3740ebed4d8141441f73c3b47e4aa6f9/packages/sdk/src/domain/types.ts#L674)

Represents a tool result block.

## Properties

### content?

> `optional` **content**: [`MessageContent`](MessageContent.md)[]

Defined in: [domain/types.ts:694](https://github.com/elribonazo/uaito/blob/31c0fa3f3740ebed4d8141441f73c3b47e4aa6f9/packages/sdk/src/domain/types.ts#L694)

The content of the block.

***

### isError?

> `optional` **isError**: `boolean`

Defined in: [domain/types.ts:699](https://github.com/elribonazo/uaito/blob/31c0fa3f3740ebed4d8141441f73c3b47e4aa6f9/packages/sdk/src/domain/types.ts#L699)

Whether the tool result is an error.

***

### name

> **name**: `string`

Defined in: [domain/types.ts:684](https://github.com/elribonazo/uaito/blob/31c0fa3f3740ebed4d8141441f73c3b47e4aa6f9/packages/sdk/src/domain/types.ts#L684)

The name of the tool.

***

### tool\_use\_id

> **tool\_use\_id**: `string`

Defined in: [domain/types.ts:679](https://github.com/elribonazo/uaito/blob/31c0fa3f3740ebed4d8141441f73c3b47e4aa6f9/packages/sdk/src/domain/types.ts#L679)

The ID of the tool use.

***

### type

> **type**: `"tool_result"`

Defined in: [domain/types.ts:689](https://github.com/elribonazo/uaito/blob/31c0fa3f3740ebed4d8141441f73c3b47e4aa6f9/packages/sdk/src/domain/types.ts#L689)

The type of the block.
