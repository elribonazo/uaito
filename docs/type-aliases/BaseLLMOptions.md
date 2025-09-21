[**@uaito/sdk**](../README.md)

***

[@uaito/sdk](../README.md) / BaseLLMOptions

# Type Alias: BaseLLMOptions

> **BaseLLMOptions** = `object`

Defined in: [domain/types.ts:756](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L756)

Represents the options for a base LLM.

## Properties

### directory?

> `optional` **directory**: `string`

Defined in: [domain/types.ts:781](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L781)

The directory for the model.

***

### log()?

> `optional` **log**: (`message`) => `void`

Defined in: [domain/types.ts:791](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L791)

An optional logging function.

#### Parameters

##### message

`string`

#### Returns

`void`

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [domain/types.ts:771](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L771)

The maximum number of tokens to generate.

***

### model

> **model**: `string`

Defined in: [domain/types.ts:761](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L761)

The model to use.

***

### onProgress()?

> `optional` **onProgress**: (`progress`) => `void`

Defined in: [domain/types.ts:786](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L786)

An optional progress callback.

#### Parameters

##### progress

`number`

#### Returns

`void`

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [domain/types.ts:776](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L776)

An optional abort signal.

***

### tools?

> `optional` **tools**: [`Tool`](Tool.md)[]

Defined in: [domain/types.ts:766](https://github.com/elribonazo/uaito/blob/a99e7bcbdb0358b1999f9ce76755884ba2c23b7e/packages/sdk/src/domain/types.ts#L766)

An array of available tools.
