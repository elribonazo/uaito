<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
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

Defined in: [types.ts:11](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/api/src/types.ts#L11)

Defines the configuration options for the `UaitoAPI` client.
It extends `BaseLLMOptions` with properties specific to the Uaito API,
such as the API key, provider, agent, and model to use.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `agent?` | `string` | The specific agent to use for the request. Defaults to 'orquestrator'. | [types.ts:36](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/api/src/types.ts#L36) |
| `apiKey` | `string` | The API key for authenticating with the Uaito API. | [types.ts:16](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/api/src/types.ts#L16) |
| `baseUrl?` | `string` | An optional base URL for the Uaito API. Defaults to 'https://uaito.io'. | [types.ts:21](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/api/src/types.ts#L21) |
| `inputs?` | `MessageArray`\<`MessageInput`\> | An optional array of initial messages to provide context to the conversation. | [types.ts:26](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/api/src/types.ts#L26) |
| `model?` | `string` | The specific model to use for the request, e.g., 'gpt-4o'. | [types.ts:46](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/api/src/types.ts#L46) |
| `provider` | `LLMProvider.Anthropic` \| `LLMProvider.OpenAI` | The underlying LLM provider to use for the request (e.g., OpenAI or Anthropic). | [types.ts:31](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/api/src/types.ts#L31) |
| `signal?` | `AbortSignal` | An optional `AbortSignal` to cancel the API request. | [types.ts:41](https://github.com/elribonazo/uaito/blob/0b5444ee2162b2b42be96496727b854bf26ca527/packages/api/src/types.ts#L41) |
