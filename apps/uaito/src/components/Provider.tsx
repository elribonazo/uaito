import { SparklesIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { LLMProvider, ProgressBlock } from "@uaito/sdk";
import { useMemo, useState } from "react";
import { useAppSelector } from "@/redux/store";

export const Provider: React.FC<{ 
  value: LLMProvider,
  onSelected: (value: LLMProvider) => void,
  enabledProviders: LLMProvider[]
}> = ({ value, onSelected, enabledProviders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeChatId, chats } = useAppSelector((state) => state.user);
	const activeChat = activeChatId ? chats[activeChatId] : null;

  const enabled = useMemo(() => enabledProviders.length > 1, [enabledProviders]);

  const webGPU = value === LLMProvider.Local || value === LLMProvider.LocalImage;
	const progressMessage = activeChat?.messages.find(
		(m) => m.type === 'progress' && (m.content[0] as ProgressBlock)?.progress < 100
	);
	const isDownloading = !!progressMessage;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={!enabled || isDownloading}
        onClick={() => {
          if (enabled && !isDownloading) {
            setIsOpen(!isOpen);
          }
        }}
        className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 bg-surface hover:bg-surface-hover border border-border rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SparklesIcon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        <span className="text-xs text-secondary-text truncate hidden sm:inline">{value}</span>
        {enabled && (
          <ChevronDownIcon
            className={`h-3 w-3 text-tertiary-text transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {isOpen && (
        <div className="absolute mt-1 right-0 min-w-[160px] z-20 bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="py-1">
            {enabledProviders.map((providerName) => {
              return (
                <button
                  key={providerName}
                  type="button"
                  className="w-full text-left px-3 py-2 text-xs text-secondary-text hover:bg-surface-hover hover:text-primary-text cursor-pointer transition-colors duration-150"
                  onClick={() => {
                    onSelected(providerName as LLMProvider);
                    setIsOpen(false);
                  }}
                >
                  {providerName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Provider;


