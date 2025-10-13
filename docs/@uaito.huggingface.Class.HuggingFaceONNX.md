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

Defined in: [HuggingFaceONNX.ts:91](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L91)

A class for running Hugging Face ONNX models locally in the browser using WebGPU or WASM.
It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK,
handling model loading, tokenization, stream processing, and tool usage.

 HuggingFaceONNX

## Example

```typescript
const onnx = new HuggingFaceONNX({
  options: {
    model: HuggingFaceONNXModels.JANO,
    device: 'webgpu',
  }
});

await onnx.load();
const { response } = await onnx.performTaskStream("Hello, world!", "", "");
for await (const chunk of response) {
  // Process each message chunk
}
```

## Extends

- `BaseLLM`\<`LLMProvider.Local`, [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md)\>

## Constructors

### Constructor

```ts
new HuggingFaceONNX(params, onTool?): HuggingFaceONNX;
```

Defined in: [HuggingFaceONNX.ts:147](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L147)

Creates an instance of `HuggingFaceONNX`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `options`: [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md); \} | The configuration options for the client. |
| `params.options` | [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md) | - |
| `onTool?` | `OnTool` | An optional callback for handling tool usage, which can also be provided in the options. |

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

Defined in: [HuggingFaceONNX.ts:97](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L97)

The cache for the LLM, extended with optional IDs for tracking thinking, text, and image blocks.

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

Defined in: ../../sdk/build/index.d.ts:108

A generic key-value store for attaching arbitrary data to the LLM instance.
Can be used for session management, tracking metadata, etc.

#### Inherited from

[`HuggingFaceONNXTextToAudio`](@uaito.huggingface.Class.HuggingFaceONNXTextToAudio.md).[`data`](@uaito.huggingface.Class.HuggingFaceONNXTextToAudio.md#data)

***

### inputs

```ts
inputs: MessageArray<MessageInput>;
```

Defined in: [HuggingFaceONNX.ts:109](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L109)

An array that holds the history of messages for the conversation.

#### Overrides

```ts
BaseLLM.inputs
```

***

### loadProgress

```ts
loadProgress: number = 0;
```

Defined in: [HuggingFaceONNX.ts:103](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L103)

The progress of loading the model.

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [HuggingFaceONNX.ts:139](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L139)

An optional callback function that is triggered when a tool is used.

***

### options

```ts
readonly options: HuggingFaceONNXOptions;
```

Defined in: ../../sdk/build/index.d.ts:73

#### Inherited from

```ts
BaseLLM.options
```

***

### type

```ts
readonly type: Local;
```

Defined in: ../../sdk/build/index.d.ts:72

#### Inherited from

```ts
BaseLLM.type
```

## Methods

### createStream()

```ts
createStream(): Promise<ReadableStreamWithAsyncIterable<string>>;
```

Defined in: [HuggingFaceONNX.ts:375](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L375)

Creates a readable stream of strings by running the model's generation process.
It uses a `TextStreamer` to decode the model's output tokens into text in real-time.

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

Defined in: ../../sdk/build/index.d.ts:149

Appends the latest user prompt and the chain of thought to the message history.
It handles both simple string prompts and complex `BlockType` array prompts (e.g., with images).
This method ensures that the prompt is correctly formatted and added to the conversation context.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` \| `BlockType`[] | The user's prompt. |
| `chainOfThought` | `string` | The reasoning steps for the model. |
| `input` | `MessageArray`\<`MessageInput`\> | The current message history. |

#### Returns

`MessageArray`\<`MessageInput`\>

The updated message history with the new prompt.

#### Inherited from

```ts
BaseLLM.includeLastPrompt
```

***

### load()

```ts
load(): Promise<void>;
```

Defined in: [HuggingFaceONNX.ts:193](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L193)

Loads the pre-trained model and tokenizer from Hugging Face. It uses a cache to avoid
redundant downloads. This method also handles the configuration of the model for
WebGPU or WASM execution and provides progress callbacks.

#### Returns

`Promise`\<`void`\>

***

### log()

```ts
log(message): void;
```

Defined in: ../../sdk/build/index.d.ts:115

A utility for logging messages. It can be configured to use a custom logger
by passing a `log` function in the options. Defaults to `console.log`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | The message to log. |

#### Returns

`void`

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

Defined in: [HuggingFaceONNX.ts:507](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L507)

Executes a task by preparing the inputs, running the model's generation process,
and returning the response as a stream. It orchestrates the loading of the model,
creation of the stream, and the application of transformations for auto-mode and tool usage.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `any` | The user's prompt. |
| `chainOfThought` | `any` | The chain of thought for the task. |
| `system` | `any` | The system prompt. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

A promise that resolves to a readable stream of `Message` objects.

#### Overrides

```ts
BaseLLM.performTaskStream
```

***

### retryApiCall()

```ts
retryApiCall<T>(apiCall): Promise<T>;
```

Defined in: ../../sdk/build/index.d.ts:124

A robust wrapper for API calls that automatically retries on `APIConnectionError`.
It uses exponential backoff to wait between retries, making it resilient to transient network issues.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The expected return type of the API call. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `apiCall` | () => `Promise`\<`T`\> | The function that makes the API call. |

#### Returns

`Promise`\<`T`\>

The result of the successful API call.

#### Throws

Throws an error if the API call fails after all retries or if a non-connection error occurs.

#### Inherited from

```ts
BaseLLM.retryApiCall
```

***

### runAbortable()

```ts
runAbortable<Fn>(fn): Promise<unknown>;
```

Defined in: [HuggingFaceONNX.ts:175](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L175)

A wrapper for running a promise that can be aborted via an `AbortSignal`.
If the signal is aborted, the promise is rejected and the model's generation is interrupted.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `Fn` *extends* `Promise`\<`unknown`\> | The type of the promise to run. |

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

Defined in: ../../sdk/build/index.d.ts:133

A safe execution wrapper for tool calls. It catches errors during tool execution,
formats them into a standard error message, and pushes the error back into the input stream
for the LLM to process. This prevents tool failures from crashing the application.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `toolUse` | `ToolUseBlock` | The tool use block that triggered the command. |
| `run` | (`agent`) => `Promise`\<`void`\> | The function that executes the tool's logic. |

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

Defined in: [HuggingFaceONNX.ts:550](https://github.com/elribonazo/uaito/blob/cfa7cf4d40b23c917d18a9623a67ba39385dca04/packages/huggingFace/src/HuggingFaceONNX.ts#L550)

A specialized version of `transformAutoMode` for handling the streaming and tool-use logic
of local Hugging Face models. It manages the lifecycle of the stream reader and reactivates
the stream after a tool call.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` *extends* `Message` | The type of chunks in the stream, which must extend `Message`. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ReadableStreamWithAsyncIterable`\<`AChunk`\> | The initial stream from the model. |
| `getNext` | () => `Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\> | A function to get the next stream after a tool call. |
| `onTool?` | `OnTool` | An optional callback for handling tool usage. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

A promise that resolves to the final transformed stream.

#### Overrides

```ts
BaseLLM.transformAutoMode
```

***

### transformStream()

```ts
transformStream<AChunk, BChunk>(input, transform): Promise<ReadableStreamWithAsyncIterable<BChunk>>;
```

Defined in: ../../sdk/build/index.d.ts:160

Transforms a raw stream from an AI provider into the standardized Uaito SDK `Message` format.
It processes chunks from the input stream, applies the provided `transform` function,
and emits standardized `Message` objects. It also separates out usage and delta blocks.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` | The type of the chunks in the input stream. |
| `BChunk` *extends* `Message` | The type of the chunks in the output stream, which must extend `Message`. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ReadableStreamWithAsyncIterable`\<`AChunk`\> | The raw stream from the provider. |
| `transform` | `TransformStreamFn`\<`unknown`, `BChunk`\> | A function to transform each chunk. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`BChunk`\>\>

A promise that resolves to the transformed stream.

#### Inherited from

```ts
BaseLLM.transformStream
```
