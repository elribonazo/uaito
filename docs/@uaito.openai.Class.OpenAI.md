<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/openai](@uaito.openai.md) / OpenAI

# Class: OpenAI\<T\>

Defined in: [index.ts:52](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L52)

A more complete implementation of the OpenAI-based LLM,
mirroring the structure and patterns found in the Anthropic class.

## Extends

- `BaseLLM`\<`T`, `llmTypeToOptions`\[`T`\]\>

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `OpenAIProviderType` |

## Constructors

### Constructor

```ts
new OpenAI<T>({, onTool?): OpenAI<T>;
```

Defined in: [index.ts:132](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L132)

Creates an instance of the OpenAI LLM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `{` | \{ `options`: `llmTypeToOptions`\[`T`\]; \} | options } - The options for the LLM. |
| `{.options` | `llmTypeToOptions`\[`T`\] | - |
| `onTool?` | `OnTool` | Optional callback for tool usage. |

#### Returns

`OpenAI`\<`T`\>

#### Overrides

```ts
BaseLLM<T, llmTypeToOptions[T]>.constructor
```

## Properties

### cache

```ts
cache: BaseLLMCache & {
  imageBase64: null | string;
  imageGenerationCallId: null | string;
  textId?: null | string;
  thinkingId?: null | string;
};
```

Defined in: [index.ts:76](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L76)

The cache for the LLM.

#### Type Declaration

##### imageBase64

```ts
imageBase64: null | string;
```

##### imageGenerationCallId

```ts
imageGenerationCallId: null | string;
```

##### textId?

```ts
optional textId: null | string;
```

##### thinkingId?

```ts
optional thinkingId: null | string;
```

#### Overrides

```ts
BaseLLM.cache
```

***

### data

```ts
data: Record<string, unknown>;
```

Defined in: ../../sdk/build/index.d.ts:95

A record of data for the LLM.

#### Inherited from

```ts
BaseLLM.data
```

***

### inputs

```ts
inputs: MessageArray<MessageInput>;
```

Defined in: [index.ts:69](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L69)

An array of message inputs.

#### Overrides

```ts
BaseLLM.inputs
```

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [index.ts:57](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L57)

Optional callback for tool usage.

***

### options

```ts
readonly options: llmTypeToOptions[T];
```

Defined in: ../../sdk/build/index.d.ts:63

#### Inherited from

```ts
BaseLLM.options
```

***

### type

```ts
readonly type: T;
```

Defined in: ../../sdk/build/index.d.ts:62

#### Inherited from

```ts
BaseLLM.type
```

## Accessors

### llmInputs

#### Get Signature

```ts
get llmInputs(): ResponseInputItem[];
```

Defined in: [index.ts:257](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L257)

Gets the inputs for the LLM.

##### Returns

`ResponseInputItem`[]

The LLM inputs.

***

### maxTokens

#### Get Signature

```ts
get maxTokens(): number;
```

Defined in: [index.ts:153](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L153)

Return max tokens or a default (e.g. 4096).

##### Returns

`number`

The maximum number of tokens.

***

### tools

#### Get Signature

```ts
get tools(): undefined | Tool[];
```

Defined in: [index.ts:226](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L226)

Gets the tools available to the LLM.

##### Returns

`undefined` \| `Tool`[]

The available tools.

## Methods

### includeLastPrompt()

```ts
includeLastPrompt(
   prompt, 
   chainOfThought, 
input): MessageArray<MessageInput>;
```

Defined in: ../../sdk/build/index.d.ts:129

Includes the last prompt in the input.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `string` | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `input` | `MessageArray`\<`MessageInput`\> | The input messages. |

#### Returns

`MessageArray`\<`MessageInput`\>

The updated input messages.

#### Inherited from

```ts
BaseLLM.includeLastPrompt
```

***

### log()

```ts
log(message): any;
```

Defined in: ../../sdk/build/index.d.ts:101

Logs a message.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `message` | `string` | The message to log. |

#### Returns

`any`

#### Inherited from

```ts
BaseLLM.log
```

***

### performTaskStream()

```ts
performTaskStream(
   prompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [index.ts:505](https://github.com/elribonazo/uaito/blob/67954ddafa72656ac93232fb4a5af024ea5efed4/packages/openai/src/index.ts#L505)

Performs a task stream using the LLM.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prompt` | `any` | The user prompt. |
| `chainOfThought` | `any` | The chain of thought for the task. |
| `system` | `any` | The system prompt. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

A promise that resolves to a readable stream of messages.

#### Overrides

```ts
BaseLLM.performTaskStream
```

***

### retryApiCall()

```ts
retryApiCall<T>(apiCall): Promise<T>;
```

Defined in: ../../sdk/build/index.d.ts:108

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

#### Inherited from

```ts
BaseLLM.retryApiCall
```

***

### runSafeCommand()

```ts
runSafeCommand(toolUse, run): Promise<void>;
```

Defined in: ../../sdk/build/index.d.ts:115

Run a command safely, catching and handling any errors.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `toolUse` | `ToolUseBlock` | The tool being used. |
| `run` | (`agent`) => `Promise`\<`void`\> | Function to run the command. |

#### Returns

`Promise`\<`void`\>

#### Inherited from

```ts
BaseLLM.runSafeCommand
```

***

### transformAutoMode()

```ts
transformAutoMode<AChunk>(
   input, 
   getNext, 
onTool?): Promise<ReadableStreamWithAsyncIterable<AChunk>>;
```

Defined in: ../../sdk/build/index.d.ts:148

Transforms an input stream using the provided transform function.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` *extends* `Message` | The type of the input chunk. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ReadableStreamWithAsyncIterable`\<`AChunk`\> | The input stream to be transformed. |
| `getNext` | () => `Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\> | A function to get the next stream. |
| `onTool?` | `OnTool` | Optional callback for tool usage. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`AChunk`\>\>

A promise that resolves to the transformed readable stream.

#### Inherited from

```ts
BaseLLM.transformAutoMode
```

***

### transformStream()

```ts
transformStream<AChunk, BChunk>(input, transform): Promise<ReadableStreamWithAsyncIterable<BChunk>>;
```

Defined in: ../../sdk/build/index.d.ts:139

Transforms the given stream from an AI provider into a Uaito Stream
This also keeps track of the received messages

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `AChunk` | The type of the input chunk. |
| `BChunk` *extends* `Message` | The type of the output chunk. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `ReadableStreamWithAsyncIterable`\<`AChunk`\> | The input stream. |
| `transform` | `TransformStreamFn`\<`unknown`, `BChunk`\> | The transform function. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`BChunk`\>\>

A promise that resolves to the transformed stream.

#### Inherited from

```ts
BaseLLM.transformStream
```
