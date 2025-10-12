import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from "react";
import Image from "next/image";

interface ImageUploadProps {
    onFileSelect: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleFile = (file: File) => {
        if (file?.type?.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFileName(file.name);
                onFileSelect(file);
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
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
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

    useEffect(() => {
        if (isCameraOpen && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-6">
            {imagePreview ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg md:text-xl font-semibold text-foreground">
                            Image Selected
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
                            <span className="text-sm md:text-base">Change Image</span>
                        </button>
                    </div>
                    <div className="bg-muted/30 border border-muted rounded-lg p-4 flex items-center gap-4">
                        <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
                            <Image
                                src={imagePreview}
                                alt="Preview of uploaded image"
                                layout="fill"
                                className="rounded-lg object-cover"
                                unoptimized
                            />
                        </div>
                        {fileName && (
                            <p className="text-sm md:text-base text-muted-foreground break-all">
                                <span className="font-medium text-foreground">File:</span> {fileName}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <>
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
                                className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground"
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
                                <p className="text-lg md:text-xl font-semibold text-foreground">
                                    Drag and drop your image here
                                </p>
                                <p className="text-sm md:text-base text-muted-foreground mt-1">
                                    or click to browse from your computer
                                </p>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                            aria-label="Choose image file"
                        />
                    </button>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                openFilePicker();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium text-base md:text-lg"
                        >
                            <svg
                                className="w-5 h-5 md:w-6 md:h-6"
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
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium text-base md:text-lg"
                        >
                            <svg
                                className="w-5 h-5 md:w-6 md:h-6"
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
                </>
            )}
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
