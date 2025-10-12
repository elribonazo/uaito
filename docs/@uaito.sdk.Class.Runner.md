<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / Runner

# Abstract Class: Runner

Defined in: [domain/BaseLLM.ts:15](https://github.com/elribonazo/uaito/blob/9844c1cb1484d433e25c638276f27d2477a43047/packages/sdk/src/domain/BaseLLM.ts#L15)

An abstract class representing a task runner that executes an operation and returns a stream of messages.
This is useful for long-running processes where results are produced incrementally.

 Runner

## Extended by

- [`BaseLLM`](@uaito.sdk.Class.BaseLLM.md)

## Constructors

### Constructor

```ts
new Runner(): Runner;
```

#### Returns

`Runner`

## Methods

### performTaskStream()

#### Call Signature

```ts
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [domain/BaseLLM.ts:24](https://github.com/elribonazo/uaito/blob/9844c1cb1484d433e25c638276f27d2477a43047/packages/sdk/src/domain/BaseLLM.ts#L24)

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

#### Call Signature

```ts
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [domain/BaseLLM.ts:25](https://github.com/elribonazo/uaito/blob/9844c1cb1484d433e25c638276f27d2477a43047/packages/sdk/src/domain/BaseLLM.ts#L25)

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

#### Call Signature

```ts
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [domain/BaseLLM.ts:26](https://github.com/elribonazo/uaito/blob/9844c1cb1484d433e25c638276f27d2477a43047/packages/sdk/src/domain/BaseLLM.ts#L26)

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
