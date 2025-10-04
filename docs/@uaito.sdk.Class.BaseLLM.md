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

Defined in: [domain/BaseLLM.ts:33](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L33)

Abstract base class for Language Model implementations.

## Extends

- [`Runner`](@uaito.sdk.Class.Runner.md)

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TYPE` *extends* [`LLMProvider`](@uaito.sdk.Enumeration.LLMProvider.md) | The type of the language model. |
| `OPTIONS` | The type of options for the language model, extending BaseLLMOptions. |

## Constructors

### Constructor

```ts
new BaseLLM<TYPE, OPTIONS>(type, options): BaseLLM<TYPE, OPTIONS>;
```

Defined in: [domain/BaseLLM.ts:143](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L143)

Creates an instance of BaseLLM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TYPE` | The type of the language model. |
| `options` | `OPTIONS` | The options for the language model. |

#### Returns

`BaseLLM`\<`TYPE`, `OPTIONS`\>

#### Overrides

[`Runner`](@uaito.sdk.Class.Runner.md).[`constructor`](@uaito.sdk.Class.Runner.md#constructor)

## Properties

### cache

```ts
abstract cache: BaseLLMCache;
```

Defined in: [domain/BaseLLM.ts:52](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L52)

The cache for the LLM.

***

### data

```ts
data: Record<string, unknown> = {};
```

Defined in: [domain/BaseLLM.ts:65](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L65)

A record of data for the LLM.

***

### inputs

```ts
abstract inputs: MessageArray<MessageInput>;
```

Defined in: [domain/BaseLLM.ts:59](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L59)

An array of message inputs.

***

### options

```ts
readonly options: OPTIONS;
```

Defined in: [domain/BaseLLM.ts:143](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L143)

The options for the language model.

***

### type

```ts
readonly type: TYPE;
```

Defined in: [domain/BaseLLM.ts:143](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L143)

The type of the language model.

## Methods

### includeLastPrompt()

```ts
includeLastPrompt(
   prompt, 
   chainOfThought, 
input): MessageArray<MessageInput>;
```

Defined in: [domain/BaseLLM.ts:154](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L154)

Includes the last prompt in the input.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `input` | [`MessageArray`](@uaito.sdk.Class.MessageArray.md)\<[`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md)\> | The input messages. |

#### Returns

[`MessageArray`](@uaito.sdk.Class.MessageArray.md)\<[`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md)\>

The updated input messages.

***

### log()

```ts
log(message): any;
```

Defined in: [domain/BaseLLM.ts:72](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L72)

Logs a message.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | The message to log. |

#### Returns

`any`

***

### performTaskStream()

#### Call Signature

```ts
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [domain/BaseLLM.ts:23](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L23)

Performs a task stream.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | `string` | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `system` | `string` | The system prompt. |

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

Defined in: [domain/BaseLLM.ts:24](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L24)

Performs a task stream.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | [`BlockType`](@uaito.sdk.TypeAlias.BlockType.md)[] | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `system` | `string` | The system prompt. |

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

Defined in: [domain/BaseLLM.ts:25](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L25)

Performs a task stream.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | `string` \| [`BlockType`](@uaito.sdk.TypeAlias.BlockType.md)[] | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `system` | `string` | The system prompt. |

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

Defined in: [domain/BaseLLM.ts:83](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L83)

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

***

### runSafeCommand()

```ts
runSafeCommand(toolUse, run): Promise<void>;
```

Defined in: [domain/BaseLLM.ts:107](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L107)

Run a command safely, catching and handling any errors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `toolUse` | [`ToolUseBlock`](@uaito.sdk.TypeAlias.ToolUseBlock.md) | The tool being used. |
| `run` | (`agent`) => `Promise`\<`void`\> | Function to run the command. |

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

Defined in: [domain/BaseLLM.ts:282](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L282)

Transforms an input stream using the provided transform function.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` *extends* [`Message`](@uaito.sdk.TypeAlias.Message.md) | The type of the input chunk. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`AChunk`\> | The input stream to be transformed. |
| `getNext` | () => `Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`AChunk`\>\> | A function to get the next stream. |
| `onTool?` | [`OnTool`](@uaito.sdk.TypeAlias.OnTool.md) | Optional callback for tool usage. |

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`AChunk`\>\>

A promise that resolves to the transformed readable stream.

***

### transformStream()

```ts
transformStream<AChunk, BChunk>(input, transform): Promise<ReadableStreamWithAsyncIterable<BChunk>>;
```

Defined in: [domain/BaseLLM.ts:194](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/BaseLLM.ts#L194)

Transforms the given stream from an AI provider into a Uaito Stream
This also keeps track of the received messages

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` | The type of the input chunk. |
| `BChunk` *extends* [`Message`](@uaito.sdk.TypeAlias.Message.md) | The type of the output chunk. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`AChunk`\> | The input stream. |
| `transform` | [`TransformStreamFn`](@uaito.sdk.TypeAlias.TransformStreamFn.md)\<`unknown`, `BChunk`\> | The transform function. |

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<`BChunk`\>\>

A promise that resolves to the transformed stream.
