"use client";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";
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
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ModelSelector } from "@/components/ModelSelector";
import { LLMProvider } from "@uaito/sdk";
import {
	initializeProvider,
	setProvider,
	setSelectedModel,
} from "@/redux/userSlice";
import { useDispatch } from "react-redux";

const InputComponent = dynamic(() => import("@/components/InputComponent"), {
	ssr: false,
});

const Provider = dynamic(() => import("@/components/Provider"), {
	ssr: false,
});

const Chat: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
	const dispatch = useDispatch();
	const agent = "orquestrator";
	const [selectedModel, setSelectedModelState] = useState<string>("");
	const {
		user: { provider, downloadProgress, usage },
	} = useMountedApp();
	const webGPU =
		provider === LLMProvider.Local || provider === LLMProvider.LocalImage;
	const isDownloading =
		webGPU && downloadProgress !== null && downloadProgress < 100;

	useEffect(() => {
		dispatch(initializeProvider());
	}, [dispatch]);

	const handleProviderSelect = (selectedProvider: LLMProvider) => {
		dispatch(setProvider(selectedProvider));
	};

	const handleModelSelect = (model: string) => {
		setSelectedModelState(model);
		dispatch(setSelectedModel(model));
	};

	return (
		<div className="bg-background w-full h-screen flex flex-col">
			<SpaceBackground />

			<header className="w-full shadow-sm h-14 sm:h-16 sticky top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-sm border-b border-muted">
				<div className="w-full h-full flex flex-row items-center justify-between px-2 sm:px-4">
          <h1 className="text-lg sm:text-2xl font-bold flex-shrink-0">
            <Link href="/">
              <AnimatedText />
            </Link>
          </h1>
				<div className="flex-grow min-w-0"></div>
				<div className="flex flex-row items-center space-x-1 sm:space-x-2 lg:space-x-3">
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
						<Provider value={provider} onSelected={handleProviderSelect} />
					)}
					<ModelSelector onSelected={handleModelSelect} />
					<Link
						href={"/dashboard"}
						className="bg-surface hover:bg-slate-700 text-primary-text font-bold p-1.5 sm:p-2 rounded-lg transition duration-300 flex items-center justify-center border border-muted flex-shrink-0"
					>
						<UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
					</Link>
					<button
						onClick={() => signOut()}
						type="button"
						className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg transition duration-300 flex items-center justify-center flex-shrink-0"
					>
						<ArrowRightEndOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
					</button>
				</div>

        </div>

			</header>

			<main className="flex-1 w-full relative bg-gray-900">
				{provider && (
					<InputComponent
						agent={agent}
						provider={provider}
						model={selectedModel}
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

	return {
		props: {},
	};
}

export default Chat;
