'use client'
import React from 'react';
import { useState, useEffect } from "react";



export const AnimatedText: React.FC<{text?:string}> = (props) => {
    const [visibleLetters, setVisibleLetters] = useState(0);
    const text = props.text ?? "UAITO.io";
    const colors = [
      '#00ffff', '#00ff00', '#ffff00', '#ff8000', '#ff0000',
      '#00ccff', '#00dd00', '#ffdd00', '#ff6600', '#ff3333',
      '#0099ff', '#33cc33', '#ffcc00', '#ff4d00', '#ff6666',
      '#66ccff', '#66ff66', '#ffff66', '#ffaa66', '#ff9999'
    ];
  
    useEffect(() => {
      if (visibleLetters < text.length) {
        const timer = setTimeout(() => {
          setVisibleLetters(visibleLetters + 1);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [visibleLetters]);
  
    return (
      <span className="inline-block">
        {text.split('').map((letter, index) => (
          <span
            key={`text-${index}${letter}`}
            className={`font-bold transition-all duration-300 ${index < visibleLetters ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              color: colors[index % colors.length],
              textShadow: `0 0 10px ${colors[index % colors.length]}`,
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    );
  };