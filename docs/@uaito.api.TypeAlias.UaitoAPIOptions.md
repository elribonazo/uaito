[Documentation](README.md) / [@uaito/api](@uaito.api.md) / UaitoAPIOptions

# Type Alias: UaitoAPIOptions

```ts
type UaitoAPIOptions = {
  agent?: string;
  apiKey: string;
  baseUrl?: string;
  inputs?: MessageArray<MessageInput>;
  model?: string;
  provider: LLMProvider.Anthropic | LLMProvider.OpenAI;
  signal?: AbortSignal;
} & BaseLLMOptions;
```

Defined in: [types.ts:5](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/api/src/types.ts#L5)

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `agent?` | `string` | [types.ts:10](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/api/src/types.ts#L10) |
| `apiKey` | `string` | [types.ts:6](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/api/src/types.ts#L6) |
| `baseUrl?` | `string` | [types.ts:7](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/api/src/types.ts#L7) |
| `inputs?` | `MessageArray`\<`MessageInput`\> | [types.ts:8](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/api/src/types.ts#L8) |
| `model?` | `string` | [types.ts:12](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/api/src/types.ts#L12) |
| `provider` | `LLMProvider.Anthropic` \| `LLMProvider.OpenAI` | [types.ts:9](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/api/src/types.ts#L9) |
| `signal?` | `AbortSignal` | [types.ts:11](https://github.com/elribonazo/uaito/blob/6221ee7c386b2b81ffabf3afeba7096c8ae881a2/packages/api/src/types.ts#L11) |
