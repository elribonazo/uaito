[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / BaseMessage

# Abstract Class: BaseMessage

Defined in: [domain/types.ts:281](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L281)

An abstract class for a base message.

 BaseMessage

## Constructors

### Constructor

> **new BaseMessage**(): `BaseMessage`

#### Returns

`BaseMessage`

## Properties

### buffer

> `abstract` **buffer**: `string`

Defined in: [domain/types.ts:299](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L299)

The buffer for the message.

***

### replacements

> `abstract` **replacements**: `string`[]

Defined in: [domain/types.ts:293](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L293)

An array of strings to be replaced in the message.

***

### tools

> `protected` **tools**: [`Tool`](../type-aliases/Tool.md)[]

Defined in: [domain/types.ts:306](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L306)

An array of available tools.

## Methods

### cleanChunk()

> `protected` **cleanChunk**(`chunk`): `string`

Defined in: [domain/types.ts:313](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L313)

Cleans a chunk of text by removing replacements.

#### Parameters

##### chunk

`string`

The chunk to clean.

#### Returns

`string`

The cleaned chunk.

***

### render()

> `abstract` **render**(): `Promise`\<[`Message`](../type-aliases/Message.md)\>

Defined in: [domain/types.ts:287](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L287)

Renders the message.

#### Returns

`Promise`\<[`Message`](../type-aliases/Message.md)\>

A promise that resolves to the rendered message.
