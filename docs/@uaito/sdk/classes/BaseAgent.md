[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / BaseAgent

# Abstract Class: BaseAgent

Defined in: [domain/types.ts:341](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L341)

An abstract class for a base agent.

 BaseAgent

## Constructors

### Constructor

> **new BaseAgent**(): `BaseAgent`

#### Returns

`BaseAgent`

## Properties

### chainOfThought

> `abstract` **chainOfThought**: `string`

Defined in: [domain/types.ts:377](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L377)

The chain of thought for the agent.

***

### inputs

> `abstract` **inputs**: [`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

Defined in: [domain/types.ts:365](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L365)

An array of message inputs.

***

### name

> `abstract` **name**: `string`

Defined in: [domain/types.ts:359](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L359)

The name of the agent.

***

### onTool?

> `abstract` `optional` **onTool**: [`OnTool`](../type-aliases/OnTool.md)

Defined in: [domain/types.ts:353](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L353)

Optional callback for tool usage.

***

### options

> `abstract` **options**: [`BaseLLMOptions`](../type-aliases/BaseLLMOptions.md)

Defined in: [domain/types.ts:347](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L347)

The options for the base LLM.

***

### systemPrompt

> `abstract` **systemPrompt**: `string`

Defined in: [domain/types.ts:371](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L371)

The system prompt for the agent.

## Methods

### addInputs()

> `abstract` **addInputs**(`inputs`): `Promise`\<`void`\>

Defined in: [domain/types.ts:385](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L385)

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

Defined in: [domain/types.ts:391](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L391)

Loads the agent.

#### Returns

`Promise`\<`void`\>

***

### performTask()

> `abstract` **performTask**(`prompt`): `Promise`\<\{ `response`: [`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>; `usage`: \{ `input`: `number`; `output`: `number`; \}; \}\>

Defined in: [domain/types.ts:398](https://github.com/elribonazo/uaito/blob/0785510d8ad92c6f9514ad770b3e81162500e4a0/packages/sdk/src/domain/types.ts#L398)

Performs a task using the agent.

#### Parameters

##### prompt

`string`

The prompt for the task.

#### Returns

`Promise`\<\{ `response`: [`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>; `usage`: \{ `input`: `number`; `output`: `number`; \}; \}\>

A promise that resolves to the usage and response stream.
