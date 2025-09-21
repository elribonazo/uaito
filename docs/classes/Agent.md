[**@uaito/sdk**](../README.md)

***

[@uaito/sdk](../README.md) / Agent

# Class: Agent\<T\>

Defined in: [agents/index.ts:13](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L13)

base class for AI agents.

## Type Parameters

### T

`T` *extends* [`LLMProvider`](../enumerations/LLMProvider.md)

The type of LLM provider.

## Constructors

### Constructor

> **new Agent**\<`T`\>(`type`, `options`, `onTool?`, `name?`): `Agent`\<`T`\>

Defined in: [agents/index.ts:90](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L90)

Create a new Agent instance.

#### Parameters

##### type

[`LLMProvider`](../enumerations/LLMProvider.md)

The type of LLM provider.

##### options

[`AgentTypeToOptions`](../type-aliases/AgentTypeToOptions.md)\[`T`\]

Configuration options for the LLM.

##### onTool?

[`OnTool`](../type-aliases/OnTool.md)

Optional callback for tool usage.

##### name?

`string`

Optional name for the agent.

#### Returns

`Agent`\<`T`\>

## Properties

### name

> `protected` **name**: `string`

Defined in: [agents/index.ts:33](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L33)

The name of the agent.

***

### onTool?

> `protected` `optional` **onTool**: [`OnTool`](../type-aliases/OnTool.md)

Defined in: [agents/index.ts:93](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L93)

Optional callback for tool usage.

***

### options

> `protected` **options**: [`AgentTypeToOptions`](../type-aliases/AgentTypeToOptions.md)\[`T`\]

Defined in: [agents/index.ts:92](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L92)

Configuration options for the LLM.

***

### type

> **type**: [`LLMProvider`](../enumerations/LLMProvider.md)

Defined in: [agents/index.ts:91](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L91)

The type of LLM provider.

## Accessors

### chainOfThought

#### Get Signature

> **get** **chainOfThought**(): `string`

Defined in: [agents/index.ts:59](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L59)

Gets the chain of thought for the agent.

##### Returns

`string`

The chain of thought.

***

### inputs

#### Get Signature

> **get** **inputs**(): [`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

Defined in: [agents/index.ts:67](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L67)

Gets the inputs for the agent.

##### Returns

[`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

The inputs.

***

### systemPrompt

#### Get Signature

> **get** **systemPrompt**(): `string`

Defined in: [agents/index.ts:51](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L51)

Gets the system prompt for the agent.

##### Returns

`string`

The system prompt.

***

### tools

#### Get Signature

> **get** **tools**(): [`Tool`](../type-aliases/Tool.md)[]

Defined in: [agents/index.ts:76](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L76)

Gets the tools available to the agent.

##### Returns

[`Tool`](../type-aliases/Tool.md)[]

The tools.

## Methods

### addInputs()

> **addInputs**(`inputs`): `Promise`\<`void`\>

Defined in: [agents/index.ts:104](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L104)

Adds inputs to the agent's client.

#### Parameters

##### inputs

[`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

The inputs to add.

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(): `Promise`\<`void`\>

Defined in: [agents/index.ts:113](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L113)

Loads the agent's client.

#### Returns

`Promise`\<`void`\>

***

### performTask()

> **performTask**(`prompt`): `Promise`\<\{ `response`: [`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>; `usage`: \{ `input`: `number`; `output`: `number`; \}; \}\>

Defined in: [agents/index.ts:183](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L183)

Perform a task using the LLM.

#### Parameters

##### prompt

`string`

The user prompt.

#### Returns

`Promise`\<\{ `response`: [`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>; `usage`: \{ `input`: `number`; `output`: `number`; \}; \}\>

A Promise resolving to the usage and response stream.

***

### retryApiCall()

> **retryApiCall**\<`T`\>(`apiCall`): `Promise`\<`T`\>

Defined in: [agents/index.ts:160](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L160)

Retries an API call with a delay.

#### Type Parameters

##### T

`T`

#### Parameters

##### apiCall

() => `Promise`\<`T`\>

The API call to retry.

#### Returns

`Promise`\<`T`\>

The result of the API call.

***

### runSafeCommand()

> **runSafeCommand**(`toolUse`, `run`): `Promise`\<`void`\>

Defined in: [agents/index.ts:202](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/agents/index.ts#L202)

Run a command safely, catching and handling any errors.

#### Parameters

##### toolUse

[`ToolUseBlock`](../type-aliases/ToolUseBlock.md)

The tool being used.

##### run

(`agent`) => `Promise`\<`void`\>

Function to run the command.

#### Returns

`Promise`\<`void`\>
