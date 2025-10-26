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

Defined in: [domain/types.ts:351](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L351)

An abstract class defining the core structure and functionality of an agent.
Agents encapsulate an LLM and provide a higher-level interface for performing tasks.

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

Defined in: [domain/types.ts:387](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L387)

The chain of thought or reasoning steps for the agent to follow.

***

### inputs

```ts
abstract inputs: MessageArray<MessageInput>;
```

Defined in: [domain/types.ts:375](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L375)

An array that holds the history of messages for a conversation.

***

### name

```ts
abstract name: string;
```

Defined in: [domain/types.ts:369](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L369)

The name of the agent.

***

### onTool?

```ts
abstract optional onTool: OnTool;
```

Defined in: [domain/types.ts:363](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L363)

An optional callback function that is triggered when a tool is used.

***

### options

```ts
abstract options: BaseLLMOptions;
```

Defined in: [domain/types.ts:357](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L357)

Configuration options for the underlying `BaseLLM`.

***

### systemPrompt

```ts
abstract systemPrompt: string;
```

Defined in: [domain/types.ts:381](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L381)

The system prompt that defines the agent's behavior and context.

## Methods

### addInputs()

```ts
abstract addInputs(inputs): Promise<void>;
```

Defined in: [domain/types.ts:395](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L395)

Adds a message history to the agent's context.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `inputs` | [`MessageArray`](@uaito.sdk.Class.MessageArray.md)\<[`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md)\> | The message history to add. |

#### Returns

`Promise`\<`void`\>

***

### load()

```ts
abstract load(): Promise<void>;
```

Defined in: [domain/types.ts:401](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L401)

Initializes or loads the agent, preparing it for task execution.

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

Defined in: [domain/types.ts:408](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/sdk/src/domain/types.ts#L408)

Executes a task with the given prompt.

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

A promise that resolves to the token usage and a stream of response messages.
