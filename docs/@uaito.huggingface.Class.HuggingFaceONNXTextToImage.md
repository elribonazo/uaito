<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / HuggingFaceONNXTextToImage

# Class: HuggingFaceONNXTextToImage

Defined in: [HuggingFaceONNXImage.ts:32](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNXImage.ts#L32)

A class for handling text-to-image generation using a Hugging Face ONNX model.
 HuggingFaceONNXTextToImage

## Extends

- `BaseLLM`\<`LLMProvider.Local`, [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md)\>

## Constructors

### Constructor

```ts
new HuggingFaceONNXTextToImage({, onTool?): HuggingFaceONNXTextToImage;
```

Defined in: [HuggingFaceONNXImage.ts:77](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNXImage.ts#L77)

Creates an instance of HuggingFaceONNXTextToImage.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `{` | \{ `options`: [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md); \} | options } - The options for the LLM. |
| `{.options` | [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md) | - |
| `onTool?` | `OnTool` | Optional callback for tool usage. |

#### Returns

`HuggingFaceONNXTextToImage`

#### Overrides

```ts
BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>.constructor
```

## Properties

### cache

```ts
cache: BaseLLMCache;
```

Defined in: [HuggingFaceONNXImage.ts:39](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNXImage.ts#L39)

The cache for the LLM.

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

```ts
BaseLLM.data
```

***

### inputs

```ts
inputs: MessageArray<MessageInput>;
```

Defined in: [HuggingFaceONNXImage.ts:51](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNXImage.ts#L51)

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

Defined in: [HuggingFaceONNXImage.ts:45](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNXImage.ts#L45)

The progress of loading the model.

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [HuggingFaceONNXImage.ts:71](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNXImage.ts#L71)

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

Defined in: [HuggingFaceONNXImage.ts:88](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNXImage.ts#L88)

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
performTaskStream(prompt): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [HuggingFaceONNXImage.ts:149](https://github.com/elribonazo/uaito/blob/77ba71ff7452f786e3eb8e2873fb9ad3985a274e/packages/huggingFace/src/HuggingFaceONNXImage.ts#L149)

Performs a text-to-image task stream.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` | The prompt for the task. |

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

Defined in: ../../sdk/build/index.d.ts:142

Transforms an input stream using the provided transform function.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` *extends* `Message` | The type of the input chunk. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ReadableStreamWithAsyncIterable`\<`AChunk`\> | The input stream to be transformed. |
| `getNext` | () => `Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\> | A function to get the next stream. |
| `onTool?` | `OnTool` | Optional callback for tool usage. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

A promise that resolves to the transformed readable stream.

#### Inherited from

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
