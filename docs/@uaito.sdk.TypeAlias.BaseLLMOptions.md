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

Defined in: [domain/types.ts:768](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L768)

Represents the options for a base LLM.

## Properties

### directory?

```ts
optional directory: string;
```

Defined in: [domain/types.ts:793](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L793)

The directory for the model.

***

### log()?

```ts
optional log: (message) => void;
```

Defined in: [domain/types.ts:803](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L803)

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

Defined in: [domain/types.ts:783](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L783)

The maximum number of tokens to generate.

***

### model

```ts
model: string;
```

Defined in: [domain/types.ts:773](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L773)

The model to use.

***

### onProgress()?

```ts
optional onProgress: (progress) => void;
```

Defined in: [domain/types.ts:798](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L798)

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

Defined in: [domain/types.ts:805](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L805)

***

### signal?

```ts
optional signal: AbortSignal;
```

Defined in: [domain/types.ts:788](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L788)

An optional abort signal.

***

### tools?

```ts
optional tools: Tool[];
```

Defined in: [domain/types.ts:778](https://github.com/elribonazo/uaito/blob/54db862b0b0eb33a01a619f119661a409f4e4263/packages/sdk/src/domain/types.ts#L778)

An array of available tools.
