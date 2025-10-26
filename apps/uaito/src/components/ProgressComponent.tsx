import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { ProgressBlock } from '@uaito/sdk';
import type { MessageState } from '../redux/userSlice';

interface ProgressComponentProps extends ProgressBlock {
  messages?: MessageState[];
  currentMessageId?: string;
  isStreaming?: boolean;
}

export const ProgressComponent: FC<ProgressComponentProps> = (props) => {
  const { progress, message, messages = [], currentMessageId, isStreaming = false } = props;
  const [isComplete, setIsComplete] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
        setTimeout(() => setIsComplete(true), 500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (isComplete) {
    return null;
  }

  return (
    <div
      className={`w-full mt-4 p-2 bg-surface border border-border rounded-md shadow-sm text-xs transition-all duration-300 ease-out ${shouldFadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        transform: shouldFadeOut ? 'translateY(-8px) scale(0.95)' : 'translateY(0) scale(1)',
        height: shouldFadeOut ? 0 : 'auto',
        padding: shouldFadeOut ? 0 : undefined,
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium truncate text-primary-text" title={message}>
          {message || 'Processing...'}
        </span>
        <span className="text-sm font-semibold text-primary-text">{progress.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-surface-hover rounded-full h-1.5 mt-1">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
