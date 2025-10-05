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

Defined in: [index.ts:16](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L16)

A class for interacting with the Anthropic API.
 Anthropic

## Extends

- `BaseLLM`\<`LLMProvider.Anthropic`, [`AnthropicOptions`](@uaito.anthropic.TypeAlias.AnthropicOptions.md)\>

## Constructors

### Constructor

```ts
new Anthropic({, onTool?): Anthropic;
```

Defined in: [index.ts:47](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L47)

Creates an instance of the Anthropic LLM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `{` | \{ `onTool?`: `OnTool`; `options`: [`AnthropicOptions`](@uaito.anthropic.TypeAlias.AnthropicOptions.md); \} | options, onTool: onToolParam } - The options for the LLM. |
| `{.onTool?` | `OnTool` | - |
| `{.options?` | [`AnthropicOptions`](@uaito.anthropic.TypeAlias.AnthropicOptions.md) | - |
| `onTool?` | `OnTool` | Optional callback for tool usage. |

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

Defined in: [index.ts:34](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L34)

The Anthropic API client.

***

### cache

```ts
cache: BaseLLMCache;
```

Defined in: [index.ts:22](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L22)

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

Defined in: ../../sdk/build/index.d.ts:95

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

Defined in: [index.ts:40](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L40)

An array of message inputs.

#### Overrides

```ts
BaseLLM.inputs
```

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [index.ts:28](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L28)

Optional callback for tool usage.

***

### options

```ts
readonly options: AnthropicOptions;
```

Defined in: ../../sdk/build/index.d.ts:63

#### Inherited from

```ts
BaseLLM.options
```

***

### type

```ts
readonly type: Anthropic;
```

Defined in: ../../sdk/build/index.d.ts:62

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

Defined in: [index.ts:377](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L377)

Gets the inputs for the LLM.

##### Returns

`MessageParam`[]

The LLM inputs.

***

### maxTokens

#### Get Signature

```ts
get maxTokens(): number;
```

Defined in: [index.ts:63](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L63)

Gets the maximum number of tokens for the model.

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

Defined in: ../../sdk/build/index.d.ts:129

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

### log()

```ts
log(message): any;
```

Defined in: ../../sdk/build/index.d.ts:101

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
performTaskStream<Input, Output>(
   prompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [index.ts:397](https://github.com/elribonazo/uaito/blob/43e51fd5de833da3eaf6272814a790a6205b5df9/packages/anthropic/src/index.ts#L397)

Performs a task stream using the LLM.

#### Type Parameters

| Type Parameter |
| ------ |
| `Input` *extends* `RawMessageStreamEvent` |
| `Output` *extends* `Message` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `any` | The user prompt. |
| `chainOfThought` | `any` | The chain of thought for the task. |
| `system` | `any` | The system prompt. |

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

Defined in: ../../sdk/build/index.d.ts:108

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

Defined in: ../../sdk/build/index.d.ts:115

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

Defined in: ../../sdk/build/index.d.ts:148

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

Defined in: ../../sdk/build/index.d.ts:139

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
