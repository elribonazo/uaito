import { useState, useEffect, useRef } from 'react';
import { LightBulbIcon } from "@heroicons/react/24/outline";
import type { MessageState } from '../redux/userSlice';

export const ThinkingComponent: React.FC<{
  thinking: string;
  messages?: MessageState[];
  currentMessageId?: string;
}> = ({ thinking, messages = [], currentMessageId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isThinkingComplete, setIsThinkingComplete] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure content height on mount
  useEffect(() => {
    if (containerRef.current && contentHeight === undefined) {
      setContentHeight(containerRef.current.scrollHeight);
    }
  }, [contentHeight]);

  useEffect(() => {
    if (!messages.length || !currentMessageId) return;

    // Find the current thinking message
    const currentThinkingIndex = messages.findIndex(msg => msg.id === currentMessageId);
    if (currentThinkingIndex === -1) return;

    // Check if there are any non-thinking messages after this thinking message
    const hasNonThinkingAfter = messages.slice(currentThinkingIndex + 1).some(msg => 
      msg.type !== 'thinking' && msg.type !== 'redacted_thinking'
    );

    if (hasNonThinkingAfter && !shouldFadeOut) {
      // Start fade out animation
      setShouldFadeOut(true);
      
      // Complete removal after animation
      const timer = setTimeout(() => {
        setIsThinkingComplete(true);
      }, 800); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [messages, currentMessageId, shouldFadeOut]);

  // Don't render if thinking is complete
  if (isThinkingComplete) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full transition-all duration-700 ease-out overflow-hidden"
      style={{
        height: shouldFadeOut ? 0 : contentHeight || 'auto',
        opacity: shouldFadeOut ? 0 : 1,
        marginTop: shouldFadeOut ? 0 : '1rem',
        paddingTop: shouldFadeOut ? 0 : '0.5rem',
        paddingBottom: shouldFadeOut ? 0 : '0.5rem',
        transform: shouldFadeOut ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)'
      }}
    >
      <button 
        className="flex items-center justify-start space-x-2 bg-transparent border-none outline-none focus:outline-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        type="button"
      >
        <LightBulbIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Thinking...</span>
      </button>
      
      {isHovered && thinking && (
        <div className="absolute bottom-full left-0 mb-2 w-max max-w-md p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10 break-words whitespace-pre-wrap">
          <p className="font-semibold mb-1">Assistant's thought process:</p>
          {thinking}
        </div>
      )}
    </div>
  );
};
