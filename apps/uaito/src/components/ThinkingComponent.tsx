import { useState, useEffect, useRef } from 'react';
import { LightBulbIcon } from "@heroicons/react/24/outline";
import type { MessageState } from '../redux/userSlice';

export const ThinkingComponent: React.FC<{
  thinking: string;
  messages?: MessageState[];
  currentMessageId?: string;
}> = ({ thinking, messages = [], currentMessageId }) => {
  const [isThinkingComplete, setIsThinkingComplete] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const [dots, setDots] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === '...' ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Measure content height
  useEffect(() => {
    if (containerRef.current && contentHeight === undefined) {
      setContentHeight(containerRef.current.scrollHeight);
    }
  }, [contentHeight, thinking]); // Update height when thinking changes

  // Fade out logic
  useEffect(() => {
    if (!messages.length || !currentMessageId) return;

    const currentThinkingIndex = messages.findIndex(msg => msg.id === currentMessageId);
    if (currentThinkingIndex === -1) return;

    const hasNonThinkingAfter = messages.slice(currentThinkingIndex + 1).some(msg => 
      msg.type !== 'thinking' && msg.type !== 'redacted_thinking'
    );

    if (hasNonThinkingAfter && !shouldFadeOut) {
      setShouldFadeOut(true);
      
      const timer = setTimeout(() => {
        setIsThinkingComplete(true);
      }, 500); // Reduced animation duration for simplicity
      return () => clearTimeout(timer);
    }
  }, [messages, currentMessageId, shouldFadeOut]);

  if (isThinkingComplete) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full transition-all duration-500 ease-out bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700"
      style={{
        height: shouldFadeOut ? 0 : contentHeight || 'auto',
        opacity: shouldFadeOut ? 0 : 1,
        marginTop: shouldFadeOut ? 0 : '1rem',
        padding: shouldFadeOut ? 0 : '0.75rem 1rem',
        transform: shouldFadeOut ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)',
        overflow: shouldFadeOut ? 'hidden' : 'visible'
      }}
    >
      <div className="flex items-start space-x-3">
        <LightBulbIcon className="w-5 h-5 text-yellow-400 animate-pulse flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
            {thinking || 'Thinking'}{dots}
          </div>
        </div>
      </div>
    </div>
  );
};
