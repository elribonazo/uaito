// example.js
// A simple JavaScript usage example demonstrating how to call Anthropic and OpenAI
// using the UAITO TS SDK (bundled/transpiled for JS usage).

const { LLMProvider, Agent } = require('./build');
require('dotenv').config(); // optional if you want to load API keys from .env

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

class GenericAgent extends Agent {
    constructor(llmProvider) {
        if (llmProvider === LLMProvider.Anthropic) {
            super(
                LLMProvider.Anthropic,
                {
                    apiKey: anthropicApiKey,
                    model: 'claude-3-5-sonnet-20240620',  // or any other Anthropic model
                    inputs: [],
                    tools: []
                },
                undefined,
                []
            );
        } else if (llmProvider === LLMProvider.OpenAI) {
            super(
                LLMProvider.OpenAI,
                {
                    apiKey: openaiApiKey,
                    model: 'gpt-3.5-turbo', // or any other OpenAI model
                    inputs: [],
                    tools: []
                },
                undefined,
                []
            );
        }
    }
}

async function main() {
    // Create an Agent that calls Anthropic
    const anthropicAgent = new GenericAgent(LLMProvider.Anthropic);

    // Perform a non-streamed task with Anthropic
    const anthropicResult = await anthropicAgent.performTask(
        'Hello from Anthropic!',
        'Anthropic System Prompt',
        false // false = non-stream, true = streaming
    );
    console.log('Anthropic response:', anthropicResult.response);

    // Create an Agent that calls OpenAI
    const openAIAgent = new GenericAgent(LLMProvider.OpenAI);

    // Perform a non-streamed task with OpenAI
    const openAIResult = await openAIAgent.performTask(
        'Hello from OpenAI!',
        'OpenAI System Prompt',
        false
    );
    console.log('OpenAI response:', openAIResult.response);
}

main().catch(console.error);