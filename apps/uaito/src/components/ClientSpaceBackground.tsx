'use client'

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  twinkle: boolean;
}

const ClientSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createStars = (count: number, speed: number): Star[] => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speed,
        opacity: Math.random(),
        twinkle: Math.random() > 0.7,
      }));
    };

    const starLayers = [
      createStars(100, 0.1),
      createStars(75, 0.2),
      createStars(50, 0.3),
    ];

    const drawGradient = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDark) {
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#000000');
      } else {
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#bae6fd');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStar = (star: Star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      const starOpacity = isDark ? star.opacity : star.opacity * 0.3;
      const starColor = isDark ? '255, 255, 255' : '100, 116, 139';
      ctx.fillStyle = `rgba(${starColor}, ${starOpacity})`;
      ctx.fill();
    };

    const updateStar = (star: Star) => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
      }
      if (star.twinkle) {
        star.opacity = Math.sin(Date.now() * 0.001 * star.speed) * 0.5 + 0.5;
      }
    };

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGradient();

      starLayers.forEach((layer) => {
        layer.forEach((star) => {
          drawStar(star);
          updateStar(star);
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />;
};

export default ClientSpaceBackground;