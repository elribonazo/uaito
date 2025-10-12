<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / BaseLLM

# Abstract Class: BaseLLM\<TYPE, OPTIONS\>

Defined in: [domain/BaseLLM.ts:43](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L43)

Abstract base class for Language Model (LLM) implementations. It provides a standardized interface
for interacting with various LLM providers, handling API retries, stream transformations, and tool usage.

## Example

```typescript
class MyCustomLLM extends BaseLLM<LLMProvider.OpenAI, MyOptions> {
  // ... implementation of abstract properties and methods
}
```

## Extends

- [`Runner`](@uaito.sdk.Class.Runner.md)

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TYPE` *extends* [`LLMProvider`](@uaito.sdk.Enumeration.LLMProvider.md) | The specific LLM provider, extending from `LLMProvider`. |
| `OPTIONS` | The configuration options for the LLM. |

## Constructors

### Constructor

```ts
new BaseLLM<TYPE, OPTIONS>(type, options): BaseLLM<TYPE, OPTIONS>;
```

Defined in: [domain/BaseLLM.ts:161](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L161)

Creates an instance of BaseLLM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TYPE` | The type of the language model provider (e.g., `LLMProvider.OpenAI`). |
| `options` | `OPTIONS` | The configuration options for the language model. |

#### Returns

`BaseLLM`\<`TYPE`, `OPTIONS`\>

#### Overrides

[`Runner`](@uaito.sdk.Class.Runner.md).[`constructor`](@uaito.sdk.Class.Runner.md#constructor)

## Properties

### cache

```ts
abstract cache: BaseLLMCache;
```

Defined in: [domain/BaseLLM.ts:63](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L63)

An optional cache for storing LLM responses to improve performance and reduce costs.
Must be implemented by subclasses if caching is desired.

***

### data

```ts
data: Record<string, unknown> = {};
```

Defined in: [domain/BaseLLM.ts:78](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L78)

A generic key-value store for attaching arbitrary data to the LLM instance.
Can be used for session management, tracking metadata, etc.

***

### inputs

```ts
abstract inputs: MessageArray<MessageInput>;
```

Defined in: [domain/BaseLLM.ts:71](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L71)

An array that holds the history of messages for a conversation, including user prompts and model responses.
This is used to maintain context in multi-turn conversations.

***

### options

```ts
readonly options: OPTIONS;
```

Defined in: [domain/BaseLLM.ts:161](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L161)

The configuration options for the language model.

***

### type

```ts
readonly type: TYPE;
```

Defined in: [domain/BaseLLM.ts:161](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L161)

The type of the language model provider (e.g., `LLMProvider.OpenAI`).

## Methods

### includeLastPrompt()

```ts
includeLastPrompt(
   prompt, 
   chainOfThought, 
input): MessageArray<MessageInput>;
```

Defined in: [domain/BaseLLM.ts:174](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L174)

Appends the latest user prompt and the chain of thought to the message history.
It handles both simple string prompts and complex `BlockType` array prompts (e.g., with images).
This method ensures that the prompt is correctly formatted and added to the conversation context.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` \| [`BlockType`](@uaito.sdk.TypeAlias.BlockType.md)[] | The user's prompt. |
| `chainOfThought` | `string` | The reasoning steps for the model. |
| `input` | [`MessageArray`](@uaito.sdk.Class.MessageArray.md)\<[`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md)\> | The current message history. |

#### Returns

