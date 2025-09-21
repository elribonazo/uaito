import { DocsLayout } from '@/components/DocsLayout';
import dynamic from 'next/dynamic';

const Code = dynamic(() => import('@/components/Code').then((e) => e.Code), { ssr: false });

function ToolsPage() {
  return (
    <DocsLayout>
      <h1>Tools</h1>
      <p>You can extend the capabilities of the agent by providing it with tools.</p>

      <h2>Defining a Tool</h2>
      <p>A tool is an object with a name, description, and an input schema.</p>
      <Code language="typescript">{`
import { Tool } from '@uaito/sdk';

const getWeatherTool: Tool = {
  name: 'get_weather',
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
};
      `}</Code>

      <h2>Using Tools with an Agent</h2>
      <p>Pass the tools to the agent in the options. You also need to provide an \`onTool\` callback to handle tool calls.</p>
      <Code language="typescript">{`
import { Agent, LLMProvider, Message } from '@uaito/sdk';

const agent = new Agent(LLMProvider.Anthropic, {
  model: AnthropicModels['claude-4-sonnet'],
  apiKey: process.env.ANTHROPIC_API_KEY,
  tools: [getWeatherTool],
}, async function(this: Agent<LLMProvider.Anthropic>, message: Message) {
  if (message.type === 'tool_use' && message.content[0].type === 'tool_use') {
    const toolCall = message.content[0];
    if (toolCall.name === 'get_weather') {
      const location = (toolCall.input as any).location;
      // Your logic to get weather
      const weather = \`The weather in \${location} is sunny.\`;

      this.client.inputs.push({
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: toolCall.id,
          content: [{ type: 'text', text: weather }],
        }],
      });
    }
  }
});

await agent.performTask("What's the weather in London?");
      `}</Code>
    </DocsLayout>
  );
}

export default ToolsPage;
