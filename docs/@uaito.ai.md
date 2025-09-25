[Documentation](README.md) / @uaito/ai

# @uaito/client

This package provides a lightweight API client for interacting with the Uaito platform.

## Installation

```bash
npm install @uaito/client
```

or

```bash
yarn add @uaito/client
```

## Usage

First, you need to instantiate the `UaitoClient` with your API key.

```typescript
import { UaitoClient, LLMProvider } from '@uaito/client';

const client = new UaitoClient({
  apiKey: 'your-uaito-api-key',
  baseUrl: 'https://your-uaito-instance.com' // optional, defaults to https://uaito.io
});
```

Then, you can use the `performTask` method to start a conversation with an agent. The `performTask` method returns an async generator that yields `Message` objects as they are streamed from the server.

```typescript
import { MessageArray } from '@uaito/sdk';

async function main() {
  const prompt = "Hello, who are you?";
  const history = new MessageArray([]); // or provide existing message history

  try {
    const stream = client.performTask(prompt, {
      provider: LLMProvider.Anthropic, // or another provider
      agent: 'orquestrator',
      inputs: history,
    });

    for await (const message of stream) {
      console.log('Received message:', JSON.stringify(message, null, 2));
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
```

## API

### `new UaitoClient(options)`

Creates a new Uaito API client.

- `options` (`UaitoClientOptions`):
  - `apiKey` (`string`, **required**): Your Uaito API key.
  - `baseUrl` (`string`, optional): The base URL of your Uaito instance. Defaults to `http://localhost:3000`.

### `client.performTask(prompt, options)`

Starts a task stream with an agent.

- `prompt` (`string`): The user's prompt.
- `options` (`PerformTaskOptions`):
  - `provider` (`LLMProvider`, **required**): The LLM provider to use.
  - `agent` (`string`, **required**): The agent to interact with.
  - `model` (`string`, optional): The specific model to use.
  - `inputs` (`MessageArray<MessageInput>`, optional): The conversation history.
  - `signal` (`AbortSignal`, optional): An `AbortSignal` to cancel the request.

Returns an `AsyncGenerator<Message>` that yields `Message` objects from `@uaito/sdk`.

## Types

The client uses several types from the `@uaito/sdk` package. Here are the most relevant ones:

### `LLMProvider`

An enum representing the supported Large Language Model providers.

```typescript
export enum LLMProvider {
  OpenAI = 'OpenAI',
  Anthropic = 'Anthropic',
  HuggingFaceONNX = 'HuggingFaceONNX'
}
```

### `Message`

Represents a message in the chat stream. Each message has an `id`, a `type`, a `role`, and `content`.

- `id` (`string`): A unique identifier for the message.
- `type` (`MessageType`): The type of the message, which determines the structure of its content. Can be `message`, `tool_use`, `tool_result`, `delta`, etc.
- `content` (`BlockType[]`): An array of content blocks that make up the message.
- `chunk` (`boolean`, optional): Indicates if this is a streaming chunk of a larger message.
- `role` (`Role`): The role of the message's author, e.g., `user`, `assistant`, `system`.

```typescript
export type Message = {
  id: string,
  type: MessageType,
  content: BlockType[],
  chunk?: boolean,
  role: Role
}
```

### `MessageInput`

Represents a message that can be sent to the API.

```typescript
export type MessageInput = {
  id?: string,
  type?: MessageType,
  role: Role,
  content: MessageContent[]
}
```

### `BlockType`

A message's `content` is an array of `BlockType` objects. Below are the specifications for each block type.

```typescript
export type BlockType = 
  | ErrorBlock 
  | TextBlock 
  | ToolBlock 
  | ImageBlock 
  | DeltaBlock 
  | UsageBlock 
  | ThinkingBlock 
  | RedactedThinkingBlock 
  | ServerToolUseBlock 
  | WebSearchToolResultBlock 
  | SignatureDeltaBlock;
```

#### `TextBlock`
A block of text content.
```typescript
export type TextBlock = {
  text: string;
  type: 'text';
}
```

#### `ImageBlock`
An image, typically represented as a base64-encoded string.
```typescript
export type ImageBlock = {
  source: {
    data: string;
    media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    type: 'base64';
  };
  type: 'image';
}
```

#### `ToolUseBlock`
Represents a request from the model to use a tool.
```typescript
export type ToolUseBlock = {
  id: string;
  input: unknown;
  name: string;
  type: 'tool_use';
}
```

#### `ToolResultBlock`
The result of a tool's execution.
```typescript
export type ToolResultBlock = {
  tool_use_id: string;
  name: string,
  type: 'tool_result';
  content?: MessageContent[];
  isError?: boolean;
}
```

#### `ToolInputDelta`
A streaming chunk of a tool's input.
```typescript
export type ToolInputDelta = {
  id?:string,
  name?:string,
  partial:string,
  type: 'tool_delta';
}
```

#### `DeltaBlock`
Indicates the end of a streaming turn.
```typescript
export type DeltaBlock =   {
  type:'delta',
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;
  stop_sequence: string | null;
}
```

#### `UsageBlock`
Contains token usage information for a request.
```typescript
export type UsageBlock = {
  type: 'usage',
  input?: number,
  output?: number
}
```

#### `ErrorBlock`
An error message.
```typescript
export type ErrorBlock = {
  type:'error',
  message: string
}
```

#### `ThinkingBlock`
Represents the model's internal "thought process" when generating a response.
```typescript
export interface ThinkingBlock {
  signature: string;
  thinking: string;
  type: 'thinking';
}
```

#### `RedactedThinkingBlock`
A "thinking" block with its content redacted.
```typescript
export interface RedactedThinkingBlock {
  data: string;
  type: 'redacted_thinking';
}
```

#### `SignatureDeltaBlock`
A streaming chunk of a "thinking" block's signature.
```typescript
export interface SignatureDeltaBlock {
  signature: string;
  type: 'signature_delta';
}
```

For more detailed information about all the available types, please refer to the `@uaito/sdk` package.

## Classes

| Class | Description |
| ------ | ------ |
| [Agent](@uaito.ai.Class.Agent.md) | base class for AI agents. |
