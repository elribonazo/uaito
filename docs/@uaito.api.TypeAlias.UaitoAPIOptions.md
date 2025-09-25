<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

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

Defined in: [types.ts:5](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/api/src/types.ts#L5)

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `agent?` | `string` | [types.ts:10](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/api/src/types.ts#L10) |
| `apiKey` | `string` | [types.ts:6](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/api/src/types.ts#L6) |
| `baseUrl?` | `string` | [types.ts:7](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/api/src/types.ts#L7) |
| `inputs?` | `MessageArray`\<`MessageInput`\> | [types.ts:8](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/api/src/types.ts#L8) |
| `model?` | `string` | [types.ts:12](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/api/src/types.ts#L12) |
| `provider` | `LLMProvider.Anthropic` \| `LLMProvider.OpenAI` | [types.ts:9](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/api/src/types.ts#L9) |
| `signal?` | `AbortSignal` | [types.ts:11](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/api/src/types.ts#L11) |
