import { useEffect, useRef } from 'react';
import type { MessageState } from '../redux/userSlice';
import { Markdown } from './Markdown';
import { ToolComponent } from './ToolComponent';
import { ThinkingComponent } from './ThinkingComponent';
import { useMountedApp } from '../redux/store';
import type { TextBlock, ToolBlock, ImageBlock, DeltaBlock, ThinkingBlock, RedactedThinkingBlock, WebSearchToolResultBlock, ServerToolUseBlock, ToolUseBlock, SignatureDeltaBlock } from '@uaito/sdk';

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

export const MessageItem:React.FC<{
    id: string, 
    isUser: boolean,
    content: TextBlock | ToolBlock | ImageBlock | DeltaBlock | ThinkingBlock | RedactedThinkingBlock | ServerToolUseBlock | WebSearchToolResultBlock | SignatureDeltaBlock,
    searchText: string,
    type: MessageState['type'],
    messages?: MessageState[]
}> = ({id, isUser, content, searchText, messages}) => {
    const app = useMountedApp();
    if (content.type === "text") {
        return <MessageContainer id={id} isUser={isUser}>
            <Markdown searchText={searchText}>
            {content.text}
            </Markdown>
        </MessageContainer>
    } else if (content.type === "image") {
        return <img
            src={`data:${content.source.media_type};${content.source.type},${content.source.data}`}
            style={{ width: "250px", height: "auto" }}
            alt="generated content"
        />
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

export const Messages: React.FC<{ searchText: string, messages: MessageState[] }> = (props) => {
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

    return (
        <div className="flex-grow flex items-center justify-center mt-20">
            <p className='text-gray-700 dark:text-gray-300'>No messages yet. Start a conversation!</p>
        </div>
    );
};