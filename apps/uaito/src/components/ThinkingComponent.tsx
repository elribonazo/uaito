import { useState, useEffect, useRef } from 'react';
import { LightBulbIcon } from "@heroicons/react/24/outline";
import type { MessageState } from '../redux/userSlice';

export const ThinkingComponent: React.FC<{
  thinking: string;
  messages?: MessageState[];
  currentMessageId?: string;
  isStreaming?: boolean;
}> = ({ thinking, messages = [], currentMessageId, isStreaming = false }) => {
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
  }, [shouldFadeOut, isExpanded]); // Update height when expanded state changes

  // Fade out logic - only when streaming
  useEffect(() => {
    if (!messages.length || !currentMessageId) return;

    const currentThinkingIndex = messages.findIndex(msg => msg.id === currentMessageId);
    if (currentThinkingIndex === -1) return;

    const hasNonThinkingAfter = messages.slice(currentThinkingIndex + 1).some(msg => 
      msg.type !== 'thinking' && msg.type !== 'redacted_thinking'
    );

    // If not streaming and there are non-thinking messages after, hide immediately
    if (!isStreaming && hasNonThinkingAfter) {
      setIsThinkingComplete(true);
      return;
    }

    // Only animate fade-out when streaming
    if (isStreaming && hasNonThinkingAfter && !shouldFadeOut) {
      // Add a delay before starting the fade-out process
      const delayTimer = setTimeout(() => {
        setShouldFadeOut(true);
        
        // Then after fade-out animation, completely remove the component
        const fadeTimer = setTimeout(() => {
          setIsThinkingComplete(true);
        }, 500); // Duration of fade-out animation
        
        return () => clearTimeout(fadeTimer);
      }, 10); // Small delay before starting fade-out
      
      return () => clearTimeout(delayTimer);
    }
  }, [messages, currentMessageId, shouldFadeOut, isStreaming]);

  if (isThinkingComplete) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${isStreaming ? 'transition-all duration-300 ease-out' : ''} bg-surface/50 rounded-lg border border-border cursor-pointer hover:bg-surface-hover ${
        isExpanded ? 'w-full text-left' : 'inline-flex items-center w-auto'
      }`}
      style={{
        height: shouldFadeOut ? 0 : (isExpanded && contentHeight ? `${contentHeight}px` : 'auto'),
        opacity: shouldFadeOut ? 0 : 1,
        marginTop: shouldFadeOut ? 0 : '1rem',
        padding: shouldFadeOut ? 0 : (isExpanded ? '1.25rem 1rem' : '0.75rem'), // Smaller padding when collapsed
        transform: isStreaming && shouldFadeOut ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)',
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
          <LightBulbIcon className="w-5 h-5 text-warning animate-pulse flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-secondary-text leading-relaxed whitespace-pre-wrap break-words">
              {thinking || 'Thinking'}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <LightBulbIcon className="w-5 h-5 text-warning animate-pulse flex-shrink-0" />
          <span className="text-xs font-medium text-secondary-text">
            Thinking
          </span>
        </div>
      )}
    </div>
  );
};
