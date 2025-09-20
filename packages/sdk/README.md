# UAITO SDK

The UAITO SDK provides a powerful command-line interface (CLI) to interact with a variety of large language models (LLMs) from different providers. Whether you're working with cutting-edge models from OpenAI and Anthropic or running local models with ONNX, this SDK simplifies the process and provides a clean, streamlined experience.

## CLI Usage

The CLI is designed to be straightforward and easy to use, with a focus on providing a clean, readable output. By default, it operates in a streaming mode, allowing you to see the response as it's generated, and it suppresses all internal logging to keep the output tidy.

### Run Command

The primary command is `run`, which allows you to send a message to the specified model and receive a response.

```bash
uaito-sdk run <message> [options]
```

### Arguments

-   `<message>`: (Required) The message you want to send to the agent, enclosed in quotes.

### Options

-   `--provider`, `-p`: (Required) The LLM provider to use.
    -   `choices`: `OpenAI`, `Anthropic`, `Local`
-   `--model`, `-m`: (Required) The specific model to use from the chosen provider.
    -   **OpenAI Models**: `gpt-5-nano`, `gpt-5-mini`
    -   **Anthropic Models**: `claude-4-sonnet`
    -   **Local Models**: `JANO`, `LUCY`, `QWEN3`
-   `--apiKey`: The API key for the selected provider. This is only required for `OpenAI` and `Anthropic`. Alternatively, you can set the `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` environment variables.

### Examples

#### Using a Remote Model (OpenAI)

To get a response from OpenAI's `gpt-5-nano` model, you would run:

```bash
uaito-sdk run "What is the capital of France?" --provider OpenAI --model gpt-5-nano --apiKey YOUR_OPENAI_API_KEY
```

#### Using a Local Model

If you have a local ONNX model, you can run it without needing an API key:

```bash
uaito-sdk run "Translate 'hello' to Spanish" --provider Local --model JANO
```

The CLI will stream the response directly to your console, providing a clean and readable output.
