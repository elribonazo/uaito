<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/anthropic](@uaito.anthropic.md) / Anthropic

# Class: Anthropic

Defined in: [index.ts:34](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L34)

A class for interacting with the Anthropic API, providing a standardized interface
for streaming responses, handling tool usage, and managing conversation history.
It extends the `BaseLLM` class to ensure compatibility with the Uaito SDK.

 Anthropic

## Example

```typescript
const anthropic = new Anthropic({
  options: {
    apiKey: 'YOUR_ANTHROPIC_API_KEY',
    model: AnthropicModels['claude-4-sonnet'],
  }
});

const { response } = await anthropic.performTaskStream("Hello, world!", "", "");
for await (const chunk of response) {
  // Process each message chunk
}
```

## Extends

- `BaseLLM`\<`LLMProvider.Anthropic`, [`AnthropicOptions`](@uaito.anthropic.TypeAlias.AnthropicOptions.md)\>

## Constructors

### Constructor

```ts
new Anthropic(params, onTool?): Anthropic;
```

Defined in: [index.ts:66](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L66)

Creates an instance of the `Anthropic` LLM client.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | \{ `onTool?`: `OnTool`; `options`: [`AnthropicOptions`](@uaito.anthropic.TypeAlias.AnthropicOptions.md); \} | The configuration options for the client. |
| `params.onTool?` | `OnTool` | - |
| `params.options?` | [`AnthropicOptions`](@uaito.anthropic.TypeAlias.AnthropicOptions.md) | - |
| `onTool?` | `OnTool` | An optional callback for handling tool usage, which can also be provided in the options. |

#### Returns

`Anthropic`

#### Overrides

```ts
BaseLLM<LLMProvider.Anthropic, AnthropicOptions>.constructor
```

## Properties

### api

```ts
protected api: Anthropic;
```

Defined in: [index.ts:53](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L53)

The underlying Anthropic SDK client.

***

### cache

```ts
cache: BaseLLMCache;
```

Defined in: [index.ts:41](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L41)

A cache for storing intermediate data during stream processing, such as partial tool inputs
and token counts.

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

Defined in: [index.ts:59](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L59)

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

Defined in: [index.ts:47](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L47)

An optional callback function that is triggered when a tool is used.

***

### options

```ts
readonly options: AnthropicOptions;
```

Defined in: ../../sdk/build/index.d.ts:73

#### Inherited from

```ts
BaseLLM.options
```

***

### type

```ts
readonly type: Anthropic;
```

Defined in: ../../sdk/build/index.d.ts:72

#### Inherited from

```ts
BaseLLM.type
```

## Accessors

### llmInputs

#### Get Signature

```ts
get llmInputs(): MessageParam[];
```

Defined in: [index.ts:400](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L400)

Gets the formatted message history for the LLM, converting each message from the
Uaito SDK format to the Anthropic API format.

##### Returns

`MessageParam`[]

The formatted LLM inputs.

***

### maxTokens

#### Get Signature

```ts
get maxTokens(): number;
```

Defined in: [index.ts:83](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L83)

Gets the maximum number of tokens to generate in the response.
Defaults to 8192 if not specified in the options.

##### Returns

`number`

The maximum number of tokens.

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
performTaskStream<Input, Output>(
   prompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [index.ts:422](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/anthropic/src/index.ts#L422)

Executes a task by sending the prompt and conversation history to the Anthropic API
and returns the response as a stream. It handles the inclusion of the latest prompt,
setting up the stream, and applying transformations for auto-mode and tool usage.

#### Type Parameters

| Type Parameter |
| ------ |
| `Input` *extends* `RawMessageStreamEvent` |
| `Output` *extends* `Message` |

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
