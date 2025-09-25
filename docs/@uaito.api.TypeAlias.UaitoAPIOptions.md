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

Defined in: [types.ts:5](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/api/src/types.ts#L5)

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `agent?` | `string` | [types.ts:10](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/api/src/types.ts#L10) |
| `apiKey` | `string` | [types.ts:6](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/api/src/types.ts#L6) |
| `baseUrl?` | `string` | [types.ts:7](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/api/src/types.ts#L7) |
| `inputs?` | `MessageArray`\<`MessageInput`\> | [types.ts:8](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/api/src/types.ts#L8) |
| `model?` | `string` | [types.ts:12](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/api/src/types.ts#L12) |
| `provider` | `LLMProvider.Anthropic` \| `LLMProvider.OpenAI` | [types.ts:9](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/api/src/types.ts#L9) |
| `signal?` | `AbortSignal` | [types.ts:11](https://github.com/elribonazo/uaito/blob/63be92eff75b0d6fe00fb8f304e5bed8a21e4135/packages/api/src/types.ts#L11) |
