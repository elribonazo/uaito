import React, {
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

const InputComponent: React.FC<{agent?: string, provider?: LLMProvider, model?: string}> = (props) => {
  const app = useMountedApp();
  const session = useSession();
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState('');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const currentChat = app.user;
  const isLoading = currentChat?.state === "streaming";
  const messages = currentChat?.messages ?? [];
  
  const lastMessage = messages[messages.length - 1];
  const retry = lastMessage && lastMessage.role === "user" && currentChat.state !== "streaming";

  const [input, setInput] = useState(retry ? 
    (lastMessage.content[0] as TextBlockParam)?.text ?? '' :
    '');

  useEffect(() => {
    const handleScrollToNextResult = () => {
      const results = document.querySelectorAll('mark');
      if (results.length > 0) {
        setCurrentResultIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % results.length;
          results[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
          return nextIndex;
        });
      }
    };

    const fn = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchText('');
        setIsSearchEnabled(false);
      } else if (event.key === 'f' && event.metaKey) {
        event.preventDefault();
        setIsSearchEnabled(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
      } else if (event.key === 'Enter' && isSearchEnabled) {
        event.preventDefault();
        handleScrollToNextResult();
      }
    }
    window.addEventListener('keydown', fn);
    return () => {
      window.removeEventListener('keydown', fn);
    };
  }, [isSearchEnabled]);

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

  return (
    <div className="flex flex-col h-full rounded-lg w-full max-w-full transition-colors duration-300">
      {isSearchEnabled && searchInputRef && <SearchBar 
        defaultValue={searchText} 
        onChange={setSearchText} 
        inputRef={searchInputRef as any}
      />}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 transition-colors duration-300">
        <div className="flex flex-col h-full">
          <div className="h-[calc(100vh-theme(spacing.32))] overflow-auto p-4 relative">
            <Messages searchText={searchText} messages={messages} onPromptClick={(prompt) => {
              setInput(prompt);
              sendMessage(prompt);
            }}/>
          </div>
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <form className="flex space-x-2" onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none overflow-hidden"
                style={{ height: '40px', minHeight: '40px', maxHeight: '120px' }}
                rows={1}
                disabled={isLoading && lastMessage !== undefined && lastMessage.role === "user" && currentChat.state !== "streaming"}
              />
              {
                !isLoading && input.length > 0 && <button
                type="submit"
                className=" sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                ) : null}

                {retry ? (isLoading ? 'Retrying...' : 'Retry') : (isLoading ? 'Sending...' : 'Send')}
              </button>
              }
              {isLoading && (
                <button
                  type="button"
                  onClick={handleStopRequest}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Stop
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default InputComponent;