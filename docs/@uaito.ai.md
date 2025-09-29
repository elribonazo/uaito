<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / @uaito/ai

# @uaito/ai

This package provides a powerful `Agent` class that can be used to orchestrate tasks with various Large Language Models. It also includes a command-line interface (CLI) for interacting with the agent directly from your terminal.

## Installation

```bash
npm install @uaito/ai
```

or

```bash
yarn add @uaito/ai
```

## Library Usage

The main export of this package is the `Agent` class. You can use it to wrap any LLM provider that conforms to the `@uaito/sdk`'s `BaseLLM` interface.

```typescript
import { Agent } from '@uaito/ai';
import { OpenAI } from '@uaito/openai';
import { MessageArray } from '@uaito/sdk';

async function main() {
  const llm = new OpenAI({
    options: {
        // ... your OpenAI options
    }
  });
  
  const agent = new Agent(llm);
  
  const history = new MessageArray([]); // or provide existing message history
  await agent.addInputs(history);
  
  const { response } = await agent.performTask("Hello, who are you?");
  
  for await (const chunk of response) {
    if (chunk.type === 'message') {
        for (const content of chunk.content) {
            if (content.type === 'text') {
                process.stdout.write(content.text);
            }
        }
    }
  }
}

main();
```

## CLI Usage

This package also provides the `uaito-cli` command, which allows you to run the agent from your command line.

### Command

```
uaito-cli run <message> [options]
```

Runs the application with a given configuration.

### Arguments

-   `message`: (Required) The message to send to the agent.

### Options

-   `--provider`, `-p`: (Required) The LLM provider to use.
    -   Choices: `OpenAI`, `Anthropic`, `Grok`, `Local`, `API`
-   `--model`, `-m`: (Required) The model to use. The available models depend on the selected provider. See provider-specific details below.
-   `--apiKey`: The API key for the provider. If not provided, the CLI will look for an environment variable.

### Provider-specific Details and Examples

#### OpenAI

-   **Provider value**: `OpenAI`
-   **Models**: `gpt-5-nano`, `gpt-5-mini`.
-   **API Key**: Use the `--apiKey` option or set the `OPENAI_API_KEY` environment variable.

**Example:**
```bash
npx uaito-cli run "Translate 'Hello, world!' to French." -p OpenAI -m gpt-5-nano
```

#### Anthropic

-   **Provider value**: `Anthropic`
-   **Models**: Any model string supported by the Anthropic API. E.g., `claude-4-sonnet` (which corresponds to `"claude-sonnet-4-2025-05-14"`).
-   **API Key**: Use the `--apiKey` option or set the `ANTHROPIC_API_KEY` environment variable.

**Example:**
```bash
npx uaito-cli run "What is the capital of France?" -p Anthropic -m claude-4-sonnet
```

#### Grok

-   **Provider value**: `Grok`
-   **Models**: `grok-4`.
-   **API Key**: Use the `--apiKey` option or set the `GROK_API_KEY` environment variable.

**Example:**
```bash
npx uaito-cli run "Explain quantum computing in simple terms." -p Grok -m grok-4
```

#### Local

-   **Provider value**: `Local`
-   **Models**: Only `onnx-community/Lucy-ONNX` is currently supported.
-   **API Key**: Not required.

**Example:**
```bash
npx uaito-cli run "Write a short poem about coding." -p Local -m onnx-community/Lucy-ONNX
```

#### API

-   **Provider value**: `API`
-   **Description**: This provider uses the UAITO API endpoint. It currently uses the Anthropic provider under the hood.
-   **Models**: Any model string supported by the backend.
-   **API Key**: Use the `--apiKey` option or set the `GROK_API_KEY` environment variable.

**Example:**
```bash
npx uaito-cli run "Summarize the provided text." -p API -m some-anthropic-model
```

UAITO AI

## Classes

| Class | Description |
| ------ | ------ |
| [Agent](@uaito.ai.Class.Agent.md) | base class for AI agents. |
