[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / BaseLLM

# Abstract Class: BaseLLM\<TYPE, OPTIONS\>

Defined in: [domain/BaseLLM.ts:32](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L32)

Abstract base class for Language Model implementations.

## Extends

- [`Runner`](Runner.md)

## Type Parameters

### TYPE

`TYPE` *extends* [`LLMProvider`](../enumerations/LLMProvider.md)

The type of the language model.

### OPTIONS

`OPTIONS`

The type of options for the language model, extending BaseLLMOptions.

## Constructors

### Constructor

> **new BaseLLM**\<`TYPE`, `OPTIONS`\>(`type`, `options`): `BaseLLM`\<`TYPE`, `OPTIONS`\>

Defined in: [domain/BaseLLM.ts:142](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L142)

Creates an instance of BaseLLM.

#### Parameters

##### type

`TYPE`

The type of the language model.

##### options

`OPTIONS`

The options for the language model.

#### Returns

`BaseLLM`\<`TYPE`, `OPTIONS`\>

#### Overrides

[`Runner`](Runner.md).[`constructor`](Runner.md#constructor)

## Properties

### cache

> `abstract` **cache**: [`BaseLLMCache`](../type-aliases/BaseLLMCache.md)

Defined in: [domain/BaseLLM.ts:51](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L51)

The cache for the LLM.

***

### data

> **data**: `Record`\<`string`, `unknown`\> = `{}`

Defined in: [domain/BaseLLM.ts:64](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L64)

A record of data for the LLM.

***

### inputs

> `abstract` **inputs**: [`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

Defined in: [domain/BaseLLM.ts:58](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L58)

An array of message inputs.

***

### options

> `readonly` **options**: `OPTIONS`

Defined in: [domain/BaseLLM.ts:142](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L142)

The options for the language model.

***

### type

> `readonly` **type**: `TYPE`

Defined in: [domain/BaseLLM.ts:142](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L142)

The type of the language model.

## Methods

### includeLastPrompt()

> **includeLastPrompt**(`prompt`, `chainOfThought`, `input`): [`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

Defined in: [domain/BaseLLM.ts:153](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L153)

Includes the last prompt in the input.

#### Parameters

##### prompt

`string`

The user prompt.

##### chainOfThought

`string`

The chain of thought for the task.

##### input

[`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

The input messages.

#### Returns

[`MessageArray`](MessageArray.md)\<[`MessageInput`](../type-aliases/MessageInput.md)\>

The updated input messages.

***

### log()

> **log**(`message`): `any`

Defined in: [domain/BaseLLM.ts:71](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L71)

Logs a message.

#### Parameters

##### message

`string`

The message to log.

#### Returns

`any`

***

### performTaskStream()

> `abstract` **performTaskStream**(`userPrompt`, `chainOfThought`, `system`): `Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>\>

Defined in: [domain/BaseLLM.ts:23](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L23)

Performs a task stream.

#### Parameters

##### userPrompt

`string`

The user prompt.

##### chainOfThought

`string`

The chain of thought for the task.

##### system

`string`

The system prompt.

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>\>

A promise that resolves to a readable stream of messages.

#### Inherited from

[`Runner`](Runner.md).[`performTaskStream`](Runner.md#performtaskstream)

***

### retryApiCall()

> **retryApiCall**\<`T`\>(`apiCall`): `Promise`\<`T`\>

Defined in: [domain/BaseLLM.ts:82](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L82)

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

Defined in: [domain/BaseLLM.ts:106](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L106)

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

***

### transformAutoMode()

> **transformAutoMode**\<`AChunk`\>(`input`, `getNext`, `onTool?`): `Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<`AChunk`\>\>

Defined in: [domain/BaseLLM.ts:286](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L286)

Transforms an input stream using the provided transform function.

#### Type Parameters

##### AChunk

`AChunk` *extends* [`Message`](../type-aliases/Message.md)

The type of the input chunk.

#### Parameters

##### input

[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<`AChunk`\>

The input stream to be transformed.

##### getNext

() => `Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<`AChunk`\>\>

A function to get the next stream.

##### onTool?

[`OnTool`](../type-aliases/OnTool.md)

Optional callback for tool usage.

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<`AChunk`\>\>

A promise that resolves to the transformed readable stream.

***

### transformStream()

> **transformStream**\<`AChunk`, `BChunk`\>(`input`, `transform`): `Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<`BChunk`\>\>

Defined in: [domain/BaseLLM.ts:193](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/BaseLLM.ts#L193)

Transforms the given stream from an AI provider into a Uaito Stream
This also keeps track of the received messages

#### Type Parameters

##### AChunk

`AChunk`

The type of the input chunk.

##### BChunk

`BChunk` *extends* [`Message`](../type-aliases/Message.md)

The type of the output chunk.

#### Parameters

##### input

[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<`AChunk`\>

The input stream.

##### transform

[`TransformStreamFn`](../type-aliases/TransformStreamFn.md)\<`unknown`, `BChunk`\>

The transform function.

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<`BChunk`\>\>

A promise that resolves to the transformed stream.
