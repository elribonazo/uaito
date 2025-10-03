import { CpuChipIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import { LLMProvider } from "@uaito/sdk";
import { useAppSelector } from "@/redux/store";
import { AnthropicModels } from "@uaito/anthropic";
import { HuggingFaceONNXModels } from "@uaito/huggingface";
import { GrokModels, OpenAIModels } from "@uaito/openai";
import { GoogleModels } from "@uaito/google";

// Type to represent a model option
type ModelOption = {
  value: string;
  label: string;
  provider: LLMProvider;
};

const AgentTypeToModel = {
  [LLMProvider.Anthropic]: AnthropicModels,
  [LLMProvider.OpenAI]: OpenAIModels,
  [LLMProvider.Grok]: GrokModels,
  [LLMProvider.Local]: HuggingFaceONNXModels,
  [LLMProvider.LocalImage]: HuggingFaceONNXModels,
  [LLMProvider.LocalAudio]: HuggingFaceONNXModels,
  [LLMProvider.Google]: GoogleModels,
};

// Get available models for each provider
const getAvailableModels = (provider: LLMProvider): ModelOption[] => {
  const models = AgentTypeToModel[provider];
  return Object.entries(models).map(([key, value]) => ({
    value: value as string,
    label: key,
    provider: provider
  }));
};

// Get default model for each provider
const getDefaultModel = (provider: LLMProvider): string => {
  const models = AgentTypeToModel[provider];
  const firstModelKey = Object.keys(models)[0];
  return models[firstModelKey as keyof typeof models] as string;
};

interface ModelSelectorProps {
  onSelected?: (model: string) => void | Promise<void>;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  
  // Get current provider from Redux state
  const provider = useAppSelector((state) => state.user.provider);
  const downloadProgress = useAppSelector((state) => state.user.downloadProgress);
  
  // Get available models for current provider
  const availableModels = useMemo(() => {
    if (!provider) return [];
    return getAvailableModels(provider);
  }, [provider]);
  
  // Update selected model when provider changes
  useEffect(() => {
    if (provider && availableModels.length > 0) {
      // Try to get saved model from localStorage first
      const savedModel = localStorage.getItem(`uaito-selected-model-${provider}`);
      const isValidSavedModel = savedModel && availableModels.some(model => model.value === savedModel);
      
      const newModel = isValidSavedModel ? savedModel : getDefaultModel(provider);
      setSelectedModel(newModel);
      
      // Call onSelected callback with the new model
      if (onSelected) {
        onSelected(newModel);
      }
    }
  }, [provider, availableModels, onSelected]);
  
  // Handle model selection
  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setIsOpen(false);
    
    // Save to localStorage
    if (provider) {
      localStorage.setItem(`uaito-selected-model-${provider}`, model);
    }
    
    // Call callback
    if (onSelected) {
      onSelected(model);
    }
  };
  
  // Get display label for selected model
  const selectedModelLabel = useMemo(() => {
    const model = availableModels.find(m => m.value === selectedModel);
    return model ? model.label : 'Select Model';
  }, [availableModels, selectedModel]);
  
  // Check if selector should be disabled
  const isDisabled = !provider || availableModels.length <= 1;
  const webGPU = provider === LLMProvider.Local || provider === LLMProvider.LocalImage;
  const isDownloading = webGPU && downloadProgress !== null && downloadProgress < 100;
  
  if (!provider) {
    return null;
  }
  
  return (
    <div className="relative">
      <button
        type="button"
        disabled={isDisabled || isDownloading}
        onClick={() => {
          if (!isDisabled && !isDownloading) {
            setIsOpen(!isOpen);
          }
        }}
        className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 bg-surface hover:bg-surface-hover border border-border rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CpuChipIcon className="h-3.5 w-3.5 text-accent flex-shrink-0" />
        <span className="truncate text-xs text-secondary-text hidden sm:inline max-w-[100px] lg:max-w-[140px]">{selectedModelLabel}</span>
        {!isDisabled && (
          <ChevronDownIcon 
            className={`h-3 w-3 text-tertiary-text transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>
      
      {isOpen && !isDisabled && (
        <div className="absolute mt-1 right-0 w-64 z-20 max-h-72 overflow-y-auto bg-surface border border-border rounded-lg shadow-lg">
          <ul className="py-1">
            {availableModels.map((model) => (
              <li
                key={model.value}
                className={`px-3 py-2 cursor-pointer transition-colors duration-150 ${
                  selectedModel === model.value 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-secondary-text hover:bg-surface-hover hover:text-primary-text'
                }`}
                onClick={() => handleModelSelect(model.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleModelSelect(model.value);
                  }
                }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{model.label}</span>
                  <span className="text-xs text-tertiary-text truncate">
                    {model.value}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
