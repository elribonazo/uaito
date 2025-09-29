<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / HuggingFaceONNX

# Class: HuggingFaceONNX

Defined in: [HuggingFaceONNX.ts:71](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L71)

A class for handling Hugging Face ONNX models.
 HuggingFaceONNX

## Extends

- `BaseLLM`\<`LLMProvider.Local`, [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md)\>

## Constructors

### Constructor

```ts
new HuggingFaceONNX({, onTool?): HuggingFaceONNX;
```

Defined in: [HuggingFaceONNX.ts:123](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L123)

Creates an instance of HuggingFaceONNX.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `{` | \{ `options`: [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md); \} | options } - The options for the LLM. |
| `{.options` | [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md) | - |
| `onTool?` | `OnTool` | Optional callback for tool usage. |

#### Returns

`HuggingFaceONNX`

#### Overrides

```ts
BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>.constructor
```

## Properties

### cache

```ts
cache: BaseLLMCache & {
  imageId?: null | string;
  textId?: null | string;
  thinkingId?: null | string;
};
```

Defined in: [HuggingFaceONNX.ts:77](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L77)

The cache for the LLM.

#### Type Declaration

##### imageId?

```ts
optional imageId: null | string;
```

##### textId?

```ts
optional textId: null | string;
```

##### thinkingId?

```ts
optional thinkingId: null | string;
```

#### Overrides

```ts
BaseLLM.cache
```

***

### data

```ts
data: Record<string, unknown>;
```

Defined in: ../../sdk/build/index.d.ts:89

A record of data for the LLM.

#### Inherited from

[`HuggingFaceONNXTextToAudio`](@uaito.huggingface.Class.HuggingFaceONNXTextToAudio.md).[`data`](@uaito.huggingface.Class.HuggingFaceONNXTextToAudio.md#data)

***

### inputs

```ts
inputs: MessageArray<MessageInput>;
```

Defined in: [HuggingFaceONNX.ts:89](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L89)

An array of message inputs.

#### Overrides

```ts
BaseLLM.inputs
```

***

### loadProgress

```ts
loadProgress: number = 0;
```

Defined in: [HuggingFaceONNX.ts:83](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L83)

The progress of loading the model.

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [HuggingFaceONNX.ts:115](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L115)

***

### options

```ts
readonly options: HuggingFaceONNXOptions;
```

Defined in: ../../sdk/build/index.d.ts:57

#### Inherited from

```ts
BaseLLM.options
```

***

### type

```ts
readonly type: Local;
```

Defined in: ../../sdk/build/index.d.ts:56

#### Inherited from

```ts
BaseLLM.type
```

## Methods

### createStream()

```ts
createStream(): Promise<ReadableStreamWithAsyncIterable<string>>;
```

Defined in: [HuggingFaceONNX.ts:318](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L318)

Creates a readable stream of strings.

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`string`\>\>

A promise that resolves to a readable stream of strings.

***

### includeLastPrompt()

```ts
includeLastPrompt(
   prompt, 
   chainOfThought, 
input): MessageArray<MessageInput>;
```

Defined in: ../../sdk/build/index.d.ts:123

Includes the last prompt in the input.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `input` | `MessageArray`\<`MessageInput`\> | The input messages. |

#### Returns

`MessageArray`\<`MessageInput`\>

The updated input messages.

#### Inherited from

```ts
BaseLLM.includeLastPrompt
```

***

### load()

```ts
load(): Promise<void>;
```

Defined in: [HuggingFaceONNX.ts:165](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L165)

Loads the model and tokenizer.

#### Returns

`Promise`\<`void`\>

***

### log()

```ts
log(message): any;
```

Defined in: ../../sdk/build/index.d.ts:95

Logs a message.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | The message to log. |

#### Returns

`any`

#### Inherited from

```ts
BaseLLM.log
```

***

### performTaskStream()

```ts
performTaskStream(
   prompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [HuggingFaceONNX.ts:437](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L437)

Performs a task stream using the LLM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `system` | `string` | The system prompt. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

A promise that resolves to a readable stream of messages.

#### Overrides

```ts
BaseLLM.performTaskStream
```

***

### retryApiCall()

```ts
retryApiCall<T>(apiCall): Promise<T>;
```

Defined in: ../../sdk/build/index.d.ts:102

Retries an API call with a delay.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `apiCall` | () => `Promise`\<`T`\> | The API call to retry. |

#### Returns

`Promise`\<`T`\>

The result of the API call.

#### Inherited from

```ts
BaseLLM.retryApiCall
```

***

### runAbortable()

```ts
runAbortable<Fn>(fn): Promise<unknown>;
```

Defined in: [HuggingFaceONNX.ts:149](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L149)

Runs an abortable promise.

#### Type Parameters

| Type Parameter |
| ------ |
| `Fn` *extends* `Promise`\<`unknown`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | `Fn` | The promise to run. |

#### Returns

`Promise`\<`unknown`\>

The result of the promise.

***

### runSafeCommand()

```ts
runSafeCommand(toolUse, run): Promise<void>;
```

Defined in: ../../sdk/build/index.d.ts:109

Run a command safely, catching and handling any errors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `toolUse` | `ToolUseBlock` | The tool being used. |
| `run` | (`agent`) => `Promise`\<`void`\> | Function to run the command. |

#### Returns

`Promise`\<`void`\>

#### Inherited from

```ts
BaseLLM.runSafeCommand
```

***

### transformAutoMode()

```ts
transformAutoMode<AChunk>(
   input, 
   getNext, 
onTool?): Promise<ReadableStreamWithAsyncIterable<AChunk>>;
```

Defined in: [HuggingFaceONNX.ts:474](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNX.ts#L474)

Transforms an input stream using the provided transform function.

#### Type Parameters

| Type Parameter |
| ------ |
| `AChunk` *extends* `Message` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ReadableStreamWithAsyncIterable`\<`AChunk`\> | The input stream to be transformed. |
| `getNext` | () => `Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\> | - |
| `onTool?` | `OnTool` | - |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

A promise that resolves to the transformed readable stream.

#### Overrides

```ts
BaseLLM.transformAutoMode
```

***

### transformStream()

```ts
transformStream<AChunk, BChunk>(input, transform): Promise<ReadableStreamWithAsyncIterable<BChunk>>;
```

Defined in: ../../sdk/build/index.d.ts:133

Transforms the given stream from an AI provider into a Uaito Stream
This also keeps track of the received messages

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` | The type of the input chunk. |
| `BChunk` *extends* `Message` | The type of the output chunk. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ReadableStreamWithAsyncIterable`\<`AChunk`\> | The input stream. |
| `transform` | `TransformStreamFn`\<`unknown`, `BChunk`\> | The transform function. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`BChunk`\>\>

A promise that resolves to the transformed stream.

#### Inherited from

```ts
BaseLLM.transformStream
```
