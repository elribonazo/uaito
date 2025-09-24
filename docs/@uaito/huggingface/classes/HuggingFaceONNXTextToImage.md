[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/huggingface](../README.md) / HuggingFaceONNXTextToImage

# Class: HuggingFaceONNXTextToImage

Defined in: [HuggingFaceONNXImage.ts:32](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/huggingFace/src/HuggingFaceONNXImage.ts#L32)

A class for handling text-to-image generation using a Hugging Face ONNX model.
 HuggingFaceONNXTextToImage

## Extends

- `BaseLLM`\<`LLMProvider.Local`, [`HuggingFaceONNXOptions`](../type-aliases/HuggingFaceONNXOptions.md)\>

## Constructors

### Constructor

> **new HuggingFaceONNXTextToImage**(`{`, `onTool?`): `HuggingFaceONNXTextToImage`

Defined in: [HuggingFaceONNXImage.ts:77](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/huggingFace/src/HuggingFaceONNXImage.ts#L77)

Creates an instance of HuggingFaceONNXTextToImage.

#### Parameters

##### \{

options } - The options for the LLM.

###### options

[`HuggingFaceONNXOptions`](../type-aliases/HuggingFaceONNXOptions.md)

##### onTool?

`OnTool`

Optional callback for tool usage.

#### Returns

`HuggingFaceONNXTextToImage`

#### Overrides

`BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>.constructor`

## Properties

### cache

> **cache**: `BaseLLMCache`

Defined in: [HuggingFaceONNXImage.ts:39](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/huggingFace/src/HuggingFaceONNXImage.ts#L39)

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

Defined in: [HuggingFaceONNXImage.ts:51](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/huggingFace/src/HuggingFaceONNXImage.ts#L51)

An array of message inputs.

#### Overrides

`BaseLLM.inputs`

***

### loadProgress

> **loadProgress**: `number` = `0`

Defined in: [HuggingFaceONNXImage.ts:45](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/huggingFace/src/HuggingFaceONNXImage.ts#L45)

The progress of loading the model.

***

### onTool?

> `optional` **onTool**: `OnTool`

Defined in: [HuggingFaceONNXImage.ts:71](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/huggingFace/src/HuggingFaceONNXImage.ts#L71)

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

Defined in: [HuggingFaceONNXImage.ts:88](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/huggingFace/src/HuggingFaceONNXImage.ts#L88)

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

> **performTaskStream**(`prompt`): `Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

Defined in: [HuggingFaceONNXImage.ts:149](https://github.com/elribonazo/uaito/blob/105ccfc9cbfb60788b2df8f5af6264d141e7347a/packages/huggingFace/src/HuggingFaceONNXImage.ts#L149)

Performs a text-to-image task stream.

#### Parameters

##### prompt

`string`

The prompt for the task.

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
