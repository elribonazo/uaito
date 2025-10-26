import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import { useMountedApp } from '../redux/store';
import SearchBar from './SearchBar';
import { Messages } from './Messages';
import type { TextBlockParam } from '@anthropic-ai/sdk/resources';
import { useSession } from 'next-auth/react';
import { MessageArray, LLMProvider, type Message, type MessageInput, type BlockType } from '@uaito/sdk';
import {
  ArrowPathIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  CameraIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const pullThreshold = 80; // pixels to pull before triggering refresh

const FileAttachments = ({
  attachedFiles,
  removeFile,
}: {
  attachedFiles: File[];
  removeFile: (index: number) => void;
}) => {
  if (attachedFiles.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {attachedFiles.map((file, index) => {
        const isImage = file.type.startsWith('image/');
        const imageUrl = isImage ? URL.createObjectURL(file) : undefined;
        
        return (
          <div
            key={`${file.name}-${index}`}
            className="relative group bg-surface border border-border rounded-lg overflow-hidden hover:border-accent transition-colors"
            style={{ width: '120px', height: '120px' }}
          >
            {/* Preview */}
            {isImage && imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={file.name}
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(imageUrl!)} // Clean up the object URL after loading
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-hover p-2">
                <DocumentTextIcon className="h-10 w-10 text-secondary-text mb-2" />
              </div>
            )}
            
            {/* Overlay with file info */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
              {isImage ? <PhotoIcon className="h-8 w-8 text-white mb-1" /> : <DocumentTextIcon className="h-8 w-8 text-white mb-1" />}
              <span className="text-white text-xs text-center px-2 truncate w-full">
                {file.name}
              </span>
              <span className="text-white/80 text-xs">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
              title="Remove file"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
            
            {/* File name label at bottom - always visible */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
              <span className="text-white text-xs truncate block">
                {file.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

type ExamplePrompt = { icon: any; text: string; shortText: string };

const InputComponent: React.FC<{chatId: string, agent?: string, provider?: LLMProvider, model?: string, examplePrompts?: ExamplePrompt[]}> = (props) => {
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
  
  // Check if file upload is allowed 
  const isFileUploadAllowed = props.provider === LLMProvider.API || props.provider === LLMProvider.OpenAI;
  
  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  

  const lastMessage = messages[messages.length - 1];
  const retry = lastMessage && lastMessage.role === "user" && currentChat.state !== "streaming";

  const [input, setInput] = useState(retry ? 
    (lastMessage.content[0] as TextBlockParam)?.text ?? '' :
    '');
  
  // File upload state
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  }, [isPulling, pullDistance, isLoading]);

  // File handling functions
  const handleFiles = useCallback((files: FileList | File[] | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const allowedImageTypes = ["image/"];
    const allowedTextTypes = ["text/plain", "text/markdown", "application/json", "text/csv"];
    const newFiles = fileArray.filter(file => 
      allowedImageTypes.some(type => file.type.startsWith(type)) ||
      allowedTextTypes.includes(file.type)
    );
    
    if (newFiles.length < fileArray.length) {
      console.warn("Some files were not allowed. Allowed types: images, txt, md, json, csv");
    }
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFileUploadAllowed && e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, [isFileUploadAllowed]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only hide if we're leaving the entire drop zone, not just a child element
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFileUploadAllowed && e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, [isFileUploadAllowed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isFileUploadAllowed) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles, isFileUploadAllowed]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles],
  );

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Maybe show a toast notification
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `capture-${Date.now()}.png`, {
                type: "image/png",
              });
              handleFiles([file]);
            }
            closeCamera();
          },
          "image/png",
        );
      }
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  // Convert files to base64 ImageBlock format
  const convertFilesToBlocks = async (files: File[]): Promise<BlockType[]> => {
    const blocks: BlockType[] = [];
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix to get pure base64
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Determine media type from file type
        const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
        
        blocks.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64
          }
        } as BlockType);
      } else if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'application/json' || file.type === 'text/csv') {
        const content = await file.text();
        blocks.push({
          type: 'file',
          source: {
            name: file.name,
            content: content,
            media_type: file.type,
            type: 'string'
          }
        } as BlockType);
      }
    }
    
    return blocks;
  };

  const sendMessage = async (prompt: string) => {
    if ((!prompt.trim() && attachedFiles.length === 0) || isLoading) return;
    if (!session || !session.data) return;
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

    // Convert attached files to image blocks
    let promptContent: string | BlockType[] = prompt;
    if (attachedFiles.length > 0) {
      const fileBlocks = await convertFilesToBlocks(attachedFiles);
      // Combine text and images into BlockType array
      const textBlock: BlockType = {
        type: 'text',
        text: prompt || 'Please analyze these images.'
      } as BlockType;
      promptContent = [textBlock, ...fileBlocks];
    }

    app.streamMessage({
      chatId: props.chatId,
      agent:props.agent,
      prompt: promptContent,
      inputs: MessageArray.from(reducedInputs),
      signal: abortControllerRef.current.signal,
      dispatch: app.dispatch,
      session: session.data,
      provider: props.provider,
      model: props.model
    })

    setInput('');
    setAttachedFiles([]); // Clear attached files after sending
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

  // File attachment display component with image previews
  

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
            <section 
              aria-label="Message input with image drop zone"
              className={`bg-surface border rounded-2xl p-3 sm:p-4 shadow-lg relative transition-all duration-200 ${
                isDragging && isFileUploadAllowed ? 'border-primary border-2 bg-primary/5 scale-[1.02]' : 'border-border'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragging && isFileUploadAllowed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/20 backdrop-blur-sm rounded-2xl z-10 pointer-events-none border-2 border-dashed border-primary animate-pulse">
                  <CloudArrowUpIcon className="w-16 h-16 text-primary mb-3" />
                  <div className="text-primary text-lg font-semibold">Drop files here</div>
                  <div className="text-primary-text text-sm mt-1">Release to attach</div>
                </div>
              )}
              <form 
                onSubmit={handleSubmit} 
                className="space-y-2 sm:space-y-3"
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileAttachments attachedFiles={attachedFiles} removeFile={removeFile} />
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  placeholder={
                    isFileUploadAllowed
                      ? "Type your message or drag & drop files here..."
                      : "Type your message..."
                  }
                  className="w-full px-0 py-0 bg-transparent text-primary-text placeholder-tertiary-text focus:outline-none resize-none text-sm"
                  style={{ minHeight: "60px", maxHeight: "200px" }}
                  rows={2}
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,text/plain,text/markdown,application/json,text/csv"
                      multiple
                      onChange={handleFileInputChange}
                      className="hidden"
                      disabled={!isFileUploadAllowed}
                    />
                    {isFileUploadAllowed && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 sm:px-3 py-1.5 text-secondary-text hover:text-primary-text text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <PhotoIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Attach File</span>
                      </button>
                    )}
                    {isFileUploadAllowed && (
                      <button
                        type="button"
                        onClick={openCamera}
                        className="px-2 sm:px-3 py-1.5 text-secondary-text hover:text-primary-text text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <CameraIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Use Camera</span>
                      </button>
                    )}
                  </div>

                  {(input.length > 0 || attachedFiles.length > 0) && (
                    <button
                      type="submit"
                      disabled={
                        isLoading || (!input.trim() && attachedFiles.length === 0)
                      }
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading && (
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                      )}
                      {isLoading ? "Sending..." : "Send message"}
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Example prompts */}
            <Messages searchText={searchText} messages={messages} isStreaming={isStreaming} examplePrompts={props.examplePrompts} onPromptClick={(prompt) => {
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
                        className="stroke-tertiary-text"
                        strokeWidth="3"
                        fill="none"
                        opacity="0.3"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className="stroke-primary transition-all duration-150"
                        strokeWidth="3"
                        fill="none"
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
              <Messages searchText={searchText} messages={messages} isStreaming={isStreaming} examplePrompts={props.examplePrompts} onPromptClick={(prompt) => {
                setInput(prompt);
                sendMessage(prompt);
              }}/>
            </div>
          </div>
          
          {/* Bottom input bar */}
          <section 
            aria-label="Message input with image drop zone"
            className={`border-t bg-background/80 backdrop-blur-sm relative transition-all duration-200 ${
              isDragging && isFileUploadAllowed ? 'border-primary border-t-4' : 'border-border'
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragging && isFileUploadAllowed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/20 backdrop-blur-md z-10 pointer-events-none border-2 border-dashed border-primary">
                <CloudArrowUpIcon className="w-12 h-12 sm:w-16 sm:h-16 text-primary mb-2 sm:mb-3 animate-bounce" />
                <div className="text-primary text-base sm:text-lg font-semibold">Drop files here</div>
                <div className="text-primary-text text-xs sm:text-sm mt-1">Release to attach</div>
              </div>
            )}
            <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
              <form 
                className="space-y-2" 
                onSubmit={handleSubmit}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileAttachments attachedFiles={attachedFiles} removeFile={removeFile} />
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleTextareaKeyDown}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      placeholder={isFileUploadAllowed ? "Type a message or drag & drop files..." : "Type a message..."}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-surface border border-border rounded-xl text-primary-text text-sm placeholder-tertiary-text focus:outline-none focus:border-primary transition-all resize-none"
                      style={{ height: '40px', minHeight: '40px', maxHeight: '120px' }}
                      rows={1}
                      disabled={isLoading && lastMessage !== undefined && lastMessage.role === "user" && currentChat.state !== "streaming"}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,text/plain,text/markdown,application/json,text/csv"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={!isFileUploadAllowed}
                  />
                  {isFileUploadAllowed && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 bg-surface hover:bg-surface-hover text-secondary-text hover:text-primary-text border border-border text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      title="Attach file"
                    >
                      <PhotoIcon className="h-4 w-4" />
                    </button>
                  )}
                  {isFileUploadAllowed && (
                    <button
                      type="button"
                      onClick={openCamera}
                      disabled={isLoading}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 bg-surface hover:bg-surface-hover text-secondary-text hover:text-primary-text border border-border text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      title="Use camera"
                    >
                      <CameraIcon className="h-4 w-4" />
                    </button>
                  )}
                  {!isLoading && (input.length > 0 || attachedFiles.length > 0) && (
                    <button
                      type="submit"
                      disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
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
                </div>
              </form>
            </div>
          </section>
        </>
      )}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-surface p-4 rounded-lg shadow-lg w-full max-w-xl">
            {/* biome-ignore lint/a11y/useMediaCaption: live stream does not need captions */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto max-w-lg rounded mb-4"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={takePicture}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
              >
                Take Picture
              </button>
              <button
                type="button"
                onClick={closeCamera}
                className="px-4 py-2 bg-surface hover:bg-surface-hover text-secondary-text font-medium rounded-lg border border-border transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default InputComponent;