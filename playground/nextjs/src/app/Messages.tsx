import React, { useEffect, useRef } from 'react';
import { Markdown } from './Markdown';
import { ToolComponent } from './ToolComponent';
import { TextBlock, ToolBlock, ImageBlock, DeltaBlock, Message as MessageState } from '@uaito/sdk';
import Image from 'next/image';
export const MessageContainer = ({ id, isUser, children }:any) => {
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
    content: TextBlock | ToolBlock | ImageBlock | DeltaBlock
    searchText: string,
    type: MessageState['type']
}> = ({id, isUser, content: notParsed, searchText}) => {
    let content
    try {
        // if (notParsed.type === "text") {
        //     content = JSON.parse((notParsed as any).text);
        // } else {
            content = notParsed;
        //}
        
    } catch (e) {
        content = notParsed;
    }
    if (content.type === "text") {
        return <MessageContainer id={id} isUser={isUser}>
            <Markdown searchText={searchText}>
            {content.text}
            </Markdown>
        </MessageContainer>
    } else if (content.type === "image") {
        return <Image
            src={`data:${content.source.media_type};${content.source.type},${content.source.data}`}
            style={{ width: "250px", height: "auto" }} alt={''}        />
    }  else if (content.type === "tool_use") {
        return <ToolComponent messageId={`msg-${id}-block`} {...content} />
    } else if (content.type === "tool_result") {
        return <ToolComponent messageId={`msg-${id}-block`} {...content} />
    }
}

export const Message: React.FC<{
    message: MessageState,
    searchText: string
}> = (props) => {
    const { message, searchText } = props;
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
             type={type}/>
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
            return [...tooled, currentMessage]
        }, []);
        return (
            <>
                {toolledMessages.map((message, i) => <Message
                    key={`msg-cmp-${message.id}`}
                    message={message}
                    searchText={props.searchText}
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