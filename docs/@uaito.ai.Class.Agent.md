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

Defined in: [index.ts:26](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L26)

Represents a higher-level abstraction for an AI agent. It encapsulates a `BaseLLM` instance
and provides a structured way to manage prompts, tools, and conversation history. This class
simplifies the process of performing tasks with an LLM by handling the underlying details of
API calls, retries, and stream processing.

## Example

```typescript
// Assuming `myCustomLLM` is an instance of a class that extends `BaseLLM`
const agent = new Agent(myCustomLLM);
await agent.load();
const { response } = await agent.performTask("Tell me a joke.");
for await (const chunk of response) {
  // Process each message chunk from the stream
}
```

## Constructors

### Constructor

```ts
new Agent(
   agent, 
   onTool?, 
   name?): Agent;
```

Defined in: [index.ts:126](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L126)

Creates a new `Agent` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `agent` | `BaseLLM`\<`LLMProvider`, `unknown`\> | An instance of a class that extends `BaseLLM`. This is the core LLM that the agent will use. |
| `onTool?` | `OnTool` | An optional callback function for handling tool usage. |
| `name?` | `string` | An optional name for the agent. If not provided, it defaults to the LLM provider's name. |

#### Returns

`Agent`

## Properties

### \_chainOfThought

```ts
private _chainOfThought: string = '';
```

Defined in: [index.ts:53](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L53)

The chain of thought or reasoning steps for the agent to follow when performing a task.

***

### \_systemPrompt

```ts
private _systemPrompt: string = '';
```

Defined in: [index.ts:48](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L48)

The system prompt that defines the agent's persona, context, and instructions.

***

### #agent

```ts
private #agent: BaseLLM<LLMProvider, unknown>;
```

Defined in: [index.ts:118](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L118)

***

### MAX\_RETRIES

```ts
private MAX_RETRIES: number = 10;
```

Defined in: [index.ts:32](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L32)

The maximum number of times to retry an API call in case of connection errors.

***

### name

```ts
protected name: string;
```

Defined in: [index.ts:42](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L42)

The name of the agent, used for identification and logging.

***

### onTool?

```ts
protected optional onTool: OnTool;
```

Defined in: [index.ts:116](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L116)

An optional callback function that is triggered when a tool is used.
The `this` context within the callback is bound to the `Agent` instance.

***

### RETRY\_DELAY

```ts
private RETRY_DELAY: number = 3000;
```

Defined in: [index.ts:37](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L37)

The delay in milliseconds between retries for an API call.

## Accessors

### cache

#### Get Signature

```ts
get cache(): BaseLLMCache;
```

Defined in: [index.ts:79](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L79)

##### Returns

`BaseLLMCache`

***

### chainOfThought

#### Get Signature

```ts
get chainOfThought(): string;
```

Defined in: [index.ts:67](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L67)

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

Defined in: [index.ts:75](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L75)

Gets the message history (inputs) for the agent's conversation.

##### Returns

`MessageArray`\<`MessageInput`\>

The inputs.

***

### model

#### Get Signature

```ts
get model(): string;
```

Defined in: [index.ts:149](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L149)

Gets the model name being used by the agent.

##### Returns

`string`

The model name.

***

### options

#### Get Signature

```ts
get options(): unknown;
```

Defined in: [index.ts:98](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L98)

Gets the configuration options of the underlying LLM.

##### Returns

`unknown`

The options.

***

### systemPrompt

#### Get Signature

```ts
get systemPrompt(): string;
```

Defined in: [index.ts:59](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L59)

Gets the system prompt for the agent.

##### Returns

`string`

The system prompt.

***

### tools

#### Get Signature

```ts
get tools(): any[];
```

Defined in: [index.ts:87](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L87)

Gets the list of tools available to the agent.

##### Returns

`any`[]

The tools.

***

### type

#### Get Signature

```ts
get type(): LLMProvider;
```

Defined in: [index.ts:106](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L106)

Gets the provider type of the underlying LLM (e.g., OpenAI, Anthropic).

##### Returns

`LLMProvider`

The provider type.

## Methods

### addInputs()

```ts
addInputs(inputs): Promise<void>;
```

Defined in: [index.ts:141](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L141)

Sets the message history for the agent. This will overwrite any existing history.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `inputs` | `MessageArray`\<`MessageInput`\> | The message history to set. |

#### Returns

`Promise`\<`void`\>

***

### load()

```ts
load(): Promise<void>;
```

Defined in: [index.ts:158](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L158)

Initializes the agent by loading the underlying LLM. This is particularly important
for models that need to be downloaded or initialized, such as local WebGPU models.

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

Defined in: [index.ts:197](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L197)

Executes a task with the given prompt and returns the LLM's response as a stream.
This is the primary method for interacting with the agent.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` \| `BlockType`[] | The user's prompt, which can be a simple string or a rich array of content blocks (e.g., text and images). |
| `image?` | `string` | An optional image to include with the prompt (legacy). It's recommended to use the `BlockType[]` format for prompts with images. |

#### Returns

`Promise`\<\{
  `response`: `ReadableStreamWithAsyncIterable`\<`Message`\>;
  `usage`: \{
     `input`: `number`;
     `output`: `number`;
  \};
\}\>

A promise that resolves to the token usage and a stream of response messages.

***

### retryApiCall()

```ts
retryApiCall<T>(apiCall): Promise<T>;
```

Defined in: [index.ts:172](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L172)

A robust wrapper for API calls that automatically retries on `APIConnectionError`.
It uses exponential backoff to wait between retries. This is inherited from `BaseLLM`.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The expected return type of the API call. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `apiCall` | () => `Promise`\<`T`\> | The function that makes the API call. |

#### Returns

`Promise`\<`T`\>

The result of the successful API call.

#### Throws

Throws an error if the API call fails after all retries or if a non-connection error occurs.

***

### runSafeCommand()

```ts
runSafeCommand(toolUse, run): Promise<void>;
```

Defined in: [index.ts:222](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/ai/src/index.ts#L222)

A safe execution wrapper for tool calls. It catches errors during tool execution,
formats them into a standard error message, and pushes the error back into the input stream
for the LLM to process. This prevents tool failures from crashing the application.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `toolUse` | `ToolUseBlock` | The tool use block that triggered the command. |
| `run` | (`agent`) => `Promise`\<`void`\> | The function that executes the tool's logic. |

#### Returns

`Promise`\<`void`\>
