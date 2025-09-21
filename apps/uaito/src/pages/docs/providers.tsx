import { DocsLayout } from '@/components/DocsLayout';
import dynamic from 'next/dynamic';

const Code = dynamic(() => import('@/components/Code').then((e) => e.Code), { ssr: false });

function ProvidersPage() {
  return (
    <DocsLayout>
      <h1>LLM Providers</h1>
      <p>The UAITO SDK supports multiple LLM providers. You can switch between them by specifying the provider in the `Agent` constructor.</p>

      <h2>Anthropic</h2>
      <Code language="typescript">{`
import { Agent, LLMProvider, AnthropicModels } from '@uaito/sdk';

const agent = new Agent(LLMProvider.Anthropic, {
  model: AnthropicModels['claude-4-sonnet'],
  apiKey: process.env.ANTHROPIC_API_KEY,
});
      `}</Code>

      <h2>OpenAI</h2>
      <Code language="typescript">{`
import { Agent, LLMProvider, OpenAIModels } from '@uaito/sdk';

const agent = new Agent(LLMProvider.OpenAI, {
  model: OpenAIModels['gpt-5-nano'],
  apiKey: process.env.OPENAI_API_KEY,
});
      `}</Code>

      <h2>Local (Hugging Face ONNX)</h2>
      <p>You can also run models locally using the Hugging Face ONNX runtime. This is useful for development and offline use cases.</p>
      <Code language="typescript">{`
import { Agent, LLMProvider, HuggingFaceONNXModels } from '@uaito/sdk';

const agent = new Agent(LLMProvider.Local, {
  model: HuggingFaceONNXModels.QWEN3,
  device: 'auto',
  dtype: 'q4f16',
});

await agent.load(); // Don't forget to load the model
      `}</Code>
    </DocsLayout>
  );
}

export default ProvidersPage;
