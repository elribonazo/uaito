[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/openai](../README.md) / OpenAI

# Class: OpenAI

Defined in: [index.ts:44](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L44)

A more complete implementation of the OpenAI-based LLM,
mirroring the structure and patterns found in the Anthropic class.

## Extends

- `BaseLLM`\<`LLMProvider.OpenAI`, [`OpenAIOptions`](../type-aliases/OpenAIOptions.md)\>

## Constructors

### Constructor

> **new OpenAI**(`{`, `onTool?`): `OpenAI`

Defined in: [index.ts:100](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L100)

Creates an instance of the OpenAI LLM.

#### Parameters

##### \{

options } - The options for the LLM.

###### options

[`OpenAIOptions`](../type-aliases/OpenAIOptions.md)

##### onTool?

`OnTool`

Optional callback for tool usage.

#### Returns

`OpenAI`

#### Overrides

`BaseLLM<LLMProvider.OpenAI, OpenAIOptions>.constructor`

## Properties

### cache

> **cache**: `BaseLLMCache` & `object`

Defined in: [index.ts:68](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L68)

The cache for the LLM.

#### Type Declaration

##### imageBase64

> **imageBase64**: `null` \| `string`

##### imageGenerationCallId

> **imageGenerationCallId**: `null` \| `string`

##### textId?

> `optional` **textId**: `null` \| `string`

##### thinkingId?

> `optional` **thinkingId**: `null` \| `string`

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

Defined in: [index.ts:61](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L61)

An array of message inputs.

#### Overrides

`BaseLLM.inputs`

***

### onTool?

> `optional` **onTool**: `OnTool`

Defined in: [index.ts:49](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L49)

Optional callback for tool usage.

***

### options

> `readonly` **options**: [`OpenAIOptions`](../type-aliases/OpenAIOptions.md)

Defined in: ../../sdk/build/index.d.ts:56

#### Inherited from

`BaseLLM.options`

***

### type

> `readonly` **type**: `OpenAI`

Defined in: ../../sdk/build/index.d.ts:55

#### Inherited from

`BaseLLM.type`

## Accessors

### llmInputs

#### Get Signature

> **get** **llmInputs**(): `ResponseInputItem`[]

Defined in: [index.ts:216](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L216)

Gets the inputs for the LLM.

##### Returns

`ResponseInputItem`[]

The LLM inputs.

***

### maxTokens

#### Get Signature

> **get** **maxTokens**(): `number`

Defined in: [index.ts:118](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L118)

Return max tokens or a default (e.g. 4096).

##### Returns

`number`

The maximum number of tokens.

***

### tools

#### Get Signature

> **get** **tools**(): `undefined` \| `Tool`[]

Defined in: [index.ts:191](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L191)

Gets the tools available to the LLM.

##### Returns

`undefined` \| `Tool`[]

The available tools.

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

Defined in: [index.ts:353](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/openai/src/index.ts#L353)

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
