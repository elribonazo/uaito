# UAITO SDK

<p align="center">
  <img src="UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>

---

## Description

The UAITO SDK is an open-source project designed to simplify the integration of AI solutions into your applications. It provides a standardized interface for interacting with multiple LLM providers, abstracting away the complexities of each specific API. Whether you're working with local models via Hugging Face Transformers or powerful APIs like OpenAI and Anthropic, the UAITO SDK makes it easy to build provider-agnostic AI agents.

## Features

- **Unified Agent Interface**: A single `Agent` class to interact with all supported LLM providers.
- **Multi-Provider Support**: Out-of-the-box support for OpenAI, Anthropic, and Hugging Face ONNX models.
- **Streaming Responses**: Built-in support for handling streaming responses for real-time applications.
- **Tool Integration**: Easily define and use tools with your agents to extend their capabilities.
- **Command-Line Interface**: A handy CLI for quick experiments and running agents from your terminal.
- **TypeScript First**: Written in TypeScript for a great developer experience with static typing.

## Installation

You can install the UAITO SDK using npm or yarn:

```bash
npm install @uaito/sdk
```

or with yarn:

```bash_
yarn add @uaito/sdk
```

## Quick Start

Here's a simple example of how to use the UAITO SDK with OpenAI:

```typescript
import { Agent, LLMProvider } from '@uaito/sdk';
import 'dotenv/config';

async function main() {
  // Initialize the agent with the desired provider and options
  const agent = new Agent(LLMProvider.OpenAI, {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o',
  });

  // Perform a task by sending a prompt
  const { response } = await agent.performTask("Hello, who are you?");

  // Handle the streaming response
  for await (const chunk of response) {
    if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
      process.stdout.write(chunk.content[0].text);
    }
  }
  console.log();
}

main().catch(console.error);
```

## Usage

### Initializing the Agent

First, import the `Agent` class and `LLMProvider` enum. Then, create a new `Agent` instance with the desired provider and its options.

**OpenAI:**

```typescript
import { Agent, LLMProvider } from '@uaito/sdk';

const openAIAgent = new Agent(LLMProvider.OpenAI, {
  apiKey: 'YOUR_OPENAI_API_KEY',
  model: 'gpt-4o',
});
```

**Anthropic:**

```typescript
import { Agent, LLMProvider } from '@uaito/sdk';

const anthropicAgent = new Agent(LLMProvider.Anthropic, {
  apiKey: 'YOUR_ANTHROPIC_API_KEY',
  model: 'claude-3-5-sonnet-20240620',
});
```

**Hugging Face ONNX (for local models):**

```typescript
import { Agent, LLMProvider, HuggingFaceONNXModels } from '@uaito/sdk';

const localAgent = new Agent(LLMProvider.HuggingFaceONNX, {
  model: HuggingFaceONNXModels.Llama32, // Choose a supported model
  // Add other HuggingFaceONNXOptions if needed
});

// You need to load the model before performing tasks
await localAgent.load();
```

### Sending a Message

Use the `performTask` method to send a prompt to the agent. This method returns a response object which includes a `ReadableStreamWithAsyncIterable` of messages.

```typescript
const { response, usage } = await agent.performTask("What's the weather like in New York?");

for await (const chunk of response) {
  // Process each chunk of the response
  console.log(chunk);
}
```

### Using Tools

You can extend the agent's capabilities by providing it with tools.

1.  **Define your tools:**

```typescript
import { Tool } from '@uaito/sdk';

const tools: Tool[] = [
  {
    name: 'getCurrentWeather',
    description: 'Get the current weather for a specific location',
    input_schema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g., San Francisco, CA',
        },
      },
      required: ['location'],
    },
  },
];
```

2.  **Create an `onTool` handler:**

```typescript
import { OnTool, Message } from '@uaito/sdk';

const onTool: OnTool = async function (message: Message) {
  const agent = this; // `this` is bound to the Agent instance
  const toolUse = message.content.find(c => c.type === 'tool_use');

  if (toolUse && toolUse.type === 'tool_use') {
    if (toolUse.name === 'getCurrentWeather') {
      const { location } = toolUse.input as { location: string };
      // Call your weather API here
      const weather = `The weather in ${location} is sunny.`;

      // Push the result back to the agent's inputs
      agent.client.inputs.push({
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: toolUse.id,
          name: toolUse.name,
          content: [{ type: 'text', text: weather }],
        }],
      });
    }
  }
};
```

3.  **Initialize the agent with tools and the handler:**

```typescript
const agent = new Agent(
  LLMProvider.OpenAI,
  {
    apiKey: 'YOUR_OPENAI_API_KEY',
    model: 'gpt-4o',
    tools: tools,
  },
  onTool,
);

// The agent can now use the `getCurrentWeather` tool
await agent.performTask("What's the weather like in Boston?");
```

## Command-Line Interface (CLI)

The SDK includes a powerful and easy-to-use CLI for running agents directly from your terminal. It supports all the same providers and models as the SDK and provides a clean, streaming interface.

For detailed instructions and examples, please see the [SDK's README](./packages/sdk/README.md).

### Quick Example

Once installed, you can quickly run a prompt like this:

```bash
npx @uaito/sdk run "What is the capital of Canada?" --provider OpenAI --model gpt-5-nano
```

## Supported Providers & Models

### OpenAI
- `gpt-5-mini-2025-08-07`

### Anthropic
- `claude-sonnet-4-20250514`

### Hugging Face ONNX
- `onnx-community/Jan-nano-ONNX`
- `onnx-community/Qwen3-0.6B-ONNX`
- `onnx-community/Llama-3.2-1B-Instruct-q4f16`
- `onnx-community/LFM2-1.2B-ONNX`


## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.







