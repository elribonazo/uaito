[**@uaito/sdk**](../README.md)

***

[@uaito/sdk](../README.md) / BaseAgent

# Abstract Class: BaseAgent

Defined in: [domain/types.ts:342](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L342)

An abstract class for a base agent.

## Export

BaseAgent

## Constructors

### Constructor

> **new BaseAgent**(): `BaseAgent`

#### Returns

`BaseAgent`

## Properties

### chainOfThought

> `abstract` **chainOfThought**: `string`

Defined in: [domain/types.ts:372](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L372)

The chain of thought for the agent.

***

### name

> `abstract` **name**: `string`

Defined in: [domain/types.ts:360](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L360)

The name of the agent.

***

### onTool?

> `abstract` `optional` **onTool**: [`OnTool`](../type-aliases/OnTool.md)

Defined in: [domain/types.ts:354](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L354)

Optional callback for tool usage.

***

### options

> `abstract` **options**: [`BaseLLMOptions`](../type-aliases/BaseLLMOptions.md)

Defined in: [domain/types.ts:348](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L348)

The options for the base LLM.

***

### systemPrompt

> `abstract` **systemPrompt**: `string`

Defined in: [domain/types.ts:366](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L366)

The system prompt for the agent.

## Methods

### addInputs()

> `abstract` **addInputs**(`inputs`): `Promise`\<`void`\>

Defined in: [domain/types.ts:380](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L380)

Adds inputs to the agent.

#### Parameters

##### inputs

[`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

The inputs to add.

#### Returns

`Promise`\<`void`\>

***

### load()

> `abstract` **load**(): `Promise`\<`void`\>

Defined in: [domain/types.ts:386](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L386)

Loads the agent.

#### Returns

`Promise`\<`void`\>

***

### performTask()

> `abstract` **performTask**(`prompt`): `Promise`\<\{ `response`: [`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>; `usage`: \{ `input`: `number`; `output`: `number`; \}; \}\>

Defined in: [domain/types.ts:393](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L393)

Performs a task using the agent.

#### Parameters

##### prompt

`string`

The prompt for the task.

#### Returns

`Promise`\<\{ `response`: [`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>; `usage`: \{ `input`: `number`; `output`: `number`; \}; \}\>

A promise that resolves to the usage and response stream.
