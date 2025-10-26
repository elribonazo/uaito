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

Defined in: [types.ts:20](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/api/src/types.ts#L20)

Defines the configuration options for the `UaitoAPI` client.
It extends `BaseLLMOptions` with properties specific to the Uaito API,
such as the API key, provider, agent, and model to use.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `agent?` | `string` | The specific agent to use for the request. Defaults to 'orquestrator'. | [types.ts:45](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/api/src/types.ts#L45) |
| `apiKey` | `string` | The API key for authenticating with the Uaito API. | [types.ts:25](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/api/src/types.ts#L25) |
| `baseUrl?` | `string` | An optional base URL for the Uaito API. Defaults to 'https://uaito.io'. | [types.ts:30](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/api/src/types.ts#L30) |
| `inputs?` | `MessageArray`\<`MessageInput`\> | An optional array of initial messages to provide context to the conversation. | [types.ts:35](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/api/src/types.ts#L35) |
| `model?` | `string` | The specific model to use for the request, e.g., 'gpt-4o'. | [types.ts:55](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/api/src/types.ts#L55) |
| `provider` | `LLMProvider.Anthropic` \| `LLMProvider.OpenAI` | The underlying LLM provider to use for the request (e.g., OpenAI or Anthropic). | [types.ts:40](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/api/src/types.ts#L40) |
| `signal?` | `AbortSignal` | An optional `AbortSignal` to cancel the API request. | [types.ts:50](https://github.com/elribonazo/uaito/blob/cfdf025250d7b4eddd23a524d8b4cfadce122069/packages/api/src/types.ts#L50) |
