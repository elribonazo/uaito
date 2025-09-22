[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/huggingface](../README.md) / HuggingFaceONNX

# Class: HuggingFaceONNX

Defined in: [HuggingFaceONNX.ts:71](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L71)

A class for handling Hugging Face ONNX models.
 HuggingFaceONNX

## Extends

- `BaseLLM`\<`LLMProvider.Local`, [`HuggingFaceONNXOptions`](../type-aliases/HuggingFaceONNXOptions.md)\>

## Constructors

### Constructor

> **new HuggingFaceONNX**(`{`, `onTool?`): `HuggingFaceONNX`

Defined in: [HuggingFaceONNX.ts:123](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L123)

Creates an instance of HuggingFaceONNX.

#### Parameters

##### \{

options } - The options for the LLM.

###### options

[`HuggingFaceONNXOptions`](../type-aliases/HuggingFaceONNXOptions.md)

##### onTool?

`OnTool`

Optional callback for tool usage.

#### Returns

`HuggingFaceONNX`

#### Overrides

`BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>.constructor`

## Properties

### cache

> **cache**: `BaseLLMCache` & `object`

Defined in: [HuggingFaceONNX.ts:77](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L77)

The cache for the LLM.

#### Type Declaration

##### imageId?

> `optional` **imageId**: `null` \| `string`

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

[`HuggingFaceONNXTextToAudio`](HuggingFaceONNXTextToAudio.md).[`data`](HuggingFaceONNXTextToAudio.md#data)

***

### inputs

> **inputs**: `MessageArray`\<`MessageInput`\>

Defined in: [HuggingFaceONNX.ts:89](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L89)

An array of message inputs.

#### Overrides

`BaseLLM.inputs`

***

### loadProgress

> **loadProgress**: `number` = `0`

Defined in: [HuggingFaceONNX.ts:83](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L83)

The progress of loading the model.

***

### onTool?

> `optional` **onTool**: `OnTool`

Defined in: [HuggingFaceONNX.ts:115](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L115)

***

### options

> `readonly` **options**: [`HuggingFaceONNXOptions`](../type-aliases/HuggingFaceONNXOptions.md)

Defined in: ../../sdk/build/index.d.ts:56

#### Inherited from

`BaseLLM.options`

***

### type

> `readonly` **type**: `Local`

Defined in: ../../sdk/build/index.d.ts:55

#### Inherited from

`BaseLLM.type`

## Methods

### createStream()

> **createStream**(): `Promise`\<`ReadableStreamWithAsyncIterable`\<`string`\>\>

Defined in: [HuggingFaceONNX.ts:318](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L318)

Creates a readable stream of strings.

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`string`\>\>

A promise that resolves to a readable stream of strings.

***

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

### load()

> **load**(): `Promise`\<`void`\>

Defined in: [HuggingFaceONNX.ts:165](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L165)

Loads the model and tokenizer.

#### Returns

`Promise`\<`void`\>

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

Defined in: [HuggingFaceONNX.ts:437](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L437)

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

### runAbortable()

> **runAbortable**\<`Fn`\>(`fn`): `Promise`\<`unknown`\>

Defined in: [HuggingFaceONNX.ts:149](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L149)

Runs an abortable promise.

#### Type Parameters

##### Fn

`Fn` *extends* `Promise`\<`unknown`\>

#### Parameters

##### fn

`Fn`

The promise to run.

#### Returns

`Promise`\<`unknown`\>

The result of the promise.

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

Defined in: [HuggingFaceONNX.ts:474](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/huggingFace/src/HuggingFaceONNX.ts#L474)

Transforms an input stream using the provided transform function.

#### Type Parameters

##### AChunk

`AChunk` *extends* `Message`

#### Parameters

##### input

`ReadableStreamWithAsyncIterable`\<`AChunk`\>

The input stream to be transformed.

##### getNext

() => `Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

##### onTool?

`OnTool`

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

A promise that resolves to the transformed readable stream.

#### Overrides

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
