import React from 'react';
import Image from 'next/image';

import SpaceBackground from '../components/SpaceBackground';
import Footer from '@/components/Footer';
import { AnimatedText } from '@/components/AnimatedText';

const ThankYou: React.FC = () => {
  return (
    <main className="min-h-screen relative bg-gray-900 text-white font-roboto">
      <SpaceBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/UAITO.png"
        alt="UAITO"
        width={300}
        height={300}
        className="rounded-lg m-5"
      />
        <h1 className="text-4xl font-bold mb-8 text-center">Thank You for Subscribing to <AnimatedText />!</h1>
        
        <div className="space-y-6 text-lg text-center">
          <p>We're thrilled to have you on board. Your subscription has been confirmed.</p>
          <p>Get ready to explore the universe of possibilities with Uaito!</p>
        </div>

        <div className="mt-6 space-y-6 text-lg text-center">
          <p>Please check your email inbox for instructions!</p>
        </div>
        
      </div>
      <Footer />
    </main>
  );
}

export default ThankYou;