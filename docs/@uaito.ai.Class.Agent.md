[Documentation](README.md) / [@uaito/ai](@uaito.ai.md) / Agent

# Class: Agent

Defined in: [index.ts:9](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L9)

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

Defined in: [index.ts:90](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L90)

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

### name

```ts
protected name: string;
```

Defined in: [index.ts:25](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L25)

The name of the agent.

***

### onTool?

```ts
protected optional onTool: OnTool;
```

Defined in: [index.ts:92](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L92)

Optional callback for tool usage.

## Accessors

### chainOfThought

#### Get Signature

```ts
get chainOfThought(): string;
```

Defined in: [index.ts:50](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L50)

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

Defined in: [index.ts:58](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L58)

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

Defined in: [index.ts:108](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L108)

##### Returns

`any`

***

### options

#### Get Signature

```ts
get options(): any;
```

Defined in: [index.ts:73](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L73)

##### Returns

`any`

***

### systemPrompt

#### Get Signature

```ts
get systemPrompt(): string;
```

Defined in: [index.ts:42](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L42)

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

Defined in: [index.ts:66](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L66)

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

Defined in: [index.ts:77](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L77)

##### Returns

`LLMProvider`

## Methods

### addInputs()

```ts
addInputs(inputs): Promise<void>;
```

Defined in: [index.ts:104](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L104)

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

Defined in: [index.ts:116](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L116)

Loads the agent's client.

#### Returns

`Promise`\<`void`\>

***

### performTask()

```ts
performTask(prompt): Promise<{
  response: ReadableStreamWithAsyncIterable<Message>;
  usage: {
     input: number;
     output: number;
  };
}>;
```

Defined in: [index.ts:151](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L151)

Perform a task using the LLM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` | The user prompt. |

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

Defined in: [index.ts:128](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L128)

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

Defined in: [index.ts:169](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/ai/src/index.ts#L169)

Run a command safely, catching and handling any errors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `toolUse` | `ToolUseBlock` | The tool being used. |
| `run` | (`agent`) => `Promise`\<`void`\> | Function to run the command. |

#### Returns

`Promise`\<`void`\>
