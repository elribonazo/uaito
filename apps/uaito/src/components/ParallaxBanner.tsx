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
        children: (
            <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-b from-[rgba(0,0,0,0.3)] via-[rgba(0,0,0,0.5)] to-black" />
            </div>
        )
    };

    const content: BannerLayer = {
        translateY: [0, 15],
        scale: [1, 1.05, "easeOutCubic"],
        shouldAlwaysCompleteAnimation: true,
        expanded: false,
        children: props.children ?? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h1 className="font-sans font-bold text-[8vw] text-white text-center mb-5">
                    Welcome to <AnimatedText />
                </h1>
                <p className="font-sans text-[3vw] text-white opacity-80">
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

