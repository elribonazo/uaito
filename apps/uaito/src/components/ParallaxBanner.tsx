import { BannerLayer, ParallaxBanner as ParallaxRoot } from "react-scroll-parallax";
import { AnimatedText } from "./AnimatedText";

export const ParallaxBanner: React.FC<{children?: any}>= (props) => {
    const background: BannerLayer = {
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80",
        translateY: [0, 25],
        opacity: [1, 0.5],
        scale: [1.05, 1, "easeOutCubic"],
        shouldAlwaysCompleteAnimation: true,
        expanded: false,
    };

    const content: BannerLayer = {
        translateY: [0, 15],
        scale: [1, 1.05, "easeOutCubic"],
        shouldAlwaysCompleteAnimation: true,
        expanded: false,
        children: props.children ?? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h1 className="text-5xl md:text-7xl font-bold text-primary-text text-center mb-5">
                    Welcome to <AnimatedText />
                </h1>
                <p className="text-lg md:text-2xl text-secondary-text opacity-80">
                    Revolutionizing daily tasks with AI powered technology
                </p>
            </div>
        )
    };

    return (
        <ParallaxRoot
            layers={[background, content]}
            className="h-screen"
        />
    );
};

