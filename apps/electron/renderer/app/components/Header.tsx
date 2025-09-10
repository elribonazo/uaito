import React, { useState, useEffect } from 'react';
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import { useMountedApp } from "../redux/store";
import { removeChat, setChatId } from "../redux/userSlice";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import DarkModeToggle from "./DarkModeToggle";
import { EditChatInput } from "./EditChatInput";


const AnimatedText: React.FC<{enableChats: boolean}> = (props) => {
    const enableChats = props.enableChats !== undefined ? props.enableChats : true;
    const [visibleLeftLetters, setVisibleLeftLetters] = useState(0);
    const [visibleRightLetters, setVisibleRightLetters] = useState(0);
    const leftText = "UAITO.io";
    const rightText = "by @elribonazo";
    const colors = [
      '#00ffff', '#00ff00', '#ffff00', '#ff8000', '#ff0000',
      '#00ccff', '#00dd00', '#ffdd00', '#ff6600', '#ff3333',
      '#0099ff', '#33cc33', '#ffcc00', '#ff4d00', '#ff6666',
      '#66ccff', '#66ff66', '#ffff66', '#ffaa66', '#ff9999'
    ];
  
    useEffect(() => {
      if (visibleLeftLetters < leftText.length) {
        const timer = setTimeout(() => {
          setVisibleLeftLetters(visibleLeftLetters + 1);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [visibleLeftLetters]);
  
    useEffect(() => {
      if (visibleRightLetters < rightText.length) {
        const timer = setTimeout(() => {
          setVisibleRightLetters(visibleRightLetters + 1);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [visibleRightLetters]);
  
    const AnimatedSpan = ({ text, visibleLetters, isRight }) => (
      <span className={`inline-block ${isRight ? 'text-right' : 'text-left'}`}>
        {text.split('').map((letter, index) => (
          <span
            key={index}
            className={`font-bold transition-all duration-300 ${
              isRight ? 'text-xs' : 'text-2xl'
            } ${index < visibleLetters ? 'opacity-100' : 'opacity-0'}`}
            style={{
              color: colors[index % colors.length],
              textShadow: `0 0 10px ${colors[index % colors.length]}`,
              animation: index < visibleLetters ? 'colorShift 4s infinite' : 'none',
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    );
  
    return (
      <div className="flex justify-between items-center w-full">
        <div className="flex-shrink-0">
          <AnimatedSpan text={leftText} visibleLetters={visibleLeftLetters} isRight={false} />
        </div>
        {
            !enableChats ? <div className="flex-shrink-0 ml-4 mr-5">
            <AnimatedSpan text={rightText} visibleLetters={visibleRightLetters} isRight={true} />
          </div>: null
        }
      </div>
    );
  };

interface HeaderProps {
    onChatCreate?: () => Promise<void>,
    enableChats?: boolean
}

export const Header: React.FC<HeaderProps> = (props) => {
    const app = useMountedApp()

    const enableChats = props.enableChats !== undefined ? props.enableChats : true;
    const chatSessions = app.user.chats;

    return (
        <header className="shadow-sm flex h-[48px] bg-white dark:bg-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl h-full flex-grow mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center space-x-4 flex-grow">
                    <StarIcon className="text-gray-900 dark:text-white h-5 w-5" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-grow">
                        <AnimatedText enableChats={enableChats}/>
                    </h1>
                    {enableChats && chatSessions.length > 0 ? (
                        <button
                            className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                            onClick={() => {
                                if (props.onChatCreate) {
                                    props.onChatCreate()
                                }
                            }}
                        >
                            <PlusIcon className="h-5 w-5" /> 
                        </button>
                    ) : null}
                </div>
                {enableChats ? (
                    <div className="text-black dark:text-white flex items-center relative overflow-x-auto">
                        {chatSessions.map((session, i) => 
                            <EditChatInput
                                key={`edit-chat-sessions-${session.id}`}
                                chat={session}
                                onChatRemoved={(selectedChat) => {
                                    app.dispatch(removeChat({chatId: selectedChat}))
                                }}
                                onChatSelect={(selectedChat) => {
                                    app.dispatch(setChatId(selectedChat))
                                }}
                            />
                        )}
                    </div>
                ) : null}
                <div className="flex items-center space-x-4">
                    <DarkModeToggle />
                </div>
            </div>
        </header>
    );
}

export default Header;