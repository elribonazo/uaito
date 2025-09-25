[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / Runner

# Abstract Class: Runner

Defined in: [domain/BaseLLM.ts:14](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/BaseLLM.ts#L14)

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

Defined in: [domain/BaseLLM.ts:23](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/sdk/src/domain/BaseLLM.ts#L23)

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
