import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import type { ToolInputDelta, ToolResultBlock, ToolUseBlock } from '@uaito/sdk';
import type { MessageState } from '../redux/userSlice';


const statusStyles = {
  started: 'text-yellow-700 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900',
  completed: 'text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-900',
  error: 'text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-900'
};

const statusIcon = {
  started: <ClockIcon className="w-3 h-3 text-yellow-600 dark:text-yellow-400 animate-spin" />,
  completed: <CheckCircleIcon className="w-3 h-3 text-green-600 dark:text-green-400" />,
  error: <ExclamationCircleIcon className="w-3 h-3 text-red-600 dark:text-red-400" />
};

const ToolUseComponent: FC<ToolUseBlock>  = (props) => {
   const name = props.name;
   const status = 'started';
   return <div className="w-full mt-4 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs">
      <div className="flex items-center justify-between">
        <span className="font-medium truncate text-gray-800 dark:text-gray-200" title={`Running task ${name}`}>
          Running task {name} - {props.id}
        </span>
        <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded ${statusStyles[status] || statusStyles.error}`}>
          {statusIcon[status] || statusIcon.error}
          <span className="capitalize">{status}</span>
        </div>
      </div>
  </div>
}

interface ToolOutputComponentProps extends ToolResultBlock {
  name: string,
  messageId: string,
  messages?: MessageState[];
  currentMessageId?: string;
}

const ToolOutputComponent: FC<ToolOutputComponentProps> = (props) => {
  const { messages = [], currentMessageId } = props;
  const name = props.name;
  const [showRaw, setShowRaw] = useState(false);
  const status = props.isError === true ? 'error' : 'completed';
  const [isComplete, setIsComplete] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messages.length || !currentMessageId) return;

    const currentIndex = messages.findIndex(msg => msg.id === currentMessageId);
    if (currentIndex === -1) return;

    // Check if there is a non-tool/thinking message after this one.
    const hasNonToolAfter = messages.slice(currentIndex + 1).some(msg =>
      msg.type !== 'thinking' && msg.type !== 'redacted_thinking' && msg.type !== 'tool_use' && msg.type !== 'tool_result'
    );

    if (hasNonToolAfter && !shouldFadeOut) {
      const delayTimer = setTimeout(() => {
        setShouldFadeOut(true);
        const fadeTimer = setTimeout(() => {
          setIsComplete(true);
        }, 500);
        return () => clearTimeout(fadeTimer);
      }, 1500);
      return () => clearTimeout(delayTimer);
    }
  }, [messages, currentMessageId, shouldFadeOut]);

  if (isComplete) {
    return null;
  }

  // Analyze content structure
  return <div
    ref={containerRef}
    onMouseEnter={() => setIsExpanded(true)}
    onMouseLeave={() => setIsExpanded(false)}
    role="tooltip"
    className={`w-full p-2 mt-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs transition-all duration-300 ease-out ${isExpanded ? 'w-full' : 'inline-block'}`}
    style={{
      opacity: shouldFadeOut ? 0 : 1,
      marginTop: shouldFadeOut ? 0 : '1rem',
      transform: shouldFadeOut ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)',
    }}
  >
     <div className="flex items-center justify-between">
       <span className="font-medium truncate text-gray-800 dark:text-gray-200" title={name}>
         {name} - {props.tool_use_id}
       </span>
       <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded ${statusStyles[status] || statusStyles.error}`}>
         {statusIcon[status] || statusIcon.error}
         <span className="capitalize">{status}</span>
       </div>
     </div>


     {(isExpanded || showRaw) && (
      <>
        <button
          type="button"
          className="mt-1 w-full px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
          onClick={() => setShowRaw(!showRaw)}
        >
          {showRaw ? <ChevronUpIcon className="w-3 h-3 mr-1" /> : <ChevronDownIcon className="w-3 h-3 mr-1" />}
          {showRaw ? 'Hide' : 'Show'} Raw
        </button>
        {showRaw && (
          <pre className="mt-1 p-1 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-800 dark:text-gray-200 overflow-x-auto max-h-60 border border-gray-300 dark:border-gray-600">
            {typeof props.content === "string" && props.content}
            {props.content && typeof props.content !== "string" && props.content.map((content, i) => {
              if (content.type === "text") {
                return <span key={`msg-${props.messageId}-content-${i}`}>
                  {content.text}
                </span>
              }
              if (content.type === "image") {
                const raw = content.source;
                return <img
                  key={`msg-${props.messageId}-contentimg-${i}`}
                  src={`data:${raw.media_type};base64,${raw.data}`}
                  alt="Tool output"
                  style={{ width: "100%" }}
                />
              }
              return null
            })}
          </pre>
        )}
      </>
     )}
 </div>
}

export type ToolComponentProps = (ToolInputDelta | ToolUseBlock | ToolResultBlock) & {
  messageId: string;
  messages?: MessageState[];
  currentMessageId?: string;
  name?: string;
};

export const ToolComponent: FC<ToolComponentProps>  = (props) => {
  if (props.type === "tool_use") {
    return <ToolUseComponent {...props} />
  }
  if (props.type === "tool_result" && props.name) {
    return <ToolOutputComponent {...props} name={props.name} />
  }
  return null;
};
