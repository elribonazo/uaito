/** biome-ignore-all lint/suspicious/noAssignInExpressions: ok */
import { useEffect, useRef } from 'react';
import type { MessageState } from '../redux/userSlice';
import { Markdown } from './Markdown';
import { ToolComponent } from './ToolComponent';
import { ThinkingComponent } from './ThinkingComponent';
import { useMountedApp } from '../redux/store';
import type { TextBlock, ToolBlock, ImageBlock, DeltaBlock, ThinkingBlock, RedactedThinkingBlock, WebSearchToolResultBlock, ServerToolUseBlock, ToolUseBlock, SignatureDeltaBlock, AudioBlock } from '@uaito/sdk';

export const MessageContainer = ({ id, isUser, children }: {id: string, isUser: boolean, children: React.ReactNode}) => {
    return (
        <div
            key={`msg-${id}`}
            className={`inline-block mt-4 p-3 rounded-lg w-full ${
                isUser
                    ? 'bg-blue-500 text-white shadow-md mr-auto'
                    : 'bg-white text-gray-900 shadow-md mr-auto'
            }`}
        >
            {children}
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
                                    style={{ width: "250px", height: "auto", margin: "8px 0" }}
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
                                    style={{ display:'block' }}
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
            style={{ width: "250px", height: "auto" }}
            alt="generated content"
        />
    } else if (content.type === "audio") {
        return (
            // biome-ignore lint/a11y/useMediaCaption: Audio content is generated and doesn't need captions
<audio
            src={`${content.source.data}`}
            controls
            style={{display: "block" }}
        />
        );
    
    } else if (content.type === "thinking") {
        return <ThinkingComponent thinking={content.thinking} messages={messages} currentMessageId={id} />;
    } else if (content.type === "redacted_thinking") {
        return <ThinkingComponent thinking="[Thinking content redacted]" messages={messages} currentMessageId={id} />;
    } else if (content.type === "tool_use") {
        return <ToolComponent messageId={`msg-${id}-block`} {...content} />
    }else if (content.type === "tool_result") {
        const toolIndex = app.user.messages.findIndex((m) =>  m.type === "tool_use" &&  m.id === content.tool_use_id);

   
        const toolName = toolIndex >= 0 ?  ( app.user.messages[toolIndex].content[0] as ToolUseBlock).name: content.name
            
        return <ToolComponent messageId={`msg-${id}-block`} {...{
            ...content,
            name: toolName
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
        "Generate a picture of a pomksy dog dressing as a crypto bro",
        "Find me the best steak Restaurants in Madrid, best price, meat quality and space for year 2025",
        "What is the capital of France?",
        "A song with 80s pop track with bassy drums and synth",
        'A song with Modern electronic music with a retro vibe, techno with a modern twist, bassy drums and synth, vocals',
       `Generate a long 3 chapters story about a Robot that visits earth and interacts with humans, animals and plants. Each chapter is composed of a title, description and chapter image.`,
    ];

    return (
        <div className="flex-grow flex flex-col items-center justify-center mt-20">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">AI Chat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {prompts.map((prompt, index) => (
                    <button
                        key={prompt}
                        type="button"
                        onClick={() => onPromptClick(prompt)}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
                    >
                        <p className="text-gray-900 dark:text-white font-semibold">{prompt}</p>
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
            <>
                {toolledMessages.map((message, i) => <Message
                    key={`msg-cmp-${message.id}-${i}`}
                    message={message}
                    searchText={props.searchText}
                    messages={toolledMessages}
                />)}
                <div ref={messagesEndRef} />
            </>
        );
    }

    return <ExamplePrompts onPromptClick={props.onPromptClick} />;
};