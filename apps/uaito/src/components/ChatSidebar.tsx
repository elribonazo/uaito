import { useState } from 'react';
import {
  PlusIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import type { Chat } from '@/redux/userSlice';
import { formatDistanceToNow } from 'date-fns';
import { ThemeToggle } from './ThemeToggle';

interface ChatSidebarProps {
  isOpen: boolean;
  chats: Record<string, Chat>;
  chatOrder: string[];
  activeChatId: string | null;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, name: string) => void;
  onDeleteAllChats: () => void;
}

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(chat.name);
  const [showDelete, setShowDelete] = useState(false);

  const handleRename = () => {
    if (editName.trim() && editName !== chat.name) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditName(chat.name);
      setIsEditing(false);
    }
  };

  const lastMessagePreview = chat.messages.length > 0
    ? chat.messages[chat.messages.length - 1].content[0]?.type === 'text'
      ? (chat.messages[chat.messages.length - 1].content[0] as { type: 'text'; text: string }).text.slice(0, 50)
      : 'Media message'
    : 'No messages yet';

  const handleClick = () => {
    if (!isEditing) {
      onSelect();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: This div contains interactive children (input, buttons) so it can't be a button element
    <div
      role="button"
      tabIndex={0}
      className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-surface-hover border border-transparent'
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleInputKeyDown}
              className="w-full px-2 py-1 bg-surface border border-border rounded text-sm text-primary-text focus:outline-none focus:border-primary"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex items-center gap-2">
              <ChatBubbleLeftIcon className="h-4 w-4 text-accent flex-shrink-0" />
              <h3 className="text-sm font-medium text-primary-text truncate">
                {chat.name}
              </h3>
            </div>
          )}
          <p className="text-xs text-tertiary-text truncate mt-1">
            {lastMessagePreview}
          </p>
          <p className="text-xs text-tertiary-text mt-1">
            {formatDistanceToNow(chat.updatedAt, { addSuffix: true })}
          </p>
        </div>
        
        {showDelete && !isEditing && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 hover:bg-surface rounded transition-colors"
              title="Rename chat"
            >
              <PencilIcon className="h-4 w-4 text-secondary-text hover:text-primary-text" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${chat.name}"?`)) {
                  onDelete();
                }
              }}
              className="p-1 hover:bg-red-500/10 rounded transition-colors"
              title="Delete chat"
            >
              <TrashIcon className="h-4 w-4 text-secondary-text hover:text-red-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  chats,
  chatOrder,
  activeChatId,
  onToggle,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onDeleteAllChats,
}) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-background border-r border-border z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isOpen ? 'w-80' : 'lg:w-16'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {isOpen ? (
              <>
                <h2 className="text-lg font-semibold text-primary-text">Chats</h2>
                <button
                  type="button"
                  onClick={onToggle}
                  className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors"
                  title="Close sidebar"
                >
                  <XMarkIcon className="h-5 w-5 text-secondary-text" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors mx-auto"
                title="Open sidebar"
              >
                <Bars3Icon className="h-5 w-5 text-secondary-text" />
              </button>
            )}
          </div>

          {/* New Chat Button */}
          <div className={`p-4 ${!isOpen ? 'flex justify-center' : ''}`}>
            <button
              type="button"
              onClick={onNewChat}
              className={`flex items-center justify-center bg-primary hover:bg-primary-hover text-white transition-all duration-200 ${
                isOpen 
                  ? 'w-full gap-2 px-4 py-2 rounded-lg' 
                  : 'w-10 h-10 rounded-full'
              }`}
              title="New chat"
            >
              <PlusIcon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">New Chat</span>}
            </button>
          </div>

          {/* Chat List */}
          {isOpen ? (
            <div className="flex-1 overflow-y-auto px-4 space-y-2">
              {chatOrder.length === 0 && (
                <div className="text-center text-secondary-text text-sm py-8">
                  No chats yet. Create one to get started!
                </div>
              )}
              {chatOrder.map((chatId) => {
                const chat = chats[chatId];
                if (!chat) return null;
                return (
                  <ChatItem
                    key={chatId}
                    chat={chat}
                    isActive={activeChatId === chatId}
                    onSelect={() => onSelectChat(chatId)}
                    onDelete={() => onDeleteChat(chatId)}
                    onRename={(name) => onRenameChat(chatId, name)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex-1 px-2 space-y-2">
              {chatOrder.slice(0, 5).map((chatId) => {
                const chat = chats[chatId];
                if (!chat) return null;
                return (
                  <button
                    key={chatId}
                    type="button"
                    onClick={() => onSelectChat(chatId)}
                    className={`group relative w-full p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                      activeChatId === chatId
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-surface-hover border border-transparent'
                    }`}
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 text-accent" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-border text-primary-text text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        {chat.name}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
           <div className="p-4 border-t border-border mt-auto space-y-3">
    {isOpen && (
      <div className="mb-3">
        <ThemeToggle />
      </div>
    )}
    {isOpen ? (
        <button
            type="button"
            onClick={() => {
                if (window.confirm('Are you sure you want to delete all chats?')) {
                  onDeleteAllChats();
                }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-red-500/10 text-secondary-text hover:text-red-400 transition-colors duration-200 border border-border hover:border-red-500/30"
            title="Delete all chats"
        >
            <TrashIcon className="h-5 w-5" />
            <span>Delete All Chats</span>
        </button>
    ) : (
        <button
            type="button"
            onClick={() => {
                if (window.confirm('Are you sure you want to delete all chats?')) {
                  onDeleteAllChats();
                }
            }}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-surface hover:bg-red-500/10 text-secondary-text hover:text-red-400 transition-colors duration-200 border border-border hover:border-red-500/30"
            title="Delete all chats"
        >
            <TrashIcon className="h-5 w-5" />
        </button>
    )}
</div>
        </div>
      </aside>
    </>
  );
};

