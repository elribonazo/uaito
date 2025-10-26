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

Defined in: [domain/types.ts:829](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L829)

Configuration options for a `BaseLLM` instance.

## Properties

### directory?

```ts
optional directory: string;
```

Defined in: [domain/types.ts:854](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L854)

A directory path, often used for file-based operations.

***

### log()?

```ts
optional log: (message) => void;
```

Defined in: [domain/types.ts:864](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L864)

A custom logging function. Defaults to `console.log`.

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

Defined in: [domain/types.ts:844](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L844)

The maximum number of tokens to generate in the response.

***

### model

```ts
model: string;
```

Defined in: [domain/types.ts:834](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L834)

The specific model to use, e.g., 'gpt-4o'.

***

### onProgress()?

```ts
optional onProgress: (progress) => void;
```

Defined in: [domain/types.ts:859](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L859)

A callback function to report progress, e.g., for model downloads.

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

Defined in: [domain/types.ts:866](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L866)

***

### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [domain/types.ts:849](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L849)

An abort signal to cancel the request.

***

### tools?

```ts
optional tools: Tool[];
```

Defined in: [domain/types.ts:839](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L839)

An array of tools that the LLM is allowed to use.
