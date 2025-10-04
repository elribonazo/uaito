import dynamic from 'next/dynamic';
import { AnimatedText } from "./AnimatedText";

const RotatingEarth = dynamic(() => import('./RotatingEarth'), { ssr: false });

export const ParallaxBanner: React.FC<{children?: React.ReactNode}>= (props) => {
    return (
        <div className="relative h-screen w-full overflow-hidden top-5">
            {/* Rotating Earth Background */}
            <RotatingEarth />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                {props.children ?? (
                    <>
                        <h1 className="text-5xl md:text-7xl font-bold text-primary-text text-center mb-5">
                            Welcome to <AnimatedText />
                        </h1>
                        <p className="text-lg md:text-2xl text-secondary-text opacity-80">
                            Revolutionizing daily tasks with AI powered technology
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

