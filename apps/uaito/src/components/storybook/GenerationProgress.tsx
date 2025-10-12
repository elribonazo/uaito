import React from 'react';

export const GenerationProgress: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
			<svg
				className="animate-spin h-12 w-12 md:h-16 md:w-16 text-primary"
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
			<h3 className="text-xl md:text-2xl font-semibold text-foreground">Generating Your Storybook...</h3>
			<p className="text-sm md:text-base text-muted-foreground">
				This may take a few moments. Please don't close this page.
			</p>
		</div>
	);
};
