import React, { useEffect, useRef, useState } from "react";
import { useMountedApp } from "../redux/store"
import { ChatState, removeChat, updateChat } from "../redux/userSlice";

interface EditChatInputProps {
    chat: ChatState,
    onChatRemoved: (name: string) => void,
    onChatSelect: (name: string) => void,
}

export const EditChatInput: React.FC<EditChatInputProps> = (props) => {
    const app = useMountedApp()
    const dropZoneRef = useRef(null);
    const dispatch = app.dispatch;
    const [draggingId, setDraggingId] = useState(null);
    const [enableEdit, setEnableEdit] = useState(false);
    const [
        currentChatName, 
        setCurrentChatName
    ] = useState(props.chat.name);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDraggingId(null);
    };

    const chatSessions = app.user.chats;
    const currentSessionId = props.chat.id;

    const session = props.chat;

    const onUpdateEvent = (e) => {
        if ((e.key && e.key === "Enter") || !e.key) {
            app.dispatch(
                updateChat(
                    {
                        id: currentSessionId, 
                        name:currentChatName
                    }
                )
            )
            setCurrentChatName('')
            setEnableEdit(false)
        }
    }
    useEffect(() => {
        const handleDragEnd = (e) => {
          if (draggingId !== null) {
            const dropZoneRect = dropZoneRef.current.getBoundingClientRect();
            if (
              e.clientX < dropZoneRect.left ||
              e.clientX > dropZoneRect.right ||
              e.clientY < dropZoneRect.top ||
              e.clientY > dropZoneRect.bottom
            ) {
                props.onChatRemoved(draggingId)
            }
          }
          setDraggingId(null);
        };
        document.addEventListener('dragend', handleDragEnd);
        return () => {
          document.removeEventListener('dragend', handleDragEnd);
        };
      }, [dispatch, draggingId, dropZoneRef, chatSessions, removeChat, props.onChatRemoved, props.onChatSelect]);
    
    const isBeingDragged = draggingId === props.chat.id;
    return enableEdit ? 
        <input
            type="text"
            value={currentChatName}
            onChange={(e) => {
                setCurrentChatName(e.target.value)
            }}
            onBlur={onUpdateEvent}
            onKeyDown={onUpdateEvent}
            className="z-10 px-2 py-1 m-2 rounded text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
        />: 
        <>
         <button
            draggable
            onDragStart={(e) => {
                setDraggingId(props.chat.id);
                e.dataTransfer.setData('text/plain', currentChatName);
                e.dataTransfer.effectAllowed = 'move';
            }}
            onDoubleClick={(e) => {
                setEnableEdit(true)
            }}
            className={`z-10 px-2 py-1 m-2 rounded text-sm font-medium cursor-move whitespace-nowrap ${
                currentSessionId === props.chat.id 
                ? 'bg-gray-200 text-gray-900' 
                : 'text-gray-700 hover:bg-gray-100'
            } ${isBeingDragged ? 'opacity-50' : ''}`}
            onClick={() => props.onChatSelect(session.id)}
            title={session.directory ? `Folder: ${session.directory}` : ''}
            >
            {session.name}
        </button>
        <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="absolute inset-0 bg-red-200 dark:bg-red-800 transition-opacity duration-300 ease-in-out h-[48px]"
            style={{ opacity: draggingId ? 0.5 : 0, pointerEvents: draggingId ? 'auto' : 'none' }}
        ></div>
        </>
       
}