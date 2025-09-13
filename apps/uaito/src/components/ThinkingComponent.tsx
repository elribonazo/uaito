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
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Hover handlers to show/hide expanded state
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  // Measure and update content height whenever thinking text changes
  useEffect(() => {
    if (containerRef.current && !shouldFadeOut && isExpanded) {
      // Measure the full container height including padding
      const measureHeight = () => {
        if (containerRef.current) {
          // Force a reflow to get accurate measurements
          containerRef.current.style.height = 'auto';
          const newHeight = containerRef.current.scrollHeight;
          setContentHeight(newHeight);
        }
      };

      // Use ResizeObserver for more accurate height tracking
      const resizeObserver = new ResizeObserver(() => {
        measureHeight();
      });

      // Observe the content area for text changes
      if (contentRef.current) {
        resizeObserver.observe(contentRef.current);
      }

      // Initial measurement
      measureHeight();

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [thinking, shouldFadeOut, isExpanded]); // Update height when thinking changes or expanded state changes

  // Fade out logic
  useEffect(() => {
    if (!messages.length || !currentMessageId) return;

    const currentThinkingIndex = messages.findIndex(msg => msg.id === currentMessageId);
    if (currentThinkingIndex === -1) return;

    const hasNonThinkingAfter = messages.slice(currentThinkingIndex + 1).some(msg => 
      msg.type !== 'thinking' && msg.type !== 'redacted_thinking'
    );

    if (hasNonThinkingAfter && !shouldFadeOut) {
      // Add a delay before starting the fade-out process
      const delayTimer = setTimeout(() => {
        setShouldFadeOut(true);
        
        // Then after fade-out animation, completely remove the component
        const fadeTimer = setTimeout(() => {
          setIsThinkingComplete(true);
        }, 500); // Duration of fade-out animation
        
        return () => clearTimeout(fadeTimer);
      }, 1500); // 1.5 second delay before starting fade-out
      
      return () => clearTimeout(delayTimer);
    }
  }, [messages, currentMessageId, shouldFadeOut]);

  if (isThinkingComplete) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-300 ease-out bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 ${
        isExpanded ? 'w-full text-left' : 'inline-flex items-center w-auto'
      }`}
      style={{
        height: shouldFadeOut ? 0 : (isExpanded && contentHeight ? `${contentHeight}px` : 'auto'),
        opacity: shouldFadeOut ? 0 : 1,
        marginTop: shouldFadeOut ? 0 : '1rem',
        padding: shouldFadeOut ? 0 : (isExpanded ? '1.25rem 1rem' : '0.75rem'), // Smaller padding when collapsed
        transform: shouldFadeOut ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)',
        overflow: shouldFadeOut ? 'hidden' : 'visible',
        width: isExpanded ? '100%' : 'auto'
      }}
      role="tooltip"
      aria-label="Thinking details"
    >
      {isExpanded ? (
        <div 
          ref={contentRef}
          className="flex items-start space-x-3 min-h-0"
        >
          <LightBulbIcon className="w-5 h-5 text-yellow-400 animate-pulse flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
              {thinking || 'Thinking'}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-400 animate-pulse flex-shrink-0" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Thinking
          </span>
        </div>
      )}
    </div>
  );
};
