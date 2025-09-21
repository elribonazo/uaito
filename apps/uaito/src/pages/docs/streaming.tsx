import { DocsLayout } from '@/components/DocsLayout';
import dynamic from 'next/dynamic';

const Code = dynamic(() => import('@/components/Code').then((e) => e.Code), { ssr: false });

function StreamingPage() {
  return (
    <DocsLayout>
      <h1>Streaming</h1>
      <p>The SDK returns a stream of messages from the \`performTask\` method. This allows you to process the response as it's being generated.</p>

      <Code language="typescript">{`
import { Agent, LLMProvider } from '@uaito/sdk';

const agent = new Agent(LLMProvider.Anthropic, {
  model: AnthropicModels['claude-4-sonnet'],
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const { response } = await agent.performTask("Tell me a short story.");

for await (const chunk of response) {
  switch (chunk.type) {
    case 'message':
      if (chunk.content[0].type === 'text') {
        process.stdout.write(chunk.content[0].text);
      }
      break;
    case 'thinking':
      // Handle thinking state if needed
      break;
    case 'tool_use':
      // Handle tool calls
      break;
    // ... other chunk types
  }
}
      `}</Code>
    </DocsLayout>
  );
}

export default StreamingPage;
