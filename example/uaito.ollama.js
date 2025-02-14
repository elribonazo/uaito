const { LLMProvider } = require('@uaito/sdk');

const tools = require('./uaito.tools.js');
const createSystemPrompt = require('./uaito.system.js');
const onTool = require('./uaito.ontool.js');

require('dotenv').config(); // optional if you want to load API keys from .env

/** 
 * @type {import('@uaito/sdk').BinConfig<
 * import('@uaito/sdk').LLMProvider.Ollama
 * >} 
*/
const config = {
    provider: LLMProvider.Ollama,
    options: {
        host: 'http://localhost:11434',
        model: 'llama3.1',
        inputs: [],
        tools
    },
    tools,
    createSystemPrompt,
    onTool
}

module.exports = config;