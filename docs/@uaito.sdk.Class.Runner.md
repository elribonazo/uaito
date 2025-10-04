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

Defined in: [domain/BaseLLM.ts:14](https://github.com/elribonazo/uaito/blob/4dd0eb0a789ce253f2bab714de6ccbcb99265776/packages/sdk/src/domain/BaseLLM.ts#L14)

An abstract class for a runner that performs a task stream.

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

```ts
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [domain/BaseLLM.ts:23](https://github.com/elribonazo/uaito/blob/4dd0eb0a789ce253f2bab714de6ccbcb99265776/packages/sdk/src/domain/BaseLLM.ts#L23)

Performs a task stream.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | `string` | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `system` | `string` | The system prompt. |

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<[`Message`](@uaito.sdk.TypeAlias.Message.md)\>\>

A promise that resolves to a readable stream of messages.
