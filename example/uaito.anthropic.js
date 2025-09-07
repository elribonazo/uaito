const { LLMProvider, MessageArray } = require('@uaito/sdk');

const tools = require('./uaito.tools.js');
const createSystemPrompt = require('./uaito.system.js');
const onTool = require('./uaito.ontool.js');

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
        inputs: MessageArray.from([]),
        tools
    },
    tools,
    createSystemPrompt,
    onTool
}

module.exports = config;