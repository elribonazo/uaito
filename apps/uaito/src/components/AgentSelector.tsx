import { SparklesIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
const enabledAgents = [
    'Orquestrator',
]
const defaultAgent = enabledAgents[0]

export const AgentSelector: React.FC<{onSelected?: (value: string) => void | Promise<void>}> = ({onSelected}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultAgent);
    useEffect(() => {
      if(onSelected) {
        onSelected(selectedValue)
      }
    }, [onSelected, selectedValue])
    
    const enabled = enabledAgents.length > 1;
    return (
      <div className="relative mt-3 py-1 w-40">
        <button
          disabled={!enabled}
          onClick={() => {
            if (enabled) {
              setIsOpen(!isOpen)
            }
          }}
          className="w-full flex items-center pt-1 pb-2 pr-1 space-x-2 bg-surface text-primary-text font-bold rounded transition duration-300 hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary border border-border"
        >
          <SparklesIcon className="ml-2 h-5 w-5 text-primary" />
          <span>{selectedValue}</span>
          {
            enabled && <ChevronDownIcon className={`flex flex-end h-5 w-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
          }
        </button>
        {isOpen && (
          <div className="absolute mt-2 w-full z-10 bg-surface border border-border rounded-lg shadow-lg">
            <ul className="py-1">
                {
                    enabledAgents.map((agentName, i) => {
                        return <li
                        key={`agent-${i}`}
                        className="px-4 py-2 bg-surface text-primary-text font-bold transition duration-300 hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                        onClick={() => {
                          setSelectedValue(agentName);
                          setIsOpen(false);
                        }}
                      >
                        {agentName}
                      </li>
                    })
                }
            </ul>
          </div>
        )}
      </div>
    );
  };