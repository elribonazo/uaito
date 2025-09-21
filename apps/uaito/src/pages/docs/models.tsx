import { DocsLayout } from '@/components/DocsLayout';
import { AnthropicModels, OpenAIModels, HuggingFaceONNXModels, LLMProvider } from '@uaito/sdk';

const ModelCard = ({ provider, models }) => (
  <div className="mb-8 p-4 border border-gray-700 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">{provider}</h2>
    {
        provider === LLMProvider.Anthropic || provider === LLMProvider.OpenAI ? <p>These models require an API key.</p> : null
    }
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(models).map(([name, id]) => (
        <div key={id as string} className="p-4 bg-gray-800 rounded-lg shadow-md">
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-sm text-gray-400 font-mono">{id as string}</p>
        </div>
      ))}
    </div>
  </div>
);

function ModelsPage() {
  return (
    <DocsLayout>
      <h1 className="text-4xl font-bold mb-6">Available Models</h1>
      <p className="text-lg mb-8">The SDK supports a variety of models from different providers, detailed below.</p>
      
      <ModelCard provider="Anthropic" models={AnthropicModels} />
      <ModelCard provider="OpenAI" models={OpenAIModels} />
      <ModelCard provider="Local (Hugging Face ONNX)" models={HuggingFaceONNXModels} />
    </DocsLayout>
  );
}

export default ModelsPage;
