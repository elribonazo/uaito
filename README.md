# UAITO TS SDK

<p align="center">
  <img src="UAITO.png" />
</p>


## Description
This open-source project led by UAITO aimts to make it easier for developers to integrate with new AI solutions by abstracting all the complexity, generalising the data structures making it extremely easy to build agent agnostic solutions, using local LLM's or API's as a service.

## Installation

```bash
npm install @uaito/sdk
```

or with yarn

```bash
yarn add @uaito/sdk
```

## Running UAITO SDK
In order to run UAITO you will need to create the following files:
1. uaito.tools.js
2. uaito.ontool.js
3. uaito.ollama.js or uaito.openai.js or uaito.anthropic.js
4. uaito.thought.js

Once you have configuration you can run the following code:

```bash
npx @uaito/sdk run --agent openai  "Get the curent date"
```

### Defining tools uaito.tools.js

```js
/** 
 * @type {import('@uaito/sdk').Tool[]}
*/
const tools =[
    {
        name: "getCurrentDate",
        description: "Returns the current date",
        input_schema: {
            type: "object",
            properties: {
            },
            required: []
        }
    }
]
module.exports = tools;
```

### Defining the onTool function uaito.ontool.js
This is the function that will be running your customized tools, call your own code and functions here, the following code is just a reference.

```js
/** 
 * @type {import('@uaito/sdk').OnTool} 
*/
async function onTool(
    message,
) {
    try {
        const agent = this;
        const toolUse = message.content.find(m => m.type === 'tool_use');
        if (toolUse) {
            await this.runSafeCommand(
                message,
                agent.inputs,
                async () => {
                    agent.inputs.push({
                        role:'user',
                        content:[{
                            type: 'tool_result',
                            name: toolUse.name,
                            tool_use_id: toolUse.id,
                            content: [
                                {
                                    "type": "text",
                                    "text": new Date().toISOString()
                                }
                            ],
                        }]
                    })
                })
            
        }
    } catch (error) {
        console.error(error)
       
    }
}

module.exports = onTool;
```


### Defining the chainOfThought uaito.thought.js
Include the chainOfThough function, this function will be used to generate the chain of thought for the agent based on the tools you used

```js

const createSystemPrompt = (
    /** 
     * @type {import('@uaito/sdk').Tool[]}
    */
    tools
) => {
    const hasFS = false;
    let capabilities = hasFS ?
 
    [
       'Creating and managing project structures',
       'Writing, debugging, and improving code across multiple languages',
       'Providing architectural insights and applying design patterns',
       'Staying current with the latest technologies and best practices',
       'Analyzing and manipulating files within the project directory',
       'Performing web searches for up-to-date information',
       'Executing code and analyzing its output within an isolated \'code_execution_env\' virtual environment'
    ]
 
    :
 
    [
       'Writing, debugging, and improving code across multiple languages',
       'Providing architectural insights and applying design patterns',
       'Staying current with the latest technologies and best practices',
       'Performing web searches for up-to-date information',
    ]
 
    const usageGuidelines = hasFS ? [
       'Always use the most appropriate enabled tool for the task at hand.',
       //This 2 should be moved probably to the editor directly
       'Provide detailed and clear instructions when using tools, especially for edit_and_apply',
       'After making changes, always review the output to ensure accuracy and alignment with intentions.',
       'Use execute_code to run and test code within the \'code_execution_env\' virtual environment, then analyze the results.',
       'Proactively use tavilySearch when you need up-to-date information or additional context.'
    ] : [
       'When tool is activated, use most appropiate tool BUT dont disabled tools.',
       'Proactively use tavilySearch when you need up-to-date information or additional context.'
    ]
    return `You are Orquestrator, an AI assistant specialized in software development with access to a variety of tools and the ability to instruct and direct a coding agent and a code execution one. Your capabilities include:
 
 ${capabilities.map((capability, i) => `${i+1}. ${capability}`).join("\r\n")}
 
 Available tools and their optimal use cases:
 ${tools.map((tool, i) => `${i+1}. ${tool.name}: ${tool.chainOfThought}`).join("\r\n")}
 
 Tool Usage Guidelines:
 ${usageGuidelines.map((usage) => `- ${usage}`).join("\r\n")}
 
 Error Handling and Recovery:
 - If a tool operation fails, carefully analyze the error message and attempt to resolve the issue.${hasFS ? '\r\n- For file-related errors, double-check file paths and permissions before retrying.':''}\r\n- If a search fails, try rephrasing the query or breaking it into smaller, more specific searches.${hasFS ? '\r\n- If code execution fails, analyze the error output and suggest potential fixes, considering the isolated nature of the environment.': ''}
 
 ${hasFS ? `Project Creation and Management:
 1. Start by creating a root folder for new projects.
 2. Create necessary subdirectories and files within the root folder.
 3. Organize the project structure logically, following best practices for the specific project type.`:''}
 
 Always strive for accuracy, clarity, and efficiency in your responses and actions. Your instructions must be precise and comprehensive. 
 If uncertain, use the tavilySearch tool or admit your limitations. 
 When executing code, always remember that it runs in the isolated 'code_execution_env' virtual environment. 
 Be aware of any long-running processes you start and manage them appropriately, including stopping them when they are no longer needed.
 
 When using tools:
 1. Carefully consider if a tool is necessary before using it.
 2. Ensure all required parameters are provided and valid.
 3. Handle both successful results and errors gracefully.
 4. Provide clear explanations of tool usage and results to the user.
 
 Remember, you are an AI assistant, and your primary goal is to help the user accomplish their tasks effectively and efficiently while maintaining the integrity and security of their development environment.
 
 You are currently in automode. Follow these guidelines:
 
 1. Goal Setting:
    - Set clear, achievable goals based on the user's request.
    - Break down complex tasks into smaller, manageable goals.
 
 2. Goal Execution:
    - Work through goals systematically, using appropriate tools for each task.
    - Utilize file operations, code writing, and web searches as needed.
    - Always read a file before editing and review changes after editing.
 
 3. Progress Tracking:
    - Provide regular updates on goal completion and overall progress, except if the task just completed.
 
 4. Tool Usage:
    - Leverage all available tools to accomplish your goals efficiently.
    ${hasFS ?'- Prefer edit_and_apply for file modifications, applying changes in chunks for large edits.\r\n' : ''}- Use tavilySearch proactively for up-to-date information.
 
 5. Error Handling:
    - If a tool operation fails, analyze the error and attempt to resolve the issue.
    - For persistent errors, consider alternative approaches to achieve the goal.
 
 6. Automode Completion:
    - When all goals are completed, you will not re-iterate.
    - Do not ask for additional tasks or modifications once goals are achieved.
    
 7. Iteration Awareness:
    - Use this information to prioritize tasks and manage time effectively.
 
 
 Remember: Focus on completing the established goals efficiently and effectively. Avoid unnecessary conversations or requests for additional tasks.`
 }
 
module.exports = createSystemPrompt;
```

### Define your agent configuration uaito.ollama.js or uaito.openai.js or uaito.anthropic.js

For OPENAI: 
```js
const { LLMProvider } = require('@uaito/sdk');
const tools = require('./uaito.tools.js');
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
        inputs: [],
        model: 'gpt-4o', // or any other OpenAI model
        tools
    }
}

module.exports = config;
```

For ANTHROPIC:
```js 
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
```


For OLLAMA:
```js
const { LLMProvider } = require('@uaito/sdk');
const tools = require('./uaito.tools.js');
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
    }
}

module.exports = config;
```







