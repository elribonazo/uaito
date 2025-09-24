[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/anthropic](../README.md) / Anthropic

# Class: Anthropic

Defined in: [index.ts:16](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L16)

A class for interacting with the Anthropic API.
 Anthropic

## Extends

- `BaseLLM`\<`LLMProvider.Anthropic`, [`AnthropicOptions`](../type-aliases/AnthropicOptions.md)\>

## Constructors

### Constructor

> **new Anthropic**(`{`, `onTool?`): `Anthropic`

Defined in: [index.ts:47](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L47)

Creates an instance of the Anthropic LLM.

#### Parameters

##### \{

options, onTool: onToolParam } - The options for the LLM.

###### onTool?

`OnTool`

###### options

[`AnthropicOptions`](../type-aliases/AnthropicOptions.md)

##### onTool?

`OnTool`

Optional callback for tool usage.

#### Returns

`Anthropic`

#### Overrides

`BaseLLM<LLMProvider.Anthropic, AnthropicOptions>.constructor`

## Properties

### api

> `protected` **api**: `Anthropic`

Defined in: [index.ts:34](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L34)

The Anthropic API client.

***

### cache

> **cache**: `BaseLLMCache`

Defined in: [index.ts:22](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L22)

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

> **inputs**: `MessageArray`\<`MessageInput`\>

Defined in: [index.ts:40](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L40)

An array of message inputs.

#### Overrides

`BaseLLM.inputs`

***

### onTool?

> `optional` **onTool**: `OnTool`

Defined in: [index.ts:28](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L28)

Optional callback for tool usage.

***

### options

> `readonly` **options**: [`AnthropicOptions`](../type-aliases/AnthropicOptions.md)

Defined in: ../../sdk/build/index.d.ts:56

#### Inherited from

`BaseLLM.options`

***

### type

> `readonly` **type**: `Anthropic`

Defined in: ../../sdk/build/index.d.ts:55

#### Inherited from

`BaseLLM.type`

## Accessors

### llmInputs

#### Get Signature

> **get** **llmInputs**(): `MessageParam`[]

Defined in: [index.ts:377](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L377)

Gets the inputs for the LLM.

##### Returns

`MessageParam`[]

The LLM inputs.

***

### maxTokens

#### Get Signature

> **get** **maxTokens**(): `number`

Defined in: [index.ts:63](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L63)

Gets the maximum number of tokens for the model.

##### Returns

`number`

The maximum number of tokens.

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

> **performTaskStream**(`prompt`, `chainOfThought`, `system`): `Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

Defined in: [index.ts:397](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/anthropic/src/index.ts#L397)

Performs a task stream using the LLM.

#### Parameters

##### prompt

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
