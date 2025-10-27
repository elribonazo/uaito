import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import type { ToolInputDelta, ToolResultBlock, ToolUseBlock } from '@uaito/sdk';
import type { MessageState } from '../redux/userSlice';


const statusStyles = {
  started: 'text-warning bg-warning/10 dark:text-warning dark:bg-warning/20',
  completed: 'text-success bg-success/10 dark:text-success dark:bg-success/20',
  error: 'text-error bg-error/10 dark:text-error dark:bg-error/20'
};

const statusIcon = {
  started: <ClockIcon className="w-3 h-3 text-warning animate-spin" />,
  completed: <CheckCircleIcon className="w-3 h-3 text-success" />,
  error: <ExclamationCircleIcon className="w-3 h-3 text-error" />
};

interface ToolUseComponentProps extends ToolUseBlock {
  messages?: MessageState[];
  currentMessageId?: string;
  isStreaming?: boolean;
}

const ToolUseComponent: FC<ToolUseComponentProps>  = (props) => {
   const { messages = [], currentMessageId, name, isStreaming = false } = props;
   const status = 'started';
   const [isComplete, setIsComplete] = useState(false);
   const [shouldFadeOut, setShouldFadeOut] = useState(false);

   useEffect(() => {
     if (!messages.length || !currentMessageId) return;

     const currentIndex = messages.findIndex(msg => msg.id === currentMessageId);
     if (currentIndex === -1) return;

     // Check if there is a non-tool/thinking message after this one.
     const hasNonToolAfter = messages.slice(currentIndex + 1).some(msg =>
       msg.type !== 'thinking' && msg.type !== 'redacted_thinking' && msg.type !== 'tool_use' && msg.type !== 'progress'
     );

     // If not streaming and there are non-tool messages after, hide immediately
     if (!isStreaming && hasNonToolAfter) {
       setIsComplete(true);
       return;
     }

     // Only animate fade-out when streaming
     if (isStreaming && hasNonToolAfter && !shouldFadeOut) {
       const delayTimer = setTimeout(() => {
         setShouldFadeOut(true);
         const fadeTimer = setTimeout(() => {
           setIsComplete(true);
         }, 500);
         return () => clearTimeout(fadeTimer);
       }, 10);
       return () => clearTimeout(delayTimer);
     }
   }, [messages, currentMessageId, shouldFadeOut, isStreaming]);

   if (isComplete) {
     return null;
   }

   return <div 
     className={`w-full mt-4 p-2 bg-surface border border-border rounded-md shadow-sm text-xs ${isStreaming ? 'transition-all duration-300 ease-out' : ''}`}
     style={{
       opacity: shouldFadeOut ? 0 : 1,
       marginTop: shouldFadeOut ? 0 : '1rem',
       transform: isStreaming && shouldFadeOut ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)',
       height: shouldFadeOut ? 0 : 'auto',
       padding: shouldFadeOut ? 0 : undefined,
       overflow: shouldFadeOut ? 'hidden' : 'visible',
     }}
   >
      <div className="flex items-center justify-between">
        <span className="font-medium truncate text-primary-text" title={`Running task ${name}`}>
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
  isStreaming?: boolean;
}

const ToolOutputComponent: FC<ToolOutputComponentProps> = (props) => {
  const { messages = [], currentMessageId, isStreaming = false } = props;
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
      msg.type !== 'thinking' && msg.type !== 'redacted_thinking' && msg.type !== 'tool_use' && msg.type !== 'tool_result' && msg.type !== 'progress'
    );

    // If not streaming and there are non-tool messages after, hide immediately
    if (!isStreaming && hasNonToolAfter) {
      setIsComplete(true);
      return;
    }

    // Only animate fade-out when streaming
    if (isStreaming && hasNonToolAfter && !shouldFadeOut) {
      const delayTimer = setTimeout(() => {
        setShouldFadeOut(true);
        const fadeTimer = setTimeout(() => {
          setIsComplete(true);
        }, 500);
        return () => clearTimeout(fadeTimer);
      }, 1500);
      return () => clearTimeout(delayTimer);
    }
  }, [messages, currentMessageId, shouldFadeOut, isStreaming]);

  if (isComplete) {
    return null;
  }

  // Analyze content structure
  return <div
    ref={containerRef}
    onMouseEnter={() => setIsExpanded(true)}
    onMouseLeave={() => setIsExpanded(false)}
    role="tooltip"
    className={`w-full p-2 mt-4 bg-surface border border-border rounded-md shadow-sm text-xs ${isStreaming ? 'transition-all duration-300 ease-out' : ''} ${isExpanded ? 'w-full' : 'inline-block'}`}
    style={{
      opacity: shouldFadeOut ? 0 : 1,
      marginTop: shouldFadeOut ? 0 : '1rem',
      transform: isStreaming && shouldFadeOut ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)',
    }}
  >
     <div className="flex items-center justify-between">
       <span className="font-medium truncate text-primary-text" title={name}>
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
          className="mt-1 w-full px-2 py-1 text-xs font-medium text-secondary-text bg-surface-hover rounded hover:bg-muted transition-colors duration-200 flex items-center justify-center"
          onClick={() => setShowRaw(!showRaw)}
        >
          {showRaw ? <ChevronUpIcon className="w-3 h-3 mr-1" /> : <ChevronDownIcon className="w-3 h-3 mr-1" />}
          {showRaw ? 'Hide' : 'Show'} Raw
        </button>
        {showRaw && (
          <pre className="mt-1 p-1 bg-muted rounded text-[10px] text-primary-text overflow-x-auto max-h-60 border border-border">
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
  isStreaming?: boolean;
};

export const ToolComponent: FC<ToolComponentProps>  = (props) => {
  if (props.type === "tool_use") {
    return <ToolUseComponent {...props} messages={props.messages} currentMessageId={props.currentMessageId} isStreaming={props.isStreaming} />
  }
  if (props.type === "tool_result" && props.name) {
    return <ToolOutputComponent {...props} name={props.name} isStreaming={props.isStreaming} />
  }
  return null;
};
