import { SparklesIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { LLMProvider } from "@uaito/sdk";
import { useEffect, useMemo, useState } from "react";

const enabledProviders = [
    LLMProvider.Anthropic,
    LLMProvider.OpenAI,
    LLMProvider.HuggingFaceONNX
]
const defaultProvider = enabledProviders[0];

export const Provider: React.FC<{ onSelected?: (value: LLMProvider) => void | Promise<void> }> = ({ onSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<LLMProvider>(defaultProvider as LLMProvider);

  const enabled = useMemo(() => enabledProviders.length > 1, []);

  useEffect(() => {
    if (onSelected) {
      onSelected(selectedValue);
    }
  }, [onSelected, selectedValue]);

  return (
    <div className="relative mt-3 py-1 w-48">
      <button
        disabled={!enabled}
        onClick={() => {
          if (enabled) {
            setIsOpen(!isOpen);
          }
        }}
        className="w-full flex items-center pt-1 pb-2 pr-1 space-x-2 bg-opacity-90 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded transition duration-300 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <SparklesIcon className="ml-2 h-5 w-5 text-purple-500" />
        <span>{selectedValue}</span>
        {enabled && (
          <ChevronDownIcon
            className={`flex flex-end h-5 w-5 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
          />
        )}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full  z-10">
          <ul className="py-1">
            {enabledProviders.map((providerName, i) => {
              return (
                <li
                  key={`provider-${i}`}
                  className="px-4 py-2 bg-opacity-90 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-bold  transition duration-300 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => {
                    setSelectedValue(providerName as LLMProvider);
                    setIsOpen(false);
                  }}
                >
                  {providerName}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Provider;


