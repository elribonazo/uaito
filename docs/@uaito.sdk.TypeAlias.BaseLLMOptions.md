<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / BaseLLMOptions

# Type Alias: BaseLLMOptions

```ts
type BaseLLMOptions = {
  directory?: string;
  log?: (message) => void;
  maxTokens?: number;
  model: string;
  onProgress?: (progress) => void;
  onTool?: OnTool;
  signal?: AbortSignal;
  tools?: Tool[];
};
```

Defined in: [domain/types.ts:761](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L761)

Represents the options for a base LLM.

## Properties

### directory?

```ts
optional directory: string;
```

Defined in: [domain/types.ts:786](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L786)

The directory for the model.

***

### log()?

```ts
optional log: (message) => void;
```

Defined in: [domain/types.ts:796](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L796)

An optional logging function.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`void`

***

### maxTokens?

```ts
optional maxTokens: number;
```

Defined in: [domain/types.ts:776](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L776)

The maximum number of tokens to generate.

***

### model

```ts
model: string;
```

Defined in: [domain/types.ts:766](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L766)

The model to use.

***

### onProgress()?

```ts
optional onProgress: (progress) => void;
```

Defined in: [domain/types.ts:791](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L791)

An optional progress callback.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `progress` | `number` |

#### Returns

`void`

***

### onTool?

```ts
optional onTool: OnTool;
```

Defined in: [domain/types.ts:798](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L798)

***

### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [domain/types.ts:781](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L781)

An optional abort signal.

***

### tools?

```ts
optional tools: Tool[];
```

Defined in: [domain/types.ts:771](https://github.com/elribonazo/uaito/blob/d8422bf658a9c6f5720beebc17c9bf42cf7a778c/packages/sdk/src/domain/types.ts#L771)

An array of available tools.
