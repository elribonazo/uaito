import React, { useEffect, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import {ParallaxBanner, ParallaxBannerLayer, ParallaxProvider } from 'react-scroll-parallax';
import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.cjs.jsx';

const Preview: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ pageProps: { chats, screenshot } }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableDistance = documentHeight - windowHeight;
      const progress = (scrollTop / scrollableDistance) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="min-h-screen flex">
      <p className='fixed right-10 z-50 top-4'>{scrollProgress.toFixed(2)}%</p>
      <ParallaxProvider>
        
      <ParallaxBanner className="aspect-[1/1]" >

        <ParallaxBannerLayer style={{ height: '300vh' }}>
        <div className='scrolly-container' style={{ height: '300vh' }}>
          <ScrollyVideo
            src="https://scrollyvideo.js.org/goldengate.mp4"
            percentScrolled={scrollProgress}
          />
          </div>
        </ParallaxBannerLayer>

       
        <ParallaxBannerLayer 
        expanded={false}
        shouldAlwaysCompleteAnimation={true}
        translateY={[0,0]} 
        scaleX={[1,1]} 
        image='https://s3-us-west-2.amazonaws.com/s.cdpn.io/105988/banner-foreground.png'
         />

      </ParallaxBanner>


      


        

      </ParallaxProvider>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Preview;