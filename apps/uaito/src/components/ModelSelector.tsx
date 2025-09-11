import { CpuChipIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import { LLMProvider, AgentTypeToModel } from "@uaito/sdk";
import { useAppSelector } from "@/redux/store";

// Type to represent a model option
type ModelOption = {
  value: string;
  label: string;
  provider: LLMProvider;
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
  const isDownloading = provider === LLMProvider.HuggingFaceONNX && downloadProgress !== null && downloadProgress < 100;
  
  if (!provider) {
    return null;
  }
  
  return (
    <div className="relative mt-3 py-1 w-48">
      <button
        type="button"
        disabled={isDisabled || isDownloading}
        onClick={() => {
          if (!isDisabled && !isDownloading) {
            setIsOpen(!isOpen);
          }
        }}
        className="w-full flex items-center pt-1 pb-2 pr-1 space-x-2 bg-opacity-90 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded transition duration-300 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CpuChipIcon className="ml-2 h-5 w-5 text-green-500" />
        <span className="truncate">{selectedModelLabel}</span>
        {!isDisabled && (
          <ChevronDownIcon 
            className={`flex flex-end h-5 w-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        )}
      </button>
      
      {isOpen && !isDisabled && (
        <div className="absolute mt-2 w-full z-20 max-h-60 overflow-y-auto">
          <ul className="py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
            {availableModels.map((model) => (
              <li
                key={model.value}
                className={`px-4 py-2 cursor-pointer transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedModel === model.value 
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-900 dark:text-white'
                }`}
                onClick={() => handleModelSelect(model.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleModelSelect(model.value);
                  }
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{model.label}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
