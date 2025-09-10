'use client'
import React  from 'react';

export const ScrollToFeatures = ({ children }: { children: React.ReactNode }) => {
    return (
      <div onClick={() => {
        const featuresSection = document.getElementById('started');
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
      }} className="cursor-pointer">
        {children}
      </div>
    );
  };