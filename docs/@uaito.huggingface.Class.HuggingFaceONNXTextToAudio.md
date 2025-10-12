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

Defined in: [HuggingFaceONNXAudio.ts:173](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L173)

A class for handling text-to-audio generation using a Hugging Face ONNX model.
It extends the `BaseLLM` class to provide a consistent interface with the Uaito SDK
for loading models, processing inputs, and generating audio streams.

 HuggingFaceONNXTextToAudio

## Example

```typescript
const audioGenerator = new HuggingFaceONNXTextToAudio({
  options: {
    model: 'Xenova/musicgen-small', // Or another compatible model
  }
});

await audioGenerator.load();
const { response } = await audioGenerator.performTaskStream("An upbeat pop song");
for await (const chunk of response) {
  // Process the audio message chunk
}
```

## Extends

- `BaseLLM`\<`LLMProvider.Local`, [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md)\>

## Constructors

### Constructor

```ts
new HuggingFaceONNXTextToAudio(params, onTool?): HuggingFaceONNXTextToAudio;
```

Defined in: [HuggingFaceONNXAudio.ts:222](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L222)

Creates an instance of `HuggingFaceONNXTextToAudio`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `options`: [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md); \} | The configuration options for the client. |
| `params.options` | [`HuggingFaceONNXOptions`](@uaito.huggingface.TypeAlias.HuggingFaceONNXOptions.md) | - |
| `onTool?` | `OnTool` | An optional callback for handling tool usage. |

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

Defined in: [HuggingFaceONNXAudio.ts:180](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L180)

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

Defined in: ../../sdk/build/index.d.ts:108

A generic key-value store for attaching arbitrary data to the LLM instance.
Can be used for session management, tracking metadata, etc.

#### Inherited from

```ts
BaseLLM.data
```

***

### inputs

```ts
inputs: MessageArray<MessageInput>;
```

Defined in: [HuggingFaceONNXAudio.ts:192](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L192)

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

Defined in: [HuggingFaceONNXAudio.ts:186](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L186)

The progress of loading the model.

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [HuggingFaceONNXAudio.ts:216](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L216)

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

Defined in: [HuggingFaceONNXAudio.ts:235](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L235)

Loads the audio generation model, processor, and tokenizer from Hugging Face.
It provides progress callbacks for monitoring the download and setup process.

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
performTaskStream(prompt): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [HuggingFaceONNXAudio.ts:271](https://github.com/elribonazo/uaito/blob/3bf7d75cb3f0e893e3a107b0621b24cb705e58bb/packages/huggingFace/src/HuggingFaceONNXAudio.ts#L271)

Performs the text-to-audio generation task. It tokenizes the input prompt,
runs the model to generate audio samples, encodes the samples into a WAV file,
and returns the result as a `Message` in a readable stream.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` \| `BlockType`[] | The text prompt for the audio generation. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

A promise that resolves to a readable stream of messages containing the audio.

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

Defined in: ../../sdk/build/index.d.ts:171

Handles the execution flow for an "auto mode" or agentic stream, where the LLM can use tools
and continue its task without waiting for user input. It processes the stream, handles tool calls
via the `onTool` callback, and then recursively calls `getNext` to continue the task with the tool's output.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` *extends* `Message` | The type of chunks in the stream, which must extend `Message`. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ReadableStreamWithAsyncIterable`\<`AChunk`\> | The initial stream from the LLM. |
| `getNext` | () => `Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\> | A function that gets the next stream after a tool call. |
| `onTool?` | `OnTool` | An optional callback to handle tool usage. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

A promise that resolves to the final transformed stream.

#### Inherited from

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
