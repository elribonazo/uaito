"use client";
import "react-toastify/dist/ReactToastify.css";

import { useCallback, useEffect, useState } from "react";
import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import SpaceBackground from "@/components/SpaceBackground";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import { AnimatedText } from "@/components/AnimatedText";
import { TokenCounter } from "@/components/TokenCounter";
import { useMountedApp } from "@/redux/store";
import { signOut } from "next-auth/react";
import {
	ArrowRightEndOnRectangleIcon,
	UserIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ModelSelector } from "@/components/ModelSelector";
import { LLMProvider } from "@uaito/sdk";
import {
	initializeProvider,
	setProvider,
	setSelectedModel,
	createNewChat,
	setActiveChat,
	deleteChat,
	renameChat,
	loadChatsFromStorage,
	deleteAllChats,
	clearOldChats,
} from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { ChatSidebar } from "@/components/ChatSidebar";
import { STORAGE_CONFIG } from "@/config/storage";

const InputComponent = dynamic(() => import("@/components/InputComponent"), {
	ssr: false,
});

const Provider = dynamic(() => import("@/components/Provider"), {
	ssr: false,
});

const Chat: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ enabledProviders }) => {
	const dispatch = useDispatch();
	const agent = "orquestrator";
	const [selectedModel, setSelectedModelState] = useState<string>("");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const {
		user: { provider, downloadProgress, usage, chats, activeChatId, chatOrder, theme },
	} = useMountedApp();

	const webGPU =
		provider === LLMProvider.Local || provider === LLMProvider.LocalImage;
	const isDownloading =
		webGPU && downloadProgress !== null && downloadProgress < 100;

	// Track if we've already initialized to avoid re-running the logic
	const [hasInitialized, setHasInitialized] = useState(false);

	useEffect(() => {
		dispatch(initializeProvider());
		dispatch(loadChatsFromStorage());
	}, [dispatch]);

	// Handle provider initialization and validation
	useEffect(() => {
		if (hasInitialized || enabledProviders.length === 0) return;
	
		if (!provider || !enabledProviders.includes(provider)) {
		  dispatch(setProvider(enabledProviders[0]));
		}
		setHasInitialized(true);
	  }, [provider, enabledProviders, hasInitialized, dispatch]);

	// Create default chat if none exist
	useEffect(() => {
		if (provider && selectedModel && Object.keys(chats).length === 0) {
			dispatch(createNewChat({ provider, model: selectedModel }));
		}
	}, [provider, selectedModel, chats, dispatch]);

	// Auto-cleanup old chats when threshold is exceeded
	useEffect(() => {
		const chatCount = Object.keys(chats).length;
		if (chatCount > STORAGE_CONFIG.AUTO_CLEANUP_THRESHOLD) {
			console.log(`Chat count (${chatCount}) exceeded threshold (${STORAGE_CONFIG.AUTO_CLEANUP_THRESHOLD}). Triggering auto-cleanup...`);
			dispatch(clearOldChats({ keepCount: STORAGE_CONFIG.AUTO_CLEANUP_KEEP_COUNT }));
		}
	}, [chats, dispatch]);

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

	const handleProviderSelect = useCallback((selectedProvider: LLMProvider) => {
		dispatch(setProvider(selectedProvider));
	}, [dispatch]);

	const handleModelSelect = useCallback((model: string) => {
		setSelectedModelState(model);
		dispatch(setSelectedModel(model));
	}, [dispatch]);

	const handleNewChat = () => {
		if (provider && selectedModel) {
			dispatch(createNewChat({ provider, model: selectedModel }));
			setSidebarOpen(false);
		}
	};

	const handleSelectChat = (chatId: string) => {
		dispatch(setActiveChat(chatId));
		setSidebarOpen(false);
	};

	const handleDeleteChat = (chatId: string) => {
		dispatch(deleteChat(chatId));
	};

	const handleRenameChat = (chatId: string, name: string) => {
		dispatch(renameChat({ id: chatId, name }));
	};

	const handleDeleteAllChats = useCallback(() => {
		dispatch(deleteAllChats());
	}, [dispatch]);

	return (
		<div className="bg-background w-full h-[100dvh] flex overflow-hidden">
			{/* Chat Sidebar */}
			<ChatSidebar
				isOpen={sidebarOpen}
				chats={chats}
				chatOrder={chatOrder}
				activeChatId={activeChatId}
				onToggle={() => setSidebarOpen(!sidebarOpen)}
				onNewChat={handleNewChat}
				onSelectChat={handleSelectChat}
				onDeleteChat={handleDeleteChat}
				onRenameChat={handleRenameChat}
				onDeleteAllChats={handleDeleteAllChats}
			/>

			{/* Main Content Area */}
			<div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-16'}`}>
				<header className="w-full shadow-sm h-14 sm:h-16 sticky top-0 right-0 left-0 z-40 bg-background/80 backdrop-blur-sm border-b border-muted">
					<div className="w-full h-full flex flex-row items-center justify-between px-2 sm:px-4">
						<div className="flex items-center gap-2 sm:gap-3">
							<button
								type="button"
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className={`p-1.5 sm:p-2 hover:bg-surface-hover rounded-lg transition-colors lg:hidden ${sidebarOpen ? "hidden" : "block"}`}
								title="Toggle sidebar"
							>
								<Bars3Icon className="h-5 w-5 text-secondary-text" />
							</button>
							<h1 className="text-lg sm:text-2xl font-bold flex-shrink-0">
								<Link href="/chat">
									<AnimatedText />
								</Link>
							</h1>
						</div>
						<div className="flex-grow min-w-0"></div>
						<div className="flex flex-row items-center space-x-1 sm:space-x-2 lg:space-x-3">
							{!sidebarOpen && (
								<>
									{isDownloading && (
										<div className="hidden md:flex items-center space-x-2">
											<span className="text-primary-text text-sm">
												Downloading Model:
											</span>
											<div className="w-32 bg-surface rounded-full h-2.5">
												<div
													className="bg-primary h-2.5 rounded-full"
													style={{ width: `${downloadProgress}%` }}
												></div>
											</div>
											<span className="text-primary-text text-sm">
												{downloadProgress}%
											</span>
										</div>
									)}
									<TokenCounter input={usage.input} output={usage.output} />
									{provider && (
										<Provider 
											value={provider} 
											onSelected={handleProviderSelect}
											enabledProviders={enabledProviders}
										/>
									)}
									<ModelSelector onSelected={handleModelSelect} />
									<Link
										href={"/dashboard"}
										className="bg-surface hover:bg-slate-700 text-primary-text font-bold p-1.5 sm:p-2 rounded-lg transition duration-300 flex items-center justify-center border border-muted flex-shrink-0"
									>
										<UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
									</Link>
									<button
										onClick={async () => {
											await signOut({ redirect: false });
											// Redirect to a logout endpoint that will handle Keycloak logout
											window.location.href = '/api/auth/logout-keycloak';
										}}
										type="button"
										className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg transition duration-300 flex items-center justify-center flex-shrink-0"
									>
										<ArrowRightEndOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
									</button>
								</>
							)}
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
						/>
					)}
					{provider && !activeChatId && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<p className="text-secondary-text mb-4">No chat selected</p>
								<button
									type="button"
									onClick={handleNewChat}
									className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all duration-200"
								>
									Create New Chat
								</button>
							</div>
						</div>
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
	const session = await getServerSession(context.req, context.res, authOptions);
	if (!session || !session.user?.email) {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}

	// Check which providers are enabled based on environment variables
	const enabledProviders: LLMProvider[] = [];
	
	// Check for API keys
	if (process.env.ANTHROPIC_API_KEY) {
		enabledProviders.push(LLMProvider.Anthropic);
	}
	if (process.env.OPENAI_API_KEY) {
		enabledProviders.push(LLMProvider.OpenAI);
	}
	if (process.env.GROK_API_KEY) {
		enabledProviders.push(LLMProvider.Grok);
	}
	if (process.env.GOOGLE_API_KEY) {
		enabledProviders.push(LLMProvider.Google);
	}
	
	// Local providers don't need API keys - always enabled
	enabledProviders.push(LLMProvider.Local);
	
	return {
		props: {
			enabledProviders,
		},
	};
}

export default Chat;
