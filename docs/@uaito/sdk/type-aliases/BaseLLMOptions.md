[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / BaseLLMOptions

# Type Alias: BaseLLMOptions

> **BaseLLMOptions** = `object`

Defined in: [domain/types.ts:761](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L761)

Represents the options for a base LLM.

## Properties

### directory?

> `optional` **directory**: `string`

Defined in: [domain/types.ts:786](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L786)

The directory for the model.

***

### log()?

> `optional` **log**: (`message`) => `void`

Defined in: [domain/types.ts:796](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L796)

An optional logging function.

#### Parameters

##### message

`string`

#### Returns

`void`

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [domain/types.ts:776](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L776)

The maximum number of tokens to generate.

***

### model

> **model**: `string`

Defined in: [domain/types.ts:766](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L766)

The model to use.

***

### onProgress()?

> `optional` **onProgress**: (`progress`) => `void`

Defined in: [domain/types.ts:791](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L791)

An optional progress callback.

#### Parameters

##### progress

`number`

#### Returns

`void`

***

### onTool?

> `optional` **onTool**: [`OnTool`](OnTool.md)

Defined in: [domain/types.ts:798](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L798)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [domain/types.ts:781](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L781)

An optional abort signal.

***

### tools?

> `optional` **tools**: [`Tool`](Tool.md)[]

Defined in: [domain/types.ts:771](https://github.com/elribonazo/uaito/blob/6936f8ff79845312a8065c6fe5b6c9a6c7758a46/packages/sdk/src/domain/types.ts#L771)

An array of available tools.
