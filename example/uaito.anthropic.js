const { LLMProvider } = require('@uaito/sdk');
const tools = require('./uaito.tools.js');

require('dotenv').config(); // optional if you want to load API keys from .env

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

/** 
 * @type {import('@uaito/sdk').BinConfig<
 * import('@uaito/sdk').LLMProvider.Anthropic
 * >} 
*/
const config = {
    provider: LLMProvider.Anthropic,
    options: {
        apiKey: anthropicApiKey,
        model: 'claude-3-5-sonnet-20240620',  // or any other Anthropic model
        inputs: [],
        tools
    }
}

module.exports = config;