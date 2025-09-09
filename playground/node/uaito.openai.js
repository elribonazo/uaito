const { LLMProvider, MessageArray } = require('@uaito/sdk');
const tools = require('./uaito.tools.js');
const createSystemPrompt = require('./uaito.system.js');
const onTool = require('./uaito.ontool.js');

require('dotenv').config(); // optional if you want to load API keys from .env


const openaiApiKey = process.env.OPENAI_API_KEY;

/** 
 * @type {import('@uaito/sdk').BinConfig<
 * import('@uaito/sdk').LLMProvider.OpenAI
 * >} 
*/
const config = {
    provider: LLMProvider.OpenAI,
    options: {
        apiKey: openaiApiKey,
        inputs: MessageArray.from([]),
        model: 'gpt-4o', // or any other OpenAI model
        tools
    },
    tools,
    createSystemPrompt,
    onTool
}

module.exports = config;