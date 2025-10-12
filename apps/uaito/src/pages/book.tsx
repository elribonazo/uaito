import { LLMProvider } from "@uaito/sdk";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { AnimatedText } from "@/components/AnimatedText";
import Link from "next/link";
import { useState, useMemo } from "react";
import { moods, colorSchemes } from "@/ai/agents/storybook/constants";
import { ImageUpload } from "@/components/storybook/ImageUpload";
import { StoryForm } from "@/components/storybook/StoryForm";
import { GenerationProgress } from "@/components/storybook/GenerationProgress";

const Test: React.FC = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);

	// Story customization fields
	const [kidName, setKidName] = useState<string>("Alex");
	const [kidGender, setKidGender] = useState<string>("boy");
	const [kidLikes, setKidLikes] = useState<string>("dinosaurs, space, drawing");
	const [mood, setMood] = useState<string>(Object.keys(moods)[1]);
	const [colorScheme, setColorScheme] = useState<string>(Object.keys(colorSchemes)[0]);
	const [promptTemplate, setPromptTemplate] = useState<string>("cartoon");
	const [customPrompt, setCustomPrompt] = useState<string>("");
	const [printSize, setPrintSize] = useState<string>("book");
	const [numChapters, setNumChapters] = useState<number>(3);
	const [age, setAge] = useState<number>(6);

	const isFormValid = useMemo(() => {
		return (
			selectedFile &&
			kidName.trim() !== "" &&
			kidGender.trim() !== "" &&
			kidLikes.trim() !== ""
		);
	}, [selectedFile, kidName, kidGender, kidLikes]);

	const handleFileSelect = (file: File) => {
		setSelectedFile(file);
	};

	const handleGenerateStorybook = async () => {
		if (!isFormValid) {
			alert("Please upload an image and fill in all character details before generating.");
			return;
		}

		setIsGenerating(true);

		try {
			const formData = new FormData();
			formData.append("file", selectedFile!, selectedFile!.name);
			formData.append("kidName", kidName);
			formData.append("kidGender", kidGender);
			formData.append("kidLikes", kidLikes);
			formData.append("mood", mood);
			formData.append("colorScheme", colorScheme);
			formData.append(
				"style",
				promptTemplate === "custom" ? customPrompt : promptTemplate,
			);
			formData.append("printSize", printSize);
			formData.append("numChapters", numChapters.toString());
			formData.append("age", age.toString());

			const response = await fetch("/api/openai/storybook_gen", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ 
						error: "Unknown error",
						failureStep: "Unknown",
						details: `Server returned status ${response.status}` 
					}));
				
				const errorMsg = errorData.failureStep 
					? `${errorData.failureStep}: ${errorData.details}`
					: errorData.error || `Failed with status ${response.status}`;
				
				throw new Error(errorMsg);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `storybook-${kidName.replace(/\s+/g, "-")}-${Date.now()}.pdf`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			alert("✅ Storybook generated successfully! The PDF has been downloaded to your downloads folder.");
		} catch (error) {
			console.error("Error generating storybook:", error);
			const errorMessage = (error as Error).message;
			alert(`❌ Failed to generate storybook:\n\n${errorMessage}\n\nPlease try again or check the console for more details.`);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="bg-background w-full h-[100dvh] flex overflow-hidden">
			<div className="flex flex-col flex-1 transition-all duration-300">
				<header className="w-full shadow-sm h-14 sm:h-16 sticky top-0 right-0 left-0 z-40 bg-background/80 backdrop-blur-sm border-b border-muted">
					<div className="w-full h-full flex flex-row items-center justify-between px-2 sm:px-4">
						<div className="flex items-center gap-2 sm:gap-3">
							<h1 className="text-lg sm:text-2xl font-bold flex-shrink-0">
								<Link href="/chat">
									<AnimatedText />
								</Link>
							</h1>
						</div>
						<div className="flex-grow min-w-0"></div>
					</div>
				</header>
				<main className="flex-1 w-full relative bg-background min-h-0 overflow-auto transition-colors">
					<div className="container mx-auto p-4 sm:p-6">
						{isGenerating ? (
							<GenerationProgress />
						) : (
							<div className="space-y-8">
								<StoryForm
									kidName={kidName}
									setKidName={setKidName}
									kidGender={kidGender}
									setKidGender={setKidGender}
									kidLikes={kidLikes}
									setKidLikes={setKidLikes}
									mood={mood}
									setMood={setMood}
									colorScheme={colorScheme}
									setColorScheme={setColorScheme}
									promptTemplate={promptTemplate}
									setPromptTemplate={setPromptTemplate}
									customPrompt={customPrompt}
									setCustomPrompt={setCustomPrompt}
									printSize={printSize}
									setPrintSize={setPrintSize}
									numChapters={numChapters}
									setNumChapters={setNumChapters}
									age={age}
									setAge={setAge}
								/>
								<ImageUpload onFileSelect={handleFileSelect} />

								<button
									type="button"
									onClick={handleGenerateStorybook}
									disabled={!isFormValid || isGenerating}
									className={`
										w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg 
										font-semibold text-lg transition-all duration-200
										${
											!isFormValid || isGenerating
												? "bg-muted text-muted-foreground cursor-not-allowed"
												: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-xl"
										}
									`}
								>
									{isGenerating
										? "Generating..."
										: "Generate & Download Storybook PDF"}
								</button>
							</div>
						)}
					</div>
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

	const enabledProviders: LLMProvider[] = [];

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

	enabledProviders.push(LLMProvider.Local);

	return {
		props: {
			enabledProviders,
		},
	};
}

export default Test;