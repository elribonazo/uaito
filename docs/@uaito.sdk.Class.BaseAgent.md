<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / BaseAgent

# Abstract Class: BaseAgent

Defined in: [domain/types.ts:341](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L341)

An abstract class for a base agent.

 BaseAgent

## Constructors

### Constructor

```ts
new BaseAgent(): BaseAgent;
```

#### Returns

`BaseAgent`

## Properties

### chainOfThought

```ts
abstract chainOfThought: string;
```

Defined in: [domain/types.ts:377](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L377)

The chain of thought for the agent.

***

### inputs

```ts
abstract inputs: MessageArray<MessageInput>;
```

Defined in: [domain/types.ts:365](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L365)

An array of message inputs.

***

### name

```ts
abstract name: string;
```

Defined in: [domain/types.ts:359](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L359)

The name of the agent.

***

### onTool?

```ts
abstract optional onTool: OnTool;
```

Defined in: [domain/types.ts:353](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L353)

Optional callback for tool usage.

***

### options

```ts
abstract options: BaseLLMOptions;
```

Defined in: [domain/types.ts:347](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L347)

The options for the base LLM.

***

### systemPrompt

```ts
abstract systemPrompt: string;
```

Defined in: [domain/types.ts:371](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L371)

The system prompt for the agent.

## Methods

### addInputs()

```ts
abstract addInputs(inputs): Promise<void>;
```

Defined in: [domain/types.ts:385](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L385)

Adds inputs to the agent.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `inputs` | [`MessageArray`](@uaito.sdk.Class.MessageArray.md)\<[`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md)\> | The inputs to add. |

#### Returns

`Promise`\<`void`\>

***

### load()

```ts
abstract load(): Promise<void>;
```

Defined in: [domain/types.ts:391](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L391)

Loads the agent.

#### Returns

`Promise`\<`void`\>

***

### performTask()

```ts
abstract performTask(prompt): Promise<{
  response: ReadableStreamWithAsyncIterable<Message>;
  usage: {
     input: number;
     output: number;
  };
}>;
```

Defined in: [domain/types.ts:398](https://github.com/elribonazo/uaito/blob/86bf47394f8c160da6e2e0063e1d7798c5b0b374/packages/sdk/src/domain/types.ts#L398)

Performs a task using the agent.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` | The prompt for the task. |

#### Returns

`Promise`\<\{
  `response`: [`ReadableStreamWithAsyncIterable`](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md)\<[`Message`](@uaito.sdk.TypeAlias.Message.md)\>;
  `usage`: \{
     `input`: `number`;
     `output`: `number`;
  \};
\}\>

A promise that resolves to the usage and response stream.
