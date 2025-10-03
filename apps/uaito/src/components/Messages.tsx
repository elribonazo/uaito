/** biome-ignore-all lint/suspicious/noAssignInExpressions: ok */
import { useEffect, useRef } from 'react';
import type { MessageState } from '../redux/userSlice';
import { Markdown } from './Markdown';
import { ToolComponent } from './ToolComponent';
import { ThinkingComponent } from './ThinkingComponent';
import { useMountedApp } from '../redux/store';
import type { TextBlock, ToolBlock, ImageBlock, DeltaBlock, ThinkingBlock, RedactedThinkingBlock, WebSearchToolResultBlock, ServerToolUseBlock, ToolUseBlock, SignatureDeltaBlock, AudioBlock } from '@uaito/sdk';
import { PhotoIcon, MagnifyingGlassIcon, GlobeAltIcon, MusicalNoteIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export const MessageContainer = ({ id, isUser, children }: {id: string, isUser: boolean, children: React.ReactNode}) => {
    return (
        <div
            key={`msg-${id}`}
            className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`p-3 rounded-xl max-w-[85%] ${
                    isUser
                        ? 'bg-primary/90 text-white shadow-sm'
                        : 'bg-surface text-primary-text shadow-sm border border-border'
                }`}
            >
                {children}
            </div>
        </div>
    );
};

// Helper function to parse text content and extract images
type ContentPart = { type: 'text'; content: string } | { type: 'image'; content: string } | { type: 'audio'; content: string };

const parseTextWithImages = (text: string): ContentPart[] => {
    const parts: ContentPart[] = [];
    const combinedRegex = /(<image>(.*?)<\/image>|<audio>(.*?)<\/audio>)/g;
    let currentIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = combinedRegex.exec(text)) !== null) {
        // Add text before the tag
        if (match.index > currentIndex) {
            const textPart = text.substring(currentIndex, match.index);
            if (textPart.trim()) {
                parts.push({ type: 'text', content: textPart });
            }
        }
        
        // Check if it's an image or audio tag and add accordingly
        if (match[0].startsWith('<image>')) {
            parts.push({ type: 'image', content: match[2] });
        } else if (match[0].startsWith('<audio>')) {
            parts.push({ type: 'audio', content: match[3] });
        }
        
        currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last tag
    if (currentIndex < text.length) {
        const remainingText = text.substring(currentIndex);
        if (remainingText.trim()) {
            parts.push({ type: 'text', content: remainingText });
        }
    }
    
    // If no tags found, return the original text as a single part
    if (parts.length === 0) {
        parts.push({ type: 'text', content: text });
    }
    
    return parts;
};

export const MessageItem:React.FC<{
    id: string, 
    isUser: boolean,
    content: TextBlock | ToolBlock | ImageBlock |AudioBlock | DeltaBlock | ThinkingBlock | RedactedThinkingBlock | ServerToolUseBlock | WebSearchToolResultBlock | SignatureDeltaBlock,
    searchText: string,
    type: MessageState['type'],
    messages?: MessageState[]
}> = ({id, isUser, content, searchText, messages}) => {
    const app = useMountedApp();
    if (content.type === "text") {
        const text = content.text;
        
        // Check if the text contains images
        if (text.includes("<image>") || text.includes("<audio>")) {
            const parts = parseTextWithImages(text);

            return (
                <MessageContainer id={id} isUser={isUser}>
                    {parts.map((part, index) => {
                        if (part.type === 'text') {
                            return (
                                <Markdown key={`${id}-text-${index}-${part.content.slice(0, 20).replace(/\s/g, '')}`} searchText={searchText}>
                                    {part.content}
                                </Markdown>
                            );
                        } else if (part.type === 'image') {
                            return (
                                <img
                                    key={`${id}-image-${index}-${part.content.slice(-20)}`}
                                    src={part.content}
                                    className="w-64 h-auto my-2"
                                    alt="generated content"
                                />
                            );
                        } else if (part.type === 'audio') {
                            return (
                                // biome-ignore lint/a11y/useMediaCaption: Audio content is generated and doesn't need captions
<audio
                                    key={`${id}-audio-${index}-${part.content.slice(-20)}`}
                                    src={part.content}
                                    controls
                                    className="block"
                                />
                            );
                        }
                        return null;
                    })}
                </MessageContainer>
            );
        }
        
        return <MessageContainer id={id} isUser={isUser}>
            <Markdown searchText={searchText}>
            {content.text}
            </Markdown>
        </MessageContainer>
    } else if (content.type === "image") {
        return <img
            src={`${content.source.data}`}
            className="w-64 h-auto"
            alt="generated content"
        />
    } else if (content.type === "audio") {
        return (
            // biome-ignore lint/a11y/useMediaCaption: Audio content is generated and doesn't need captions
<audio
            src={`${content.source.data}`}
            controls
            className="block"
        />
        );
    
    } else if (content.type === "thinking") {
        return <ThinkingComponent thinking={content.thinking} messages={messages} currentMessageId={id} />;
    } else if (content.type === "redacted_thinking") {
        return <ThinkingComponent thinking="[Thinking content redacted]" messages={messages} currentMessageId={id} />;
    } else if (content.type === "tool_use") {
        return <ToolComponent messageId={`msg-${id}-block`} {...content} messages={messages} currentMessageId={id} />
    }else if (content.type === "tool_result") {
        const toolIndex = app.user.messages.findIndex((m) =>  m.type === "tool_use" &&  m.id === content.tool_use_id);

   
        const toolName = toolIndex >= 0 ?  ( app.user.messages[toolIndex].content[0] as ToolUseBlock).name: content.name
            
        return <ToolComponent messageId={`msg-${id}-block`} {...{
            ...content,
            name: toolName,
            messages,
            currentMessageId: id,
        }} />
    } else if (content.type === "signature_delta") {
        // Handle signature delta - could render as a special text block or ignore
        return <MessageContainer id={id} isUser={isUser}>
            <Markdown searchText={searchText}>
                {content.signature || ''}
            </Markdown>
        </MessageContainer>
    }
}

