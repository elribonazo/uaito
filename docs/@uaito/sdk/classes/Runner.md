[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / Runner

# Abstract Class: Runner

Defined in: [domain/BaseLLM.ts:14](https://github.com/elribonazo/uaito/blob/59519c0d40f515dbd89fd61e340cabe541998f9e/packages/sdk/src/domain/BaseLLM.ts#L14)

An abstract class for a runner that performs a task stream.

 Runner

## Extended by

- [`BaseLLM`](BaseLLM.md)

## Constructors

### Constructor

> **new Runner**(): `Runner`

#### Returns

`Runner`

## Methods

### performTaskStream()

> `abstract` **performTaskStream**(`userPrompt`, `chainOfThought`, `system`): `Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>\>

Defined in: [domain/BaseLLM.ts:23](https://github.com/elribonazo/uaito/blob/59519c0d40f515dbd89fd61e340cabe541998f9e/packages/sdk/src/domain/BaseLLM.ts#L23)

Performs a task stream.

#### Parameters

##### userPrompt

`string`

The user prompt.

##### chainOfThought

`string`

The chain of thought for the task.

##### system

`string`

The system prompt.

#### Returns

`Promise`\<[`ReadableStreamWithAsyncIterable`](../type-aliases/ReadableStreamWithAsyncIterable.md)\<[`Message`](../type-aliases/Message.md)\>\>

A promise that resolves to a readable stream of messages.
