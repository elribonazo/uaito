<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/api](@uaito.api.md) / UaitoAPI

# Class: UaitoAPI

Defined in: [index.ts:40](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/api/src/index.ts#L40)

A client for interacting with the Uaito API, which acts as a proxy to various
underlying LLM providers. It extends the `BaseLLM` class to provide a consistent
interface for making API requests and handling streaming responses.

 UaitoAPI

## Example

```typescript
const api = new UaitoAPI({
  options: {
    apiKey: 'YOUR_UAITO_API_KEY',
    provider: LLMProvider.OpenAI,
    agent: 'orquestrator',
    model: 'gpt-4o',
  }
});

const responseStream = await api.performTaskStream("Tell me a joke.");
for await (const chunk of responseStream) {
  // Process each message chunk
}
```

## Extends

- `BaseLLM`\<`LLMProvider.API`, [`UaitoAPIOptions`](@uaito.api.TypeAlias.UaitoAPIOptions.md)\>

## Constructors

### Constructor

```ts
new UaitoAPI(params, onTool?): UaitoAPI;
```

Defined in: [index.ts:78](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/api/src/index.ts#L78)

Creates an instance of the `UaitoAPI` client.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `options`: [`UaitoAPIOptions`](@uaito.api.TypeAlias.UaitoAPIOptions.md); \} | The configuration options for the client. |
| `params.options` | [`UaitoAPIOptions`](@uaito.api.TypeAlias.UaitoAPIOptions.md) | - |
| `onTool?` | `OnTool` | An optional callback for handling tool usage. |

#### Returns

`UaitoAPI`

#### Overrides

```ts
BaseLLM<LLMProvider.API, UaitoAPIOptions>.constructor
```

## Properties

### baseUrl

```ts
baseUrl: string;
```

Defined in: [index.ts:66](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/api/src/index.ts#L66)

The base URL for the Uaito API. Defaults to 'https://uaito.io'.

***

### cache

```ts
cache: BaseLLMCache;
```

Defined in: [index.ts:47](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/api/src/index.ts#L47)

A cache for storing intermediate data.

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

Defined in: [index.ts:60](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/api/src/index.ts#L60)

An array that holds the history of messages for the conversation.

#### Overrides

```ts
BaseLLM.inputs
```

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [index.ts:71](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/api/src/index.ts#L71)

An optional callback function that is triggered when a tool is used.

***

### options

```ts
readonly options: UaitoAPIOptions;
```

Defined in: ../../sdk/build/index.d.ts:73

#### Inherited from

```ts
BaseLLM.options
```

***

### type

```ts
readonly type: API;
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
   userPrompt, 
   chainOfThought?, 
system?): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [index.ts:166](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/api/src/index.ts#L166)

An alias for the `request` method to conform to the `BaseLLM` interface.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | `string` \| `BlockType`[] | The user's prompt. |
| `chainOfThought?` | `string` | - |
| `system?` | `string` | - |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

A promise that resolves to a readable stream of `Message` objects.

#### Overrides

```ts
BaseLLM.performTaskStream
```

***

### request()

```ts
request(prompt): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [index.ts:92](https://github.com/elribonazo/uaito/blob/9afc2f28c155a623225c2a9de805955e51d5a602/packages/api/src/index.ts#L92)

Sends a request to the Uaito API and returns the response as a `ReadableStream`.
This method constructs the request body, including the prompt, message history, and model,
and handles the parsing of the delimited stream of `Message` objects.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` \| `BlockType`[] | The user's prompt. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

A promise that resolves to a readable stream of `Message` objects.

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
