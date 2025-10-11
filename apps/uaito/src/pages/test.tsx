import { LLMProvider } from "@uaito/sdk";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { AnimatedText } from "@/components/AnimatedText";
import SpaceBackground from "@/components/SpaceBackground";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from "react";

const Test: React.FC = () => {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [fileName, setFileName] = useState<string>("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [promptTemplate, setPromptTemplate] = useState<string>("cartoon");
	const [customPrompt, setCustomPrompt] = useState<string>("");
	const [isGenerating, setIsGenerating] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Camera state
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [stream, setStream] = useState<MediaStream | null>(null);

	// Story customization fields
	const [storyTitle, setStoryTitle] = useState<string>("The Backyard Explorer");
	const [storyDescription, setStoryDescription] = useState<string>(
		"A story about a curious kid who discovers a hidden, magical world in their own backyard and makes new friends with talking animals.",
	);
	const [characterDescription, setCharacterDescription] = useState<string>(
		"A curious and imaginative young child with a bright smile, ready for an adventure. They are kind-hearted and love to learn new things.",
	);
	const [settingBackground, setSettingBackground] = useState<string>(
		"A seemingly ordinary backyard that holds a secret: a magical playground that appears only at sunset, with talking squirrels and glowing flowers.",
	);
	const [mood, setMood] = useState<string>("adventurous");
	const [additionalElements, setAdditionalElements] = useState<string>(
		"A secret map found in an old toy box and a friendly talking squirrel as a guide.",
	);
	const [colorScheme, setColorScheme] = useState<string>("vibrant");
	const [printSize, setPrintSize] = useState<string>("book");
	const [numChapters, setNumChapters] = useState<number>(3);
	const [age, setAge] = useState<number>(6);

	const handleFile = (file: File) => {
		if (file?.type?.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
				setFileName(file.name);
				setSelectedFile(file);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDragEnter = (e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	};

	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	};

	const handleClear = () => {
		setImagePreview(null);
		setFileName("");
		setSelectedFile(null);
		setStoryTitle("");
		setStoryDescription("");
		setCharacterDescription("");
		setSettingBackground("");
		setAdditionalElements("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	// Camera functions
	const openCamera = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' }, // Use back camera on mobile
			});
			setStream(mediaStream);
			setIsCameraOpen(true);
		} catch (error) {
			console.error("Error accessing camera:", error);
			alert("Unable to access camera. Please check permissions.");
		}
	};

	const closeCamera = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		setStream(null);
		setIsCameraOpen(false);
	};

	const takePicture = () => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const context = canvas.getContext("2d");
			if (context) {
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				canvas.toBlob(
					(blob) => {
						if (blob) {
							const file = new File([blob], `camera-capture-${Date.now()}.png`, {
								type: "image/png",
							});
							handleFile(file);
						}
						closeCamera();
					},
					"image/png",
				);
			}
		}
	};

	// Set video stream when camera opens
	useEffect(() => {
		if (isCameraOpen && videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [isCameraOpen, stream]);

	// Cleanup camera stream on unmount
	useEffect(() => {
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [stream]);

	const handleGenerateStorybook = async () => {
		if (!selectedFile) {
			alert("Please upload an image first!");
			return;
		}

		// Validate that we have at least basic story information
		if (
			!storyTitle.trim() ||
			!storyDescription.trim() ||
			!characterDescription.trim()
		) {
			alert(
				"Please fill in at least the story title, description, and character details!",
			);
			return;
		}

		setIsGenerating(true);

		try {
			// Prepare form data with all story properties
			const formData = new FormData();
			formData.append("file", selectedFile, selectedFile.name);
			formData.append("storyTitle", storyTitle);
			formData.append("storyDescription", storyDescription);
			formData.append("characterDescription", characterDescription);
			formData.append("settingBackground", settingBackground);
			formData.append("mood", mood);
			formData.append("colorScheme", colorScheme);
			formData.append("additionalElements", additionalElements);
			formData.append(
				"style",
				promptTemplate === "custom" ? customPrompt : promptTemplate,
			);
			formData.append("printSize", printSize);
			formData.append("numChapters", numChapters.toString());
			formData.append("age", age.toString());

			// Call the unified storybook generation endpoint
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

			// The response is a PDF file - download it directly
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `storybook-${storyTitle.replace(/\s+/g, "-")}-${Date.now()}.pdf`;
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

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="bg-background w-full h-[100dvh] flex overflow-hidden">
			<SpaceBackground />

			{/* Main Content Area */}
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
					<div className="container mx-auto p-4 sm:p-6 max-w-4xl">
						<h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
							Story Generation Wizard
						</h2>

						{/* Image Upload Form */}
						<div className="space-y-6">
							{/* Drag and Drop Zone */}
							<button
								type="button"
								onDragEnter={handleDragEnter}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={openFilePicker}
								className={`
									relative border-2 border-dashed rounded-lg p-8 sm:p-12 
									transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary
									w-full text-left
									${
										isDragging
											? "border-primary bg-primary/10 scale-[0.98]"
											: "border-muted hover:border-primary/50 hover:bg-muted/30"
									}
								`}
							>
								<div className="flex flex-col items-center justify-center text-center space-y-4">
									<svg
										className="w-16 h-16 text-muted-foreground"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<title>Upload icon</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
										/>
									</svg>
									<div>
										<p className="text-lg font-semibold text-foreground">
											Drag and drop your image here
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											or click to browse from your computer
										</p>
									</div>
								</div>

								{/* Hidden file input for regular file picker */}
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileInputChange}
									className="hidden"
									aria-label="Choose image file"
								/>
							</button>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-3">
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										openFilePicker();
									}}
									className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<title>Folder icon</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
										/>
									</svg>
									Choose from Files
								</button>

								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										openCamera();
									}}
									className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<title>Camera icon</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									Take Photo
								</button>
							</div>

							{/* Image Preview */}
							{imagePreview && (
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold text-foreground">
											Preview
										</h3>
										<button
											type="button"
											onClick={handleClear}
											className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<title>Clear icon</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
											Clear All
										</button>
									</div>

									<div className="bg-muted/30 border border-muted rounded-lg p-4">
										{fileName && (
											<p className="text-sm text-muted-foreground mb-3">
												<span className="font-medium">File:</span> {fileName}
											</p>
										)}
										<div className="relative w-full max-w-2xl mx-auto">
											<Image
												src={imagePreview}
												alt="Preview of uploaded image"
												width={800}
												height={600}
												className="w-full h-auto rounded-lg shadow-lg"
												unoptimized
											/>
										</div>
									</div>
								</div>
							)}

							{/* Story-Based Configuration */}
							{imagePreview && (
								<div className="space-y-6 border-t border-muted pt-6">
									<div className="flex items-center gap-2">
										<h3 className="text-2xl font-bold text-foreground">
											📖 Customize Your Story Drawing
										</h3>
									</div>
									<p className="text-sm text-muted-foreground">
										Fill in the story details below to create a personalized
										illustration that matches your narrative.
									</p>

									{/* Story Title */}
									<div className="space-y-2">
										<label
											htmlFor="story-title"
											className="text-sm font-semibold text-foreground flex items-center gap-2"
										>
											<span>📚</span> Story Title
										</label>
										<input
											id="story-title"
											type="text"
											value={storyTitle}
											onChange={(e) => setStoryTitle(e.target.value)}
											placeholder="e.g., The Amazing Adventure of Luna"
											className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
										/>
									</div>

									{/* Story Description */}
									<div className="space-y-2">
										<label
											htmlFor="story-description"
											className="text-sm font-semibold text-foreground flex items-center gap-2"
										>
											<span>📝</span> Story Description
											<span className="text-xs font-normal text-muted-foreground">
												(Main plot or theme)
											</span>
										</label>
										<textarea
											id="story-description"
											value={storyDescription}
											onChange={(e) => setStoryDescription(e.target.value)}
											placeholder="Describe the main story: What happens? What's the adventure about? What makes it special?"
											rows={3}
											className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
										/>
									</div>

									{/* Character Description */}
									<div className="space-y-2">
										<label
											htmlFor="character-description"
											className="text-sm font-semibold text-foreground flex items-center gap-2"
										>
											<span>👤</span> Character Details
											<span className="text-xs font-normal text-muted-foreground">
												(Protagonist or main character)
											</span>
										</label>
										<textarea
											id="character-description"
											value={characterDescription}
											onChange={(e) => setCharacterDescription(e.target.value)}
											placeholder="Describe the character: personality, appearance, special traits, clothing, etc."
											rows={2}
											className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
										/>
									</div>

									{/* Setting/Background */}
									<div className="space-y-2">
										<label
											htmlFor="setting-background"
											className="text-sm font-semibold text-foreground flex items-center gap-2"
										>
											<span>🌍</span> Setting & Background
											<span className="text-xs font-normal text-muted-foreground">
												(Where does it take place?)
											</span>
										</label>
										<textarea
											id="setting-background"
											value={settingBackground}
											onChange={(e) => setSettingBackground(e.target.value)}
											placeholder="Describe the location: magical forest, space station, underwater city, medieval castle, etc."
											rows={2}
											className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
										/>
									</div>

									{/* Additional Elements */}
									<div className="space-y-2">
										<label
											htmlFor="additional-elements"
											className="text-sm font-semibold text-foreground flex items-center gap-2"
										>
											<span>✨</span> Additional Elements
											<span className="text-xs font-normal text-muted-foreground">
												(Props, companions, special objects)
											</span>
										</label>
										<input
											id="additional-elements"
											type="text"
											value={additionalElements}
											onChange={(e) => setAdditionalElements(e.target.value)}
											placeholder="e.g., magical wand, pet dragon, treasure chest, glowing crystals"
											className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
										/>
									</div>

									{/* Style and Settings Row */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Art Style */}
										<div className="space-y-2">
											<label
												htmlFor="style-template"
												className="text-sm font-semibold text-foreground flex items-center gap-2"
											>
												<span>🎨</span> Art Style
											</label>
											<select
												id="style-template"
												value={promptTemplate}
												onChange={(e) => setPromptTemplate(e.target.value)}
												className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
											>
												<option value="cartoon">Cartoon - Vibrant & Fun</option>
												<option value="sketch">Pencil Sketch</option>
												<option value="watercolor">Watercolor</option>
												<option value="comic">Comic Book</option>
												<option value="anime">Anime Style</option>
												<option value="disney">Disney/Pixar</option>
												<option value="chibi">Chibi/Cute</option>
												<option value="line_art">Line Art</option>
												<option value="pop_art">Pop Art</option>
												<option value="vintage">Vintage</option>
												<option value="custom">Custom Prompt</option>
											</select>
										</div>

										{/* Mood */}
										<div className="space-y-2">
											<label
												htmlFor="mood"
												className="text-sm font-semibold text-foreground flex items-center gap-2"
											>
												<span>😊</span> Mood/Atmosphere
											</label>
											<select
												id="mood"
												value={mood}
												onChange={(e) => setMood(e.target.value)}
												className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
											>
												<option value="happy">Happy & Joyful</option>
												<option value="adventurous">Adventurous</option>
												<option value="magical">Magical</option>
												<option value="peaceful">Peaceful</option>
												<option value="heroic">Heroic</option>
												<option value="mysterious">Mysterious</option>
												<option value="playful">Playful</option>
											</select>
										</div>
									</div>

									{/* Color Scheme and Print Size Row */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Color Scheme */}
										<div className="space-y-2">
											<label
												htmlFor="color-scheme"
												className="text-sm font-semibold text-foreground flex items-center gap-2"
											>
												<span>🎨</span> Color Scheme
											</label>
											<select
												id="color-scheme"
												value={colorScheme}
												onChange={(e) => setColorScheme(e.target.value)}
												className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
											>
												<option value="vibrant">Vibrant Colors</option>
												<option value="pastel">Pastel Tones</option>
												<option value="warm">Warm Palette</option>
												<option value="cool">Cool Palette</option>
												<option value="monochrome">Black & White</option>
												<option value="neon">Neon Colors</option>
												<option value="natural">Natural/Earthy</option>
											</select>
										</div>

										{/* Print Size */}
										<div className="space-y-2">
											<label
												htmlFor="print-size"
												className="text-sm font-semibold text-foreground flex items-center gap-2"
											>
												<span>📐</span> Print Format
											</label>
											<select
												id="print-size"
												value={printSize}
												onChange={(e) => setPrintSize(e.target.value)}
												className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
											>
												<option value="poster">Poster (Large)</option>
												<option value="book">Book Illustration</option>
												<option value="card">Greeting Card</option>
												<option value="frame">Wall Frame</option>
												<option value="canvas">Canvas Print</option>
											</select>
										</div>
									</div>

									{/* Number of Chapters and Age */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Number of Chapters */}
										<div className="space-y-2">
											<label
												htmlFor="num-chapters"
												className="text-sm font-semibold text-foreground flex items-center gap-2"
											>
												<span>#️⃣</span> Number of Chapters
											</label>
											<input
												id="num-chapters"
												type="number"
												value={numChapters}
												onChange={(e) =>
													setNumChapters(parseInt(e.target.value, 10))
												}
												min="1"
												max="10"
												className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
											/>
										</div>

										{/* Age Range */}
										<div className="space-y-2">
											<label
												htmlFor="age-range"
												className="text-sm font-semibold text-foreground flex items-center gap-2"
											>
												<span>🧒</span> Target Age: {age} years old
											</label>
											<input
												id="age-range"
												type="range"
												value={age}
												onChange={(e) => setAge(parseInt(e.target.value, 10))}
												min="6"
												max="10"
												step="1"
												className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
											/>
										</div>
									</div>

									{/* Custom Prompt Override */}
									{promptTemplate === "custom" && (
										<div className="space-y-2 border-t border-muted pt-4">
											<label
												htmlFor="custom-prompt"
												className="text-sm font-semibold text-foreground flex items-center gap-2"
											>
												<span>⚙️</span> Custom Prompt
												<span className="text-xs font-normal text-muted-foreground">
													(Override all settings above)
												</span>
											</label>
											<textarea
												id="custom-prompt"
												value={customPrompt}
												onChange={(e) => setCustomPrompt(e.target.value)}
												placeholder="Enter your complete custom prompt here..."
												rows={4}
												className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
											/>
										</div>
									)}

									{/* Generate Button */}
									<button
										type="button"
										onClick={handleGenerateStorybook}
										disabled={isGenerating || !selectedFile}
										className={`
											w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg 
											font-semibold text-lg transition-all duration-200
											${
												isGenerating || !selectedFile
													? "bg-muted text-muted-foreground cursor-not-allowed"
													: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
											}
										`}
									>
										{isGenerating ? (
											<>
												<svg
													className="animate-spin h-5 w-5"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<title>Loading</title>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													/>
												</svg>
												Generating Storybook PDF...
											</>
										) : (
											<>
												<svg
													className="w-6 h-6"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<title>Generate</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M13 10V3L4 14h7v7l9-11h-7z"
													/>
												</svg>
												Generate & Download Storybook PDF
											</>
										)}
									</button>
								</div>
							)}
						</div>
					</div>
				</main>
			</div>

			{/* Camera Modal */}
			{isCameraOpen && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
					<div className="bg-surface rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border">
						<div className="p-4 border-b border-border flex items-center justify-between">
							<h3 className="text-lg font-semibold text-primary-text">Take Photo</h3>
							<button
								type="button"
								onClick={closeCamera}
								className="text-secondary-text hover:text-primary-text transition-colors"
								aria-label="Close camera"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<title>Close</title>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						
						<div className="relative bg-black">
							{/* biome-ignore lint/a11y/useMediaCaption: Live camera feed doesn't need captions */}
							<video
								ref={videoRef}
								autoPlay
								playsInline
								className="w-full h-auto max-h-[60vh] object-contain"
							/>
							<canvas ref={canvasRef} className="hidden" />
						</div>

						<div className="p-4 flex gap-3 justify-center bg-muted/30">
							<button
								type="button"
								onClick={takePicture}
								className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<title>Camera</title>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								Capture Photo
							</button>
							<button
								type="button"
								onClick={closeCamera}
								className="flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-hover text-secondary-text hover:text-primary-text font-medium rounded-lg border border-border transition-all duration-200"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<title>Cancel</title>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
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

export default Test;