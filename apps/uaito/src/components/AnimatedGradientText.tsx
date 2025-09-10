'use client'

import React from 'react';

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
}

const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({ text, className = '' }) => {
  return (
    <span
      className={`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text bg-300% animate-gradient ${className}`}
    >
      {text}
    </span>
  );
};

export default AnimatedGradientText;