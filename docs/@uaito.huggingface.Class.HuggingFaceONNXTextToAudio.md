<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/huggingface](@uaito.huggingface.md) / HuggingFaceONNXTextToAudio

# Class: HuggingFaceONNXTextToAudio

Defined in: [HuggingFaceONNXAudio.ts:151](https://github.com/elribonazo/uaito/blob/c7b2ced04f8aaf4fc185f81a7ea7b043c4f14fd3/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L151)

A class for handling text-to-audio generation using a Hugging Face ONNX model.
 HuggingFaceONNXTextToAudio

## Extends

- `BaseLLM`\<`LLMProvider.Local`, [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md)\>

## Constructors

### Constructor

```ts
new HuggingFaceONNXTextToAudio({, onTool?): HuggingFaceONNXTextToAudio;
```

Defined in: [HuggingFaceONNXAudio.ts:196](https://github.com/elribonazo/uaito/blob/c7b2ced04f8aaf4fc185f81a7ea7b043c4f14fd3/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L196)

Creates an instance of HuggingFaceONNXTextToAudio.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `{` | \{ `options`: [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md); \} | options } - The options for the LLM. |
| `{.options` | [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md) | - |
| `onTool?` | `OnTool` | Optional callback for tool usage. |

#### Returns

`HuggingFaceONNXTextToAudio`

#### Overrides

```ts
BaseLLM<LLMProvider.Local, HuggingFaceONNXOptions>.constructor
```

## Properties

### cache

```ts
cache: BaseLLMCache;
```

Defined in: [HuggingFaceONNXAudio.ts:158](https://github.com/elribonazo/uaito/blob/c7b2ced04f8aaf4fc185f81a7ea7b043c4f14fd3/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L158)

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

Defined in: ../../sdk/build/index.d.ts:93

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

Defined in: [HuggingFaceONNXAudio.ts:170](https://github.com/elribonazo/uaito/blob/c7b2ced04f8aaf4fc185f81a7ea7b043c4f14fd3/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L170)

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

Defined in: [HuggingFaceONNXAudio.ts:164](https://github.com/elribonazo/uaito/blob/c7b2ced04f8aaf4fc185f81a7ea7b043c4f14fd3/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L164)

The progress of loading the model.

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [HuggingFaceONNXAudio.ts:190](https://github.com/elribonazo/uaito/blob/c7b2ced04f8aaf4fc185f81a7ea7b043c4f14fd3/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L190)

***

### options

```ts
readonly options: HuggingFaceONNXOptions;
```

Defined in: ../../sdk/build/index.d.ts:61

#### Inherited from

```ts
BaseLLM.options
```

***

### type

```ts
readonly type: Local;
```

Defined in: ../../sdk/build/index.d.ts:60

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

Defined in: ../../sdk/build/index.d.ts:127

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

Defined in: [HuggingFaceONNXAudio.ts:208](https://github.com/elribonazo/uaito/blob/c7b2ced04f8aaf4fc185f81a7ea7b043c4f14fd3/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L208)

Loads the model and tokenizer.

#### Returns

`Promise`\<`void`\>

***

### log()

```ts
log(message): any;
```

Defined in: ../../sdk/build/index.d.ts:99

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

Defined in: [HuggingFaceONNXAudio.ts:242](https://github.com/elribonazo/uaito/blob/c7b2ced04f8aaf4fc185f81a7ea7b043c4f14fd3/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L242)

Performs a text-to-audio task stream.

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

Defined in: ../../sdk/build/index.d.ts:106

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

Defined in: ../../sdk/build/index.d.ts:113

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

Defined in: ../../sdk/build/index.d.ts:146

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

Defined in: ../../sdk/build/index.d.ts:137

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
