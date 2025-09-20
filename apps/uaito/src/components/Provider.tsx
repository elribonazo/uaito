import { SparklesIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import  { LLMProvider } from "@uaito/sdk";
import { useMemo, useState } from "react";
import { useAppSelector } from "@/redux/store";

const enabledProviders = [
    LLMProvider.Anthropic,
    LLMProvider.OpenAI,
    LLMProvider.Local
]

export const Provider: React.FC<{ 
  value: LLMProvider,
  onSelected: (value: LLMProvider) => void 
}> = ({ value, onSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const downloadProgress = useAppSelector((state) => state.user.downloadProgress);

  const enabled = useMemo(() => enabledProviders.length > 1, []);

  const webGPU = value === LLMProvider.Local || value === LLMProvider.LocalImage;
  const isDownloading = webGPU && downloadProgress !== null && downloadProgress < 100;

  return (
    <div className="relative mt-3 py-1 w-48">
      <button
        disabled={!enabled || isDownloading}
        onClick={() => {
          if (enabled && !isDownloading) {
            setIsOpen(!isOpen);
          }
        }}
        className="w-full flex items-center pt-1 pb-2 pr-1 space-x-2 bg-opacity-90 bg-gray-700 text-white font-bold rounded transition duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <SparklesIcon className="ml-2 h-5 w-5 text-purple-500" />
        <span>{value}</span>
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
                  className="px-4 py-2 bg-opacity-90 bg-gray-700 text-white font-bold  transition duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => {
                    onSelected(providerName as LLMProvider);
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


