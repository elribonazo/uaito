"use client";
import "react-toastify/dist/ReactToastify.css";

import { useCallback, useEffect, useState } from "react";
import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import { AnimatedText } from "@/components/AnimatedText";
import { useMountedApp } from "@/redux/store";
import Link from "next/link";
import { ModelSelector } from "@/components/ModelSelector";
import { LLMProvider } from "@uaito/sdk";
import {
	initializeProvider,
	setProvider,
	setSelectedModel,
	createNewChat,
	deleteAllChats,
} from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { CpuChipIcon, BoltIcon, PhotoIcon } from "@heroicons/react/24/outline";

const InputComponent = dynamic(() => import("@/components/InputComponent"), {
	ssr: false,
});

const WebGPU: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
	const dispatch = useDispatch();
	const agent = "orquestrator";
	const [selectedModel, setSelectedModelState] = useState<string>("");
	const {
		user: { provider, activeChatId, theme, chats },
	} = useMountedApp();

	// Track if we've already initialized to avoid re-running the logic
	const [hasInitialized, setHasInitialized] = useState(false);

	// Clear all persisted chats on mount and unmount to keep session ephemeral
	useEffect(() => {
		dispatch(deleteAllChats());
		
		return () => {
			// Clean up chats when leaving the page
			dispatch(deleteAllChats());
		};
	}, [dispatch]);

	useEffect(() => {
		dispatch(initializeProvider());
	}, [dispatch]);

	// Set provider to Local for public page
	useEffect(() => {
		if (hasInitialized) return;
	
		if (!provider || provider !== LLMProvider.Local) {
		  dispatch(setProvider(LLMProvider.Local));
		}
		setHasInitialized(true);
	}, [provider, hasInitialized, dispatch]);

	// Create a single ephemeral chat session (not persisted)
	useEffect(() => {
		if (provider && selectedModel && !activeChatId) {
			dispatch(createNewChat({ provider, model: selectedModel }));
		}
	}, [provider, selectedModel, activeChatId, dispatch]);

	useEffect(() => {
		// Add no-scroll class to body to prevent scrolling on mobile
		document.body.classList.add('no-scroll');
		
		return () => {
			// Clean up when component unmounts
			document.body.classList.remove('no-scroll');
		};
	}, []);

	// Sync theme with DOM
	useEffect(() => {
		const root = document.documentElement;
		
		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			if (systemTheme === 'dark') {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}
		} else {
			if (theme === 'dark') {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}
		}
	}, [theme]);

	const handleModelSelect = useCallback((model: string) => {
		setSelectedModelState(model);
		dispatch(setSelectedModel(model));
	}, [dispatch]);

    const webgpuExamplePrompts = [
        {
            icon: CpuChipIcon,
            text: "Generate a random picture of a pomsky dog dressing as a crypto bro, doing heavy lifting in the gym.",
            shortText: "Generate random picture"
        },
        {
            icon: BoltIcon,
            text: "Explain quantum computing in a way that is easy to understand.",
            shortText: "Explain quantum computing"
        },
		{
			icon: PhotoIcon,
			text: "Create a random story with 3 chapters, each chapter is composed of a title and content.",
			shortText: "Create a story"
		},
    ];

	return (
		<div className="bg-background w-full h-[100dvh] flex overflow-hidden">
			{/* Main Content Area - No Sidebar */}
			<div className="flex flex-col flex-1">
				<header className="w-full shadow-sm h-14 sm:h-16 sticky top-0 right-0 left-0 z-40 bg-background/80 backdrop-blur-sm border-b border-muted">
					<div className="w-full h-full flex flex-row items-center justify-between px-2 sm:px-4">
						<div className="flex items-center gap-2 sm:gap-3">
							<h1 className="text-lg sm:text-2xl font-bold flex-shrink-0">
								<Link href="/webgpu">
									<AnimatedText />
								</Link>
							</h1>
						</div>
						<div className="flex-grow min-w-0"></div>
						<div className="flex flex-row items-center space-x-1 sm:space-x-2 lg:space-x-3">
							<ModelSelector onSelected={handleModelSelect} />
						</div>
					</div>
				</header>

				<main className="flex-1 w-full relative bg-background min-h-0 overflow-hidden transition-colors">
					{provider && activeChatId && (
						<InputComponent
							chatId={activeChatId}
							agent={agent}
							provider={provider}
							model={selectedModel}
							examplePrompts={webgpuExamplePrompts}
						/>
					)}
					<ToastContainer
						autoClose={5000}
						hideProgressBar={true}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme={
							typeof document !== "undefined" &&
							document.documentElement.classList.contains("dark")
								? "dark"
								: "light"
						}
					/>
				</main>
			</div>
		</div>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// Public page - no authentication required
	return {
		props: {},
	};
}

export default WebGPU;

