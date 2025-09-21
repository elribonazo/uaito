import { DocsLayout } from '@/components/DocsLayout';
import dynamic from 'next/dynamic';

const Code = dynamic(() => import('@/components/Code').then((e) => e.Code), { ssr: false });

function GettingStarted() {
  return (
    <DocsLayout>
      <h1>Getting Started</h1>
      <p>Welcome to the UAITO SDK documentation. This guide will walk you through the installation and basic setup of the SDK.</p>
      
      <h2>Installation</h2>
      <p>You can install the SDK using npm or yarn:</p>
      <Code language="bash">{`npm install @uaito/sdk`}</Code>
      <Code language="bash">{`yarn add @uaito/sdk`}</Code>

      <h2>Basic Usage</h2>
      <p>Here's a simple example of how to use the SDK with an Anthropic model:</p>
      <Code language="typescript">{`
import { Agent, LLMProvider, AnthropicModels } from '@uaito/sdk';

async function main() {
  const agent = new Agent(LLMProvider.Anthropic, {
    model: AnthropicModels['claude-4-sonnet'],
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const { response } = await agent.performTask("Hello, world!");

  for await (const chunk of response) {
    if (chunk.type === 'message' && chunk.content[0].type === 'text') {
      process.stdout.write(chunk.content[0].text);
    }
  }
}

main();
      `}</Code>
    </DocsLayout>
  );
}

export default GettingStarted;