export const Message: React.FC<{
    message: MessageState,
    searchText: string,
    messages?: MessageState[]
}> = (props) => {
    const { message, searchText, messages } = props;
    const { id, role, content, type } = message;
    const isUser = role === 'user';
    if (Array.isArray(content)) {
        return content.filter((c) => c.type !== "error" && c.type !== "usage" ).map((currentContent, i) => {
            return <MessageItem 
            key={`msg-cmp-${message.id}-content${i}`}
            id={id} 
            isUser={isUser} 
            content={currentContent} 
            searchText={searchText}
            type={type}
            messages={messages}/>
        }
         )
    }
    //TODO: should not be needed but for some reason the message comes wrong in here
    return null
};

const ExamplePrompts = ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => {
    const prompts = [
        {
            icon: PhotoIcon,
            text: "Generate 5 random pictures of a pomsky dog dressing as a crypto bro and doing different activities",
            shortText: "Generate dog pictures"
        },
        {
            icon: MagnifyingGlassIcon,
            text: "Find me the best steak Restaurants in Madrid, best price, meat quality and space for year 2025",
            shortText: "Find restaurants"
        },
        {
            icon: GlobeAltIcon,
            text: "What is the capital of France?",
            shortText: "Capital of France?"
        },
        {
            icon: MusicalNoteIcon,
            text: "A song with 80s pop track with bassy drums and synth",
            shortText: "80s pop song"
        },
        {
            icon: MusicalNoteIcon,
            text: 'A song with Modern electronic music with a retro vibe, techno with a modern twist, bassy drums and synth, vocals',
            shortText: "Modern electronic"
        },
        {
            icon: BookOpenIcon,
            text: `Generate a long 3 chapters story about a Robot that visits earth and interacts with humans, animals and plants. Each chapter is composed of a title, description and chapter image.`,
            shortText: "Robot story"
        },
    ];

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                {prompts.map((prompt) => (
                    <button
                        key={prompt.text}
                        type="button"
                        onClick={() => onPromptClick(prompt.text)}
                        className="p-2 sm:p-3 bg-surface hover:bg-surface-hover rounded-xl transition-all duration-200 text-left border border-border hover:border-border-light group flex items-start gap-2"
                    >
                        <prompt.icon className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                            <p className="text-secondary-text group-hover:text-primary-text text-xs sm:text-sm line-clamp-2 sm:hidden">{prompt.shortText}</p>
                            <p className="text-secondary-text group-hover:text-primary-text text-sm line-clamp-2 hidden sm:block">{prompt.text}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};


export const Messages: React.FC<{ searchText: string, messages: MessageState[], onPromptClick: (prompt: string) => void }> = (props) => {
    const messages: MessageState[] = props.messages;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length > 0) {
        const toolledMessages = messages.reduce<MessageState[]>((tooled, currentMessage) => {
            if (currentMessage.type === "tool_result") {

                const currentContent = currentMessage.content[0];
                if (currentContent.type === "tool_result") {
                    const tooledIndex = tooled.findIndex((tool) => tool.type === "tool_use" && tool.content[0].type === "tool_use" && tool.content[0].id === currentContent.tool_use_id) 
                    tooled[tooledIndex] = currentMessage;
                    return tooled
                }
            }
            const existingMessageIndex = tooled.findIndex(m => m.id === currentMessage.id);
            if (existingMessageIndex !== -1) {
                const existingMessage = tooled[existingMessageIndex];
                if (currentMessage.type === 'thinking' && existingMessage.type === 'thinking') {
                    return tooled;
                }
            }
            tooled.push(currentMessage);
            return tooled;
        }, []);
        return (
            <div className="flex flex-col space-y-2">
                {toolledMessages.map((message, i) => <Message
                    key={`msg-cmp-${message.id}-${i}`}
                    message={message}
                    searchText={props.searchText}
                    messages={toolledMessages}
                />)}
                <div ref={messagesEndRef} />
            </div>
        );
    }

    return <ExamplePrompts onPromptClick={props.onPromptClick} />;
};