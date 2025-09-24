[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / Tool

# Type Alias: Tool

> **Tool** = `object`

Defined in: [domain/types.ts:42](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L42)

Represents a tool that can be used by an LLM.

## Properties

### code?

> `optional` **code**: `string`

Defined in: [domain/types.ts:75](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L75)

The code for the tool.

***

### description

> **description**: `string`

Defined in: [domain/types.ts:57](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L57)

The description of the tool.

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [domain/types.ts:80](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L80)

Whether the tool is enabled.

***

### id?

> `optional` **id**: `number`

Defined in: [domain/types.ts:47](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L47)

The unique ID of the tool.

***

### input\_schema

> **input\_schema**: `object`

Defined in: [domain/types.ts:62](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L62)

The input schema for the tool.

#### properties

> **properties**: `Record`\<`string`, \{ `default?`: `unknown`; `description`: `string`; `type`: `string`; \}\>

#### required?

> `optional` **required**: `string`[]

#### type

> **type**: `"object"`

***

### isCollapsed?

> `optional` **isCollapsed**: `boolean`

Defined in: [domain/types.ts:85](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L85)

Whether the tool is collapsed.

***

### name

> **name**: `string`

Defined in: [domain/types.ts:52](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L52)

The name of the tool.
