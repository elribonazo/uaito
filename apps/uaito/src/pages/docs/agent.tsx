import { DocsLayout } from '@/components/DocsLayout';
import { Code } from '@/components/Code';

function AgentPage() {
  return (
    <DocsLayout>
      <h1>The `Agent` Class</h1>
      <p>The `Agent` class is the main entry point for interacting with the UAITO SDK.</p>

      <h2>Initialization</h2>
      <p>To create an agent, you need to specify a provider and provide the necessary options.</p>
      <Code language="typescript">{`
import { Agent, LLMProvider, AnthropicModels } from '@uaito/sdk';

const agent = new Agent(LLMProvider.Anthropic, {
  model: AnthropicModels['claude-4-sonnet'],
  apiKey: 'YOUR_ANTHROPIC_API_KEY',
});
      `}</Code>

      <h2>Performing a Task</h2>
      <p>The primary method of the agent is \`performTask\`. It takes a prompt as input and returns a response from the LLM.</p>
      <Code language="typescript">{`
const { response } = await agent.performTask("Translate 'Hello, world!' to French.");

for await (const chunk of response) {
  // process stream...
}
      `}</Code>
      
      <h2>Adding Inputs</h2>
      <p>You can provide conversation history to the agent using \`addInputs\`.</p>
      <Code language="typescript">{`
import { MessageArray } from '@uaito/sdk';

const history = MessageArray.from([
    { role: 'user', content: [{ type: 'text', text: 'Hello!' }] },
    { role: 'assistant', content: [{ type: 'text', text: 'Hi! How can I help you today?' }] },
]);

await agent.addInputs(history);

const { response } = await agent.performTask("What was my first message?");
      `}</Code>
    </DocsLayout>
  );
}

export default AgentPage;
