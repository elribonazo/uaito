"use client"
import React from 'react';
import InputComponent from './components/InputComponent';
import { useMountedApp } from './redux/store';
import { Header } from './components/Header';
import { createChat } from './redux/userSlice';

function Chat() {

  const app = useMountedApp()
  const chatSessions = app.user.chats;
  const onChatCreate = async () => {
    const result = await (window as any).electron.dialog();
    if (result.canceled) {
      console.log('Folder selection was cancelled');
      return;
    }
    const folderPath = result.filePaths[0];
    const newSessionId = `chat-${crypto.randomUUID()}`;
    app.dispatch(createChat({directory: folderPath, name: newSessionId}))
  };


  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
      <Header onChatCreate={onChatCreate} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {chatSessions.length > 0 ? (
          <div className="shadow-lg rounded-lg ">
            {chatSessions.map((session) => (
              <InputComponent 
                key={`session-${session.id}`}
                folderPath={session.directory} 
                chat={session} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">No chat sessions available</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Start a new chat to begin!</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onChatCreate}
            >
              Start New Chat
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Chat;