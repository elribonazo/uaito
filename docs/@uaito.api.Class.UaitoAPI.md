<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/api](@uaito.api.md) / UaitoAPI

# Class: UaitoAPI

Defined in: [index.ts:15](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/api/src/index.ts#L15)

## Extends

- `BaseLLM`\<`LLMProvider.API`, [`UaitoAPIOptions`](@uaito.api.TypeAlias.UaitoAPIOptions.md)\>

## Constructors

### Constructor

```ts
new UaitoAPI(__namedParameters, onTool?): UaitoAPI;
```

Defined in: [index.ts:29](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/api/src/index.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `options`: [`UaitoAPIOptions`](@uaito.api.TypeAlias.UaitoAPIOptions.md); \} |
| `__namedParameters.options` | [`UaitoAPIOptions`](@uaito.api.TypeAlias.UaitoAPIOptions.md) |
| `onTool?` | `OnTool` |

#### Returns

`UaitoAPI`

#### Overrides

```ts
BaseLLM<LLMProvider.API, UaitoAPIOptions>.constructor
```

## Properties

### baseUrl

```ts
baseUrl: string;
```

Defined in: [index.ts:26](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/api/src/index.ts#L26)

***

### cache

```ts
abstract cache: BaseLLMCache;
```

Defined in: [index.ts:17](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/api/src/index.ts#L17)

The cache for the LLM.

#### Overrides

```ts
BaseLLM.cache
```

***

### data

```ts
data: Record<string, unknown>;
```

Defined in: ../../sdk/build/index.d.ts:89

A record of data for the LLM.

#### Inherited from

```ts
BaseLLM.data
```

***

### inputs

```ts
abstract inputs: MessageArray<MessageInput>;
```

Defined in: [index.ts:25](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/api/src/index.ts#L25)

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

Defined in: [index.ts:27](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/api/src/index.ts#L27)

***

### options

```ts
readonly options: UaitoAPIOptions;
```

Defined in: ../../sdk/build/index.d.ts:57

#### Inherited from

```ts
BaseLLM.options
```

***

### type

```ts
readonly type: API;
```

Defined in: ../../sdk/build/index.d.ts:56

#### Inherited from

```ts
BaseLLM.type
```

## Methods

### includeLastPrompt()

```ts
includeLastPrompt(
   prompt, 
   chainOfThought, 
input): MessageArray<MessageInput>;
```

Defined in: ../../sdk/build/index.d.ts:123

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

Defined in: ../../sdk/build/index.d.ts:95

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
abstract performTaskStream(
   userPrompt, 
   chainOfThought, 
system): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [index.ts:105](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/api/src/index.ts#L105)

Performs a task stream.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userPrompt` | `string` | The user prompt. |
| `chainOfThought` | `string` | The chain of thought for the task. |
| `system` | `string` | The system prompt. |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

A promise that resolves to a readable stream of messages.

#### Overrides

```ts
BaseLLM.performTaskStream
```

***

### request()

```ts
request(prompt): Promise<ReadableStreamWithAsyncIterable<Message>>;
```

Defined in: [index.ts:36](https://github.com/elribonazo/uaito/blob/f0334f5f0daa310e5728d8d40126c1de139e02a9/packages/api/src/index.ts#L36)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prompt` | `string` |

#### Returns

`Promise`\<`ReadableStreamWithAsyncIterable`\<`Message`\>\>

***

### retryApiCall()

```ts
retryApiCall<T>(apiCall): Promise<T>;
```

Defined in: ../../sdk/build/index.d.ts:102

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

Defined in: ../../sdk/build/index.d.ts:109

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

Defined in: ../../sdk/build/index.d.ts:142

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

Defined in: ../../sdk/build/index.d.ts:133

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
