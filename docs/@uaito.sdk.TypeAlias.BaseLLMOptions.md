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

Defined in: [domain/types.ts:782](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L782)

Configuration options for a `BaseLLM` instance.

## Properties

### directory?

```ts
optional directory: string;
```

Defined in: [domain/types.ts:807](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L807)

A directory path, often used for file-based operations.

***

### log()?

```ts
optional log: (message) => void;
```

Defined in: [domain/types.ts:817](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L817)

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

Defined in: [domain/types.ts:797](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L797)

The maximum number of tokens to generate in the response.

***

### model

```ts
model: string;
```

Defined in: [domain/types.ts:787](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L787)

The specific model to use, e.g., 'gpt-4o'.

***

### onProgress()?

```ts
optional onProgress: (progress) => void;
```

Defined in: [domain/types.ts:812](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L812)

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

Defined in: [domain/types.ts:819](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L819)

***

### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [domain/types.ts:802](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L802)

An abort signal to cancel the request.

***

### tools?

```ts
optional tools: Tool[];
```

Defined in: [domain/types.ts:792](https://github.com/elribonazo/uaito/blob/6736807a773945f2caff6007dc512a530687f9da/packages/sdk/src/domain/types.ts#L792)

An array of tools that the LLM is allowed to use.
