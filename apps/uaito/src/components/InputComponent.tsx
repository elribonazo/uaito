import {
  useState,
  useRef,
  useEffect,
} from 'react';

import { useMountedApp } from '../redux/store';
import SearchBar from './SearchBar';
import { Messages } from './Messages';
import type { TextBlockParam } from '@anthropic-ai/sdk/resources';
import { useSession } from 'next-auth/react';
import { MessageArray, type LLMProvider, type Message, type MessageInput } from '@uaito/sdk';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const InputComponent: React.FC<{chatId: string, agent?: string, provider?: LLMProvider, model?: string}> = (props) => {
  const app = useMountedApp();
  const session = useSession();
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState('');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const currentChat = app.user.chats[props.chatId];
  const isLoading = currentChat?.state === "streaming";
  const isStreaming = currentChat?.state === "streaming";
  const messages = currentChat?.messages ?? [];
  
  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const pullThreshold = 80; // pixels to pull before triggering refresh
  
  const lastMessage = messages[messages.length - 1];
  const retry = lastMessage && lastMessage.role === "user" && currentChat.state !== "streaming";

  const [input, setInput] = useState(retry ? 
    (lastMessage.content[0] as TextBlockParam)?.text ?? '' :
    '');

  useEffect(() => {
    const fn = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchText('');
        setIsSearchEnabled(false);
      } else if (event.key === 'f' && event.metaKey) {
        event.preventDefault();
        setIsSearchEnabled(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    }
    window.addEventListener('keydown', fn);
    return () => {
      window.removeEventListener('keydown', fn);
    };
  }, []);

  // Pull to refresh handlers (mobile only)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if device is mobile
    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    };

    if (!isMobile()) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull to refresh when scrolled to top
      if (container.scrollTop === 0 && !isLoading) {
        touchStartY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isLoading) return;

      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY.current;

      // Only allow pulling down
      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        // Apply resistance to the pull
        const resistedDistance = Math.min(distance * 0.5, pullThreshold * 1.5);
        setPullDistance(resistedDistance);
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling) return;

      setIsPulling(false);

      // Trigger refresh if pulled beyond threshold
      if (pullDistance >= pullThreshold && !isLoading) {
        setIsRefreshing(true);
        // Refresh the page
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        // Reset pull distance with animation
        setPullDistance(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, pullThreshold, isLoading]);

  const sendMessage = (prompt:string) => {
    if (!prompt.trim() || isLoading) return;
    if (!session || !session.data) return
    abortControllerRef.current = new AbortController();

    const reducedInputs = (messages as Message[]).reduce<Message[]>((all, current) => {
      if (current.type === "tool_use") {
        const lastMessage = all[all.length - 1];
        const updatedLastMessage = {
          ...lastMessage,
          content: [
            ...lastMessage.content,...current.content
          ]
        };
        all.pop();
        all.push(updatedLastMessage)
        return all;
      }
      if (current.type === "message") {
        const last = all[all.length-1]
        if (last && current.role === last.role) {
          const updated = [
            ...all.slice(0, all.length-1),
            {
              role:current.role,
              content: [
                ...last.content,
                ...current.content
              ],
              id: last.id,
              type: last.type
            }
          ] as Message[];
          return updated
        }
      }
      
      all.push(current);
      return all
    }, []).map((item) => ({role: item.role, content: item.content})) as MessageInput[]

    app.streamMessage({
      chatId: props.chatId,
      agent:props.agent,
      prompt: prompt,
      inputs: MessageArray.from(reducedInputs),
      signal: abortControllerRef.current.signal,
      dispatch: app.dispatch,
      session: session.data,
      provider: props.provider,
      model: props.model
    })

    setInput('');
  }
  
  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault();
      e.currentTarget.select();
    } else if ((e.shiftKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      setInput(input + "\r\n")
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleStopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  if (!currentChat) {
    return <>Chat not found</>;
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full w-full transition-colors duration-300 absolute inset-0">
      {isSearchEnabled && searchInputRef?.current && <SearchBar 
        defaultValue={searchText} 
        onChange={setSearchText} 
        inputRef={searchInputRef}
      />}
      
      {/* Empty state with centered input */}
      {!hasMessages && (
        <div className="flex-1 flex items-center justify-center px-3 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl space-y-6 sm:space-y-8">
            <div className="text-center space-y-2 sm:space-y-4 mb-4 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-primary-text">What can I help you with?</h2>
              <p className="text-secondary-text text-xs sm:text-sm">Ask me anything or try one of the examples below</p>
            </div>
            
            {/* Centered input bubble */}
            <div className="bg-surface border border-border rounded-2xl p-3 sm:p-4 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Type your message here..."
                  className="w-full px-0 py-0 bg-transparent text-primary-text placeholder-tertiary-text focus:outline-none resize-none text-sm"
                  style={{ minHeight: '60px', maxHeight: '200px' }}
                  rows={2}
                  disabled={isLoading}
                />
                {input.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading && (
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                      )}
                      {isLoading ? 'Sending...' : 'Send message'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Example prompts */}
            <Messages searchText={searchText} messages={messages} isStreaming={isStreaming} onPromptClick={(prompt) => {
              setInput(prompt);
              sendMessage(prompt);
            }}/>
          </div>
        </div>
      )}

      {/* Messages view with bottom input */}
      {hasMessages && (
        <>
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-auto px-3 sm:px-6 lg:px-8 relative"
            style={{
              paddingTop: `${Math.max(pullDistance, 12)}px`,
              paddingBottom: '12px',
              transition: isPulling ? 'none' : 'padding-top 0.3s ease-out'
            }}
          >
            {/* Pull to refresh indicator */}
            {pullDistance > 0 && (
              <div 
                className="absolute left-0 right-0 flex items-center justify-center z-10 pointer-events-none"
                style={{
                  top: `${Math.max(0, pullDistance - 85)}px`,
                  opacity: Math.min(pullDistance / pullThreshold, 1)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  {/* Circular progress indicator */}
                  <div className="relative w-12 h-12">
                    {/* Background circle */}
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48" aria-label="Pull to refresh progress">
                      <title>Refresh Progress</title>
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="rgb(156, 163, 175)"
                        strokeWidth="3"
                        fill="none"
                        opacity="0.3"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="rgb(99, 102, 241)"
                        strokeWidth="3"
                        fill="none"
                        className="transition-all duration-150"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - Math.min(pullDistance / pullThreshold, 1))}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ArrowPathIcon 
                        className={`h-6 w-6 text-primary transition-transform duration-300 ${
                          isRefreshing || pullDistance >= pullThreshold 
                            ? 'animate-spin' 
                            : ''
                        }`}
                        style={{
                          transform: !isRefreshing && pullDistance < pullThreshold 
                            ? `rotate(${(pullDistance / pullThreshold) * 360}deg)` 
                            : undefined
                        }}
                      />
                    </div>
                  </div>
                  {/* Text indicator with smooth fade */}
                  <div className="relative h-5 overflow-hidden">
                    <span 
                      className={`text-xs font-medium transition-all duration-300 ${
                        isRefreshing 
                          ? 'text-primary' 
                          : pullDistance >= pullThreshold 
                            ? 'text-accent' 
                            : 'text-secondary-text'
                      }`}
                    >
                      {isRefreshing ? 'Refreshing...' : pullDistance >= pullThreshold ? 'Release to refresh' : 'Pull to refresh'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="max-w-5xl mx-auto">
              <Messages searchText={searchText} messages={messages} isStreaming={isStreaming} onPromptClick={(prompt) => {
                setInput(prompt);
                sendMessage(prompt);
              }}/>
            </div>
          </div>
          
          {/* Bottom input bar */}
          <div className="border-t border-border bg-background/80 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
              <form className="flex gap-1.5 sm:gap-2" onSubmit={handleSubmit}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-surface border border-border rounded-xl text-primary-text text-sm placeholder-tertiary-text focus:outline-none focus:border-primary transition-all resize-none"
                  style={{ height: '40px', minHeight: '40px', maxHeight: '120px' }}
                  rows={1}
                  disabled={isLoading && lastMessage !== undefined && lastMessage.role === "user" && currentChat.state !== "streaming"}
                />
                {!isLoading && input.length > 0 && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {retry ? 'Retry' : 'Send'}
                  </button>
                )}
                {isLoading && (
                  <button
                    type="button"
                    onClick={handleStopRequest}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-surface hover:bg-red-500/10 text-secondary-text hover:text-red-400 border border-border hover:border-red-500/30 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200"
                  >
                    Stop
                  </button>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


export default InputComponent;