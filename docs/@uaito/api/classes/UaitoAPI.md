[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/api](../README.md) / UaitoAPI

# Class: UaitoAPI

Defined in: [index.ts:15](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/api/src/index.ts#L15)

## Extends

- `BaseLLM`\<`LLMProvider.API`, [`UaitoAPIOptions`](../type-aliases/UaitoAPIOptions.md)\>

## Constructors

### Constructor

> **new UaitoAPI**(`__namedParameters`, `onTool?`): `UaitoAPI`

Defined in: [index.ts:29](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/api/src/index.ts#L29)

#### Parameters

##### \_\_namedParameters

###### options

[`UaitoAPIOptions`](../type-aliases/UaitoAPIOptions.md)

##### onTool?

`OnTool`

#### Returns

`UaitoAPI`

#### Overrides

`BaseLLM<LLMProvider.API, UaitoAPIOptions>.constructor`

## Properties

### baseUrl

> **baseUrl**: `string`

Defined in: [index.ts:26](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/api/src/index.ts#L26)

***

### cache

> `abstract` **cache**: `BaseLLMCache`

Defined in: [index.ts:17](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/api/src/index.ts#L17)

The cache for the LLM.

#### Overrides

`BaseLLM.cache`

***

### data

> **data**: `Record`\<`string`, `unknown`\>

Defined in: ../../sdk/build/index.d.ts:88

A record of data for the LLM.

#### Inherited from

`BaseLLM.data`

***

### inputs

> `abstract` **inputs**: `MessageArray`\<`MessageInput`\>

Defined in: [index.ts:25](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/api/src/index.ts#L25)

An array of message inputs.

#### Overrides

`BaseLLM.inputs`

***

### onTool?

> `optional` **onTool**: `OnTool`

Defined in: [index.ts:27](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/api/src/index.ts#L27)

***

### options

> `readonly` **options**: [`UaitoAPIOptions`](../type-aliases/UaitoAPIOptions.md)

Defined in: ../../sdk/build/index.d.ts:56

#### Inherited from

`BaseLLM.options`

***

### type

> `readonly` **type**: `API`

Defined in: ../../sdk/build/index.d.ts:55

#### Inherited from

`BaseLLM.type`

## Methods

### includeLastPrompt()

> **includeLastPrompt**(`prompt`, `chainOfThought`, `input`): `MessageArray`\<`MessageInput`\>

Defined in: ../../sdk/build/index.d.ts:122

Includes the last prompt in the input.

#### Parameters

##### prompt

`string`

The user prompt.

##### chainOfThought

`string`

The chain of thought for the task.

##### input

`MessageArray`\<`MessageInput`\>

The input messages.

#### Returns

`MessageArray`\<`MessageInput`\>

The updated input messages.

#### Inherited from

`BaseLLM.includeLastPrompt`

***

### log()

> **log**(`message`): `any`

Defined in: ../../sdk/build/index.d.ts:94

Logs a message.

#### Parameters

##### message

`string`

The message to log.

#### Returns

`any`

#### Inherited from

`BaseLLM.log`

***

### performTaskStream()

> `abstract` **performTaskStream**(`userPrompt`, `chainOfThought`, `system`): `Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

Defined in: [index.ts:105](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/api/src/index.ts#L105)

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

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

A promise that resolves to a readable stream of messages.

#### Overrides

`BaseLLM.performTaskStream`

***

### request()

> **request**(`prompt`): `Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

Defined in: [index.ts:36](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/api/src/index.ts#L36)

#### Parameters

##### prompt

`string`

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

***

### retryApiCall()

> **retryApiCall**\<`T`\>(`apiCall`): `Promise`\<`T`\>

Defined in: ../../sdk/build/index.d.ts:101

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

#### Inherited from

`BaseLLM.retryApiCall`

***

### runSafeCommand()

> **runSafeCommand**(`toolUse`, `run`): `Promise`\<`void`\>

Defined in: ../../sdk/build/index.d.ts:108

Run a command safely, catching and handling any errors.

#### Parameters

##### toolUse

`ToolUseBlock`

The tool being used.

##### run

(`agent`) => `Promise`\<`void`\>

Function to run the command.

#### Returns

`Promise`\<`void`\>

#### Inherited from

`BaseLLM.runSafeCommand`

***

### transformAutoMode()

> **transformAutoMode**\<`AChunk`\>(`input`, `getNext`, `onTool?`): `Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

Defined in: ../../sdk/build/index.d.ts:141

Transforms an input stream using the provided transform function.

#### Type Parameters

##### AChunk

`AChunk` *extends* `Message`

The type of the input chunk.

#### Parameters

##### input

`ReadableStreamWithAsyncIterable`\<`AChunk`\>

The input stream to be transformed.

##### getNext

() => `Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

A function to get the next stream.

##### onTool?

`OnTool`

Optional callback for tool usage.

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

A promise that resolves to the transformed readable stream.

#### Inherited from

`BaseLLM.transformAutoMode`

***

### transformStream()

> **transformStream**\<`AChunk`, `BChunk`\>(`input`, `transform`): `Promise`\<`ReadableStreamWithAsyncIterable`\<`BChunk`\>\>

Defined in: ../../sdk/build/index.d.ts:132

Transforms the given stream from an AI provider into a Uaito Stream
This also keeps track of the received messages

#### Type Parameters

##### AChunk

`AChunk`

The type of the input chunk.

##### BChunk

`BChunk` *extends* `Message`

The type of the output chunk.

#### Parameters

##### input

`ReadableStreamWithAsyncIterable`\<`AChunk`\>

The input stream.

##### transform

`TransformStreamFn`\<`unknown`, `BChunk`\>

The transform function.

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`BChunk`\>\>

A promise that resolves to the transformed stream.

#### Inherited from

`BaseLLM.transformStream`