[`MessageArray`](@uaito.sdk.Class.MessageArray.md)\<[`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md)\>

The updated message history with the new prompt.

***

### log()

```ts
log(message): void;
```

Defined in: [domain/BaseLLM.ts:86](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L86)

A utility for logging messages. It can be configured to use a custom logger
by passing a `log` function in the options. Defaults to `console.log`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | The message to log. |

#### Returns

`void`

***

### performTaskStream()

#### Call Signature

```ts
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [domain/BaseLLM.ts:24](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L24)

Executes a task and returns a stream of messages.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | `string` | The initial user prompt, which can be a simple string or a rich array of content blocks. |
| `chainOfThought` | `string` | A string outlining the reasoning steps the model should take. |
| `system` | `string` | The system prompt that sets the context and instructions for the model. |

##### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<[`Message`](@uaito.sdk.TypeAlias.Message.md)\>\>

A promise that resolves to a readable stream of messages.

##### Inherited from

[`Runner`](@uaito.sdk.Class.Runner.md).[`performTaskStream`](@uaito.sdk.Class.Runner.md#performtaskstream)

#### Call Signature

```ts
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [domain/BaseLLM.ts:25](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L25)

Executes a task and returns a stream of messages.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | [`BlockType`](@uaito.sdk.TypeAlias.BlockType.md)[] | The initial user prompt, which can be a simple string or a rich array of content blocks. |
| `chainOfThought` | `string` | A string outlining the reasoning steps the model should take. |
| `system` | `string` | The system prompt that sets the context and instructions for the model. |

##### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<[`Message`](@uaito.sdk.TypeAlias.Message.md)\>\>

A promise that resolves to a readable stream of messages.

##### Inherited from

[`Runner`](@uaito.sdk.Class.Runner.md).[`performTaskStream`](@uaito.sdk.Class.Runner.md#performtaskstream)

#### Call Signature

```ts
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [domain/BaseLLM.ts:26](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L26)

Executes a task and returns a stream of messages.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | `string` \| [`BlockType`](@uaito.sdk.TypeAlias.BlockType.md)[] | The initial user prompt, which can be a simple string or a rich array of content blocks. |
| `chainOfThought` | `string` | A string outlining the reasoning steps the model should take. |
| `system` | `string` | The system prompt that sets the context and instructions for the model. |

##### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<[`Message`](@uaito.sdk.TypeAlias.Message.md)\>\>

A promise that resolves to a readable stream of messages.

##### Inherited from

[`Runner`](@uaito.sdk.Class.Runner.md).[`performTaskStream`](@uaito.sdk.Class.Runner.md#performtaskstream)

***

### retryApiCall()

```ts
retryApiCall<T>(apiCall): Promise<T>;
```

Defined in: [domain/BaseLLM.ts:99](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L99)

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

***

### runSafeCommand()

```ts
runSafeCommand(toolUse, run): Promise<void>;
```

Defined in: [domain/BaseLLM.ts:125](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L125)

A safe execution wrapper for tool calls. It catches errors during tool execution,
formats them into a standard error message, and pushes the error back into the input stream
for the LLM to process. This prevents tool failures from crashing the application.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `toolUse` | [`ToolUseBlock`](@uaito.sdk.TypeAlias.ToolUseBlock.md) | The tool use block that triggered the command. |
| `run` | (`agent`) => `Promise`\<`void`\> | The function that executes the tool's logic. |

#### Returns

`Promise`\<`void`\>

***

### transformAutoMode()

```ts
transformAutoMode<AChunk>(
   input, 
   getNext, 
onTool?): Promise<ReadableStreamWithAsyncIterable<AChunk>>;
```

Defined in: [domain/BaseLLM.ts:317](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L317)

Handles the execution flow for an "auto mode" or agentic stream, where the LLM can use tools
and continue its task without waiting for user input. It processes the stream, handles tool calls
via the `onTool` callback, and then recursively calls `getNext` to continue the task with the tool's output.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` *extends* [`Message`](@uaito.sdk.TypeAlias.Message.md) | The type of chunks in the stream, which must extend `Message`. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`AChunk`\> | The initial stream from the LLM. |
| `getNext` | () => `Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`AChunk`\>\> | A function that gets the next stream after a tool call. |
| `onTool?` | [`OnTool`](@uaito.sdk.TypeAlias.OnTool.md) | An optional callback to handle tool usage. |

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`AChunk`\>\>

A promise that resolves to the final transformed stream.

***

### transformStream()

```ts
transformStream<AChunk, BChunk>(input, transform): Promise<ReadableStreamWithAsyncIterable<BChunk>>;
```

Defined in: [domain/BaseLLM.ts:237](https://github.com/elribonazo/uaito/blob/d51cf9e106f03d15b7ca974bc5f777fd382a886d/packages/sdk/src/domain/BaseLLM.ts#L237)

Transforms a raw stream from an AI provider into the standardized Uaito SDK `Message` format.
It processes chunks from the input stream, applies the provided `transform` function,
and emits standardized `Message` objects. It also separates out usage and delta blocks.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` | The type of the chunks in the input stream. |
| `BChunk` *extends* [`Message`](@uaito.sdk.TypeAlias.Message.md) | The type of the chunks in the output stream, which must extend `Message`. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`AChunk`\> | The raw stream from the provider. |
| `transform` | [`TransformStreamFn`](@uaito.sdk.TypeAlias.TransformStreamFn.md)\<`unknown`, `BChunk`\> | A function to transform each chunk. |

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`BChunk`\>\>

A promise that resolves to the transformed stream.
