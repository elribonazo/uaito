<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/ai](@uaito.ai.md) / Agent

# Class: Agent

Defined in: [index.ts:13](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L13)

base class for AI agents.

## Template

The type of LLM provider.

## Constructors

### Constructor

```ts
new Agent(
   agent, 
   onTool?, 
   name?): Agent;
```

Defined in: [index.ts:96](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L96)

Create a new Agent instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `agent` | `BaseLLM`\<`LLMProvider`, `any`\> | - |
| `onTool?` | `OnTool` | Optional callback for tool usage. |
| `name?` | `string` | Optional name for the agent. |

#### Returns

`Agent`

## Properties

### \_chainOfThought

```ts
private _chainOfThought: string = '';
```

Defined in: [index.ts:40](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L40)

The chain of thought for the agent.

***

### \_systemPrompt

```ts
private _systemPrompt: string = '';
```

Defined in: [index.ts:35](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L35)

The system prompt for the agent.

***

### #agent

```ts
private #agent: BaseLLM<LLMProvider, any>;
```

Defined in: [index.ts:87](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L87)

***

### MAX\_RETRIES

```ts
private MAX_RETRIES: number = 10;
```

Defined in: [index.ts:19](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L19)

The maximum number of retries for an API call.

***

### name

```ts
protected name: string;
```

Defined in: [index.ts:29](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L29)

The name of the agent.

***

### onTool?

```ts
protected optional onTool: OnTool;
```

Defined in: [index.ts:85](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L85)

***

### RETRY\_DELAY

```ts
private RETRY_DELAY: number = 3000;
```

Defined in: [index.ts:24](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L24)

The delay in milliseconds between retries for an API call.

## Accessors

### chainOfThought

#### Get Signature

```ts
get chainOfThought(): string;
```

Defined in: [index.ts:54](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L54)

Gets the chain of thought for the agent.

##### Returns

`string`

The chain of thought.

***

### inputs

#### Get Signature

```ts
get inputs(): MessageArray<MessageInput>;
```

Defined in: [index.ts:62](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L62)

Gets the inputs for the agent.

##### Returns

`MessageArray`\<`MessageInput`\>

The inputs.

***

### model

#### Get Signature

```ts
get model(): any;
```

Defined in: [index.ts:115](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L115)

##### Returns

`any`

***

### options

#### Get Signature

```ts
get options(): any;
```

Defined in: [index.ts:77](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L77)

##### Returns

`any`

***

### systemPrompt

#### Get Signature

```ts
get systemPrompt(): string;
```

Defined in: [index.ts:46](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L46)

Gets the system prompt for the agent.

##### Returns

`string`

The system prompt.

***

### tools

#### Get Signature

```ts
get tools(): any;
```

Defined in: [index.ts:70](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L70)

Gets the tools available to the agent.

##### Returns

`any`

The tools.

***

### type

#### Get Signature

```ts
get type(): LLMProvider;
```

Defined in: [index.ts:81](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L81)

##### Returns

`LLMProvider`

## Methods

### addInputs()

```ts
addInputs(inputs): Promise<void>;
```

Defined in: [index.ts:111](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L111)

Adds inputs to the agent's client.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `inputs` | `MessageArray`\<`MessageInput`\> | The inputs to add. |

#### Returns

`Promise`\<`void`\>

***

### load()

```ts
load(): Promise<void>;
```

Defined in: [index.ts:123](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L123)

Loads the agent's client.

#### Returns

`Promise`\<`void`\>

***

### performTask()

```ts
performTask(prompt, image?): Promise<{
  response: ReadableStreamWithAsyncIterable<Message>;
  usage: {
     input: number;
     output: number;
  };
}>;
```

Defined in: [index.ts:158](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L158)

Perform a task using the LLM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` \| `BlockType`[] | The user prompt. |
| `image?` | `string` | - |

#### Returns

`Promise`\<\{
  `response`: `ReadableStreamWithAsyncIterable`\<`Message`\>;
  `usage`: \{
     `input`: `number`;
     `output`: `number`;
  \};
\}\>

A Promise resolving to the usage and response stream.

***

### retryApiCall()

```ts
retryApiCall<T>(apiCall): Promise<T>;
```

Defined in: [index.ts:135](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L135)

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

Defined in: [index.ts:181](https://github.com/elribonazo/uaito/blob/32b7ed681e19ab2b616ebe6cb537c3852aa82ced/packages/ai/src/index.ts#L181)

Run a command safely, catching and handling any errors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `toolUse` | `ToolUseBlock` | The tool being used. |
| `run` | (`agent`) => `Promise`\<`void`\> | Function to run the command. |

#### Returns

`Promise`\<`void`\>
