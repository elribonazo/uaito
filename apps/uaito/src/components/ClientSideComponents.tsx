'use client'

import React, { useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ScrollToFeatures } from './Scroll';

export const AnimatedChevron: React.FC = () => (
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
    <ScrollToFeatures>
      <div className="animate-bounce">
        <ChevronDownIcon className="w-10 h-10 text-purple-400" />
      </div>
    </ScrollToFeatures>
  </div>
);

export const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-section');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};

export const ExploreButton: React.FC = () => (
  <ScrollToFeatures>
    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-purple-500/50">
      Getting Started
    </button>
  </ScrollToFeatures>
);