'use client'
import type {  TextBlock } from "@uaito/sdk";
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from "react";
import { Parallax } from 'react-scroll-parallax';
import dynamic from "next/dynamic";
import { ToolComponent } from "./ToolComponent";
import { FeaturedChat, FeatureSectionProps } from "@/redux/userSlice";



const Markdown = dynamic(() => import('@/components/Markdown').then((e) => e.Markdown), {
    ssr: false,
});

// Custom hook for throttling
const useThrottle = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
  const [lastCall, setLastCall] = useState(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      callback(...args);
      setLastCall(now);
    }
  }, [callback, delay, lastCall]);
};


export const FeatureSection: React.FC<Partial<FeatureSectionProps>> = ({ title, chats, reverse = false, startScroll, speed, preview }) => {
    const [chatMessages, setChatMessages] = useState<FeaturedChat[]>(chats!.map((chat) => ({...chat, visibleContent: chat.visibleContent ?? []})));
    const sectionRef = useRef<HTMLDivElement>(null);

    const updateVisibility = useCallback((scrollPercentage: number) => {
        const totalContentLength = chatMessages.reduce((acc, msg) => {
            return acc + msg.content.reduce((contentAcc, contentItem) => {
                if (contentItem.type === "text") {
                    return contentAcc + (contentItem as TextBlock).text.length;
                }
                if (contentItem.type === "tool_result") {
                    return contentAcc + contentItem.content!.reduce((all, current) => {
                        if (current.type === "text") {
                            return all + current.text.length
                        }
                        return all + 1
                    }, 0)
                }
                return contentAcc + 1; // Count non-text blocks as 1 unit
            }, 0);
        }, 0);

        const visibleContentLength = Math.floor(totalContentLength * scrollPercentage);
        let accumulatedLength = 0;
        const updatedChatMessages = chatMessages.map(msg => {
            const visibleContent = msg.content.reduce((visibleAcc, contentItem) => {
                if (accumulatedLength >= visibleContentLength) {
                    return visibleAcc;
                }
                if (contentItem.type === "text") {
                    const textBlock = contentItem as TextBlock;
                    const remainingLength = visibleContentLength - accumulatedLength;
                    const visibleText = textBlock.text.slice(0, remainingLength);

                    accumulatedLength += visibleText.length;

                    const textLines = visibleText.split("\r\n")

                    return [...visibleAcc, ...textLines.map((text) => ({ ...textBlock, text: text }))];
                } else if (contentItem.type === "tool_result") {
                    accumulatedLength += contentItem.content!.reduce((all, current) => {
                        if (current.type === "text") {
                            return all + current.text.length
                        }
                        return all + 1
                    }, 0)

                    return [...visibleAcc, contentItem];
                    
                } else {
                    accumulatedLength += 1;
                    return [...visibleAcc, contentItem];
                }
            }, [] as FeaturedChat['content']);
            return {
                ...msg,
                visibleContent,
            };
        });

        setChatMessages(updatedChatMessages);
    }, [chatMessages]);

    const handleScroll = useThrottle(() => {
        if (sectionRef.current) {
            const sectionTop = sectionRef.current.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const scrollPercentage = Math.max(0, Math.min(1, 1 - sectionTop / (windowHeight-375)));
            updateVisibility(scrollPercentage);
        }
    }, 100);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const hasContent = chatMessages.length > 0 && chatMessages.find((c) => c.visibleContent.length >0);

    return (
        <Parallax className="flex flex-grow" shouldAlwaysCompleteAnimation={true} >
            
            <div ref={sectionRef} className={`container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>
                <div className="w-full my-8 lg:mb-0 transform translate-y-0 will-change-transform">
                    <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[3vw] text-white text-left mb-5">{title}</h2>
                    {hasContent ? (
                        <div className="bg-gray-100 rounded-lg p-4 w-full"> 
                            {chatMessages.map((msg, index) => (
                                (msg.visibleContent ?? []).length > 0 ? (
                                    

                                    <div key={index} className={`mt-5 flex items-start justify-start`}>
                                        {msg.role === 'assistant' &&  msg.visibleContent.length && !msg.visibleContent.some((t) => t.type.includes("tool")) && (
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                                                <Image src="/UAITO.png" alt="UAITO Logo" width={32} height={32} className="object-cover w-full h-full" />
                                            </div>
                                        )}
                                       {
                                        msg.visibleContent.find((item) => item.type === "text") ? 
                                        <div className={`max-w-[calc(100%-40px)] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'}`}>
                                        {
                                            (msg.visibleContent ?? []).map((content,  i) => {
                                                debugger;
                                                return <Markdown key={'markdown'+index+i} searchText={''}>
                                                {(content as TextBlock).text}
                                            </Markdown>
                                            })
                                        }
                                        
                                        </div> 
                                        : 

                                        (msg.visibleContent ?? []).map((content, i) => {
                                            debugger;
                                            if (content.type === "text") {
                                                return <div key={'markdown-2-'+index+i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'}`}>
                                                    <Markdown searchText={''}>
                                                        {(content as TextBlock).text}
                                                    </Markdown>
                                                </div>
                                            }
                                            if (content.type === "tool_result"){
                                                return <ToolComponent key={'markdown-code-'+index+i}  messageId="234" {...content} />
                                            }
                                            return null
                                        })
                                       }
                                       

                                        
                                    
                                    </div>

                                  
                                ): null
                            ))}
                            {preview}
                        </div>
                    ):<div className="bg-gray-100 rounded-lg p-4 w-full">
                    <div className="flex flex-col items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4">
                        <Image src="/UAITO.png" alt="UAITO Logo" width={32} height={32} className="object-cover w-full h-full" />

                        </div>
                        <p className="text-gray-600 font-medium">Agent is streaming the response</p>
                    </div>
                </div>}
                </div>
                
            </div>
            
        </Parallax>
    );
};


