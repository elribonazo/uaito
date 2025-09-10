import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import { useMountedApp } from '../redux/store';
import { ChatState, pushChatMessage, streamState, syncThread } from '../redux/userSlice';
import SearchBar from './SearchBar';
import { Messages } from './Messages';
import { TextBlockParam } from '@anthropic-ai/sdk/resources';
import { TokenCounter } from './TokenCounter';

interface ElectronWindow extends Window {
  electron: {
    emitUAITO: (eventName: string, ...args: any[]) => void,
    addUAITOListener: (eventName: string, listener: (...args: any[]) => void) => (...args: any[]) => void;
    removeUAITOListener: (eventName: string, listener: (...args: any[]) => void) => void;
  };
}

declare const window: ElectronWindow;

interface InputComponentProps {
  chat: ChatState,
  folderPath: string | null;
}

const ENDPOINT = process.env.ENDPOINT ? `${process.env.ENDPOINT}`: "http://localhost:3005";

const InputComponent: React.FC<InputComponentProps> = ({ folderPath, chat }) => {
  const threadListenerRef = useRef<((...args: any[]) => void) | null>(null);
  const messageListenerRef = useRef<((...args: any[]) => void) | null>(null);
  const streamStateListenerRef = useRef<((...args: any[]) => void) | null>(null);

  const app = useMountedApp()
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState('');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [, setCurrentResultIndex] = useState(-1);

  const inputTokenCount = chat?.usage?.input ?? 0;
  const outputTokenCount =chat?.usage?.output??0
  const currentChatId = chat.id;
  const currentChat = app.user.chats.find((chat) => chat.id === currentChatId);
  const isLoading = currentChat?.state === "streaming";
  const messages = currentChat.messages
  
  const lastMessage = messages[messages.length -1];
  const retry = lastMessage && lastMessage.role === "user" && currentChat.state !== "streaming" ? true: false;

  const [input, setInput] = useState(retry ? 
    (lastMessage.content[0] as TextBlockParam)?.text ?? '':
    '');

  if (!currentChat) {
    return <>Chat not found</>
  }
  
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault();
      e.currentTarget.select();
    } else if ((e.shiftKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      setInput(input + "\r\n")
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
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
  }, [isSearchEnabled]);

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


  const onThread = useCallback((channel:any, data: any) => {
    // Your onThread logic here
    const {chatId, threadId} = data;
    app.dispatch(
      syncThread({
        chatId,
        threadId
      })
    )
  }, []);

  const onMessage = useCallback((channel:any, data:any) => {
    app.dispatch(
      pushChatMessage(
        {
          chatId: data.chatId,
          message: JSON.parse(data.message)
        }
      )
    )
  }, []);

  const onStreamState = useCallback((channel:any, data:any) => {
    const {chatId, state} = data;
    app.dispatch(
      streamState({
        chatId,
        state
      })
    )
  }, []);

  useEffect(() => {
    threadListenerRef.current = window.electron.addUAITOListener('UAITO-THREAD', onThread);
    messageListenerRef.current = window.electron.addUAITOListener('UAITO-MESSAGE', onMessage);
    streamStateListenerRef.current = window.electron.addUAITOListener('UAITO-STREAM-STATE', onStreamState);
    return () => {
      if (threadListenerRef.current) window.electron.removeUAITOListener('UAITO-THREAD', threadListenerRef.current);
      if (messageListenerRef.current) window.electron.removeUAITOListener('UAITO-MESSAGE', messageListenerRef.current);
      if (streamStateListenerRef.current) window.electron.removeUAITOListener('UAITO-STREAM-STATE', streamStateListenerRef.current);
    };
  }, [onThread, onMessage, onStreamState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown])

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
   
    //Assign a new abort controller
    abortControllerRef.current = new AbortController();

    const reducedInputs = messages.reduce((all, current) => {
      if (current.type === "message") {
        const last = all[all.length-1]
        if (last && current.role === last.role) {
          return [
            ...all.slice(0, all.length-1),
            {
              role:current.role,
              content: [
                ...last.content,
                ...current.content
              ]
            }
          ]
        }
        return [...all, current];
      }
      if (current.type === "tool_use") {
        const lastMessage = all[all.length - 1];
        const updatedLastMessage = {
          ...lastMessage,
          content: [
            ...lastMessage.content,...current.content
          ]
        };
        return [...all.slice(0, -1), updatedLastMessage];
      }
      if (current.type === "tool_result") {
        return [...all, current];
      }
      return all;
    }, []).map((item) => ({role: item.role, content: item.content}));

    (window as any).electron.emitUAITO('stream', {
      apiKey: app.user.apiKey,
      chatId: currentChatId,
      prompt: input,
      inputs:  reducedInputs,
      directory: folderPath,
      ENDPOINT
    });

    setInput('');
  };

  const handleStopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      window.electron.emitUAITO('stream-abort', {chatId: currentChatId})
    }
  };

  const current = app.user.chatId === currentChatId;
  if (!current) {
    return null
  }
  return (
    <div className="flex flex-col h-full rounded-lg w-full max-w-full transition-colors duration-300">
      {isSearchEnabled &&  <SearchBar 
        defaultValue={searchText} 
        onChange={setSearchText} 
        inputRef={searchInputRef}
      />}

      <div className="fixed bottom-0 left-0 right-0 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto"></div>
        <div className="flex flex-col h-full">
          <div className="h-[calc(100vh-theme(spacing.32))] overflow-auto p-4 relative">
            {chat && <TokenCounter input={inputTokenCount} output={outputTokenCount} />}
            <Messages searchText={searchText} messages={messages} />
          </div>
          
            <div className="p-4 border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
              <form className="flex space-x-2">
                <textarea
                  value={input }
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder={`Type your message...`}
                  className="flex-grow px-4 py-2 border rounded-lg text-gray-900 bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 resize-none overflow-hidden"
                  style={{ height: '40px', minHeight: '40px', maxHeight: '120px' }}
                  rows={1}
                  disabled={isLoading && lastMessage !== undefined && lastMessage.role === "user" && currentChat.state !== "streaming" ? true: false}
                />
                <button
                  type="button"
                  onClick={handleSubmit} 
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  ) : null}
                  {
                    retry ? isLoading === true ? 'Retrying...' : 'Retry':null
                  }
                  {
                    !retry  ?  isLoading === true ? 'Sending...' : 'Send': null
                  }
                </button>
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