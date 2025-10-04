'use client'

import { useEffect, useRef } from 'react';
import type React from 'react';
import * as THREE from 'three';

const RotatingEarth: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    cameraRef.current = camera;

    // Renderer setup with better quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Create Earth sphere geometry with high detail
    const earthGeometry = new THREE.SphereGeometry(1, 128, 128);

    // Load Earth textures
    const earthDayTexture = textureLoader.load('https://unpkg.com/three-globe@2.31.0/example/img/earth-day.jpg');
    const earthNightTexture = textureLoader.load('https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg');
    const earthBumpTexture = textureLoader.load('https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png');

    // Configure texture settings for better quality
    [earthDayTexture, earthNightTexture, earthBumpTexture].forEach(texture => {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });

    // Create custom shader material for Earth with day/night blend and city lights
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: earthDayTexture },
        nightTexture: { value: earthNightTexture },
        bumpTexture: { value: earthBumpTexture },
        bumpScale: { value: 0.02 },
        sunDirection: { value: new THREE.Vector3(1, 0, 0.3).normalize() },
        atmosphereColor: { value: new THREE.Color(0x88ccff) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        uniform sampler2D bumpTexture;
        uniform float bumpScale;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          
          // Apply bump mapping
          float height = texture2D(bumpTexture, uv).r;
          vec3 newPosition = position + normal * height * bumpScale;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        uniform vec3 atmosphereColor;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Calculate lighting
          vec3 normal = normalize(vNormal);
          float sunDot = dot(normal, sunDirection);
          
          // Since it's nighttime, we want the sun on the opposite side
          // Adjust the threshold to show more night
          float dayMix = smoothstep(-0.3, 0.1, sunDot);
          
          // Sample textures
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv);
          
          // Enhance city lights intensity (subtle)
          float lightsIntensity = (nightColor.r + nightColor.g + nightColor.b) / 3.0;
          vec3 enhancedLights = nightColor.rgb * (1.0 + lightsIntensity * 1.2);
          enhancedLights = mix(enhancedLights, vec3(1.0, 0.9, 0.7), lightsIntensity * 0.2);
          
          // For nighttime, invert the mix so night dominates
          vec3 color = mix(enhancedLights, dayColor.rgb, dayMix * 0.3);
          
          // Add subtle blue tint to dark areas (ocean reflections)
          float darkness = 1.0 - dayMix;
          color = mix(color, color * vec3(0.7, 0.8, 1.0), darkness * 0.15);
          
          // Add rim lighting effect
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float rim = 1.0 - max(0.0, dot(viewDirection, normal));
          rim = pow(rim, 3.0) * 0.15;
          color += atmosphereColor * rim;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    // Create Earth mesh
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    // Position to center on Spain (approximately 40°N, 4°W)
    // Longitude: 4°W from Prime Meridian
    earth.rotation.y = -Math.PI / 2 - (4 * Math.PI / 180); // Center on Spain's longitude
    earth.rotation.x = 0.698; // Tilt to show 40°N latitude (Spain's position)
    earthRef.current = earth;
    scene.add(earth);

    // Create clouds layer
    const cloudsGeometry = new THREE.SphereGeometry(1.01, 128, 128);
    
    // Generate procedural cloud texture
    const cloudsCanvas = document.createElement('canvas');
    cloudsCanvas.width = 2048;
    cloudsCanvas.height = 1024;
    const ctx = cloudsCanvas.getContext('2d');
    
    if (ctx) {
      // Fill with transparent black
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, cloudsCanvas.width, cloudsCanvas.height);
      
      // Draw random cloud patches
      for (let i = 0; i < 800; i++) {
        const x = Math.random() * cloudsCanvas.width;
        const y = Math.random() * cloudsCanvas.height;
        const size = Math.random() * 80 + 20;
        const opacity = Math.random() * 0.4 + 0.1;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      }
      
      // Add wispy cloud details
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * cloudsCanvas.width;
        const y = Math.random() * cloudsCanvas.height;
        const width = Math.random() * 150 + 50;
        const height = Math.random() * 30 + 10;
        const opacity = Math.random() * 0.25 + 0.05;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas);
    cloudsTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
    });
    
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    // Match Earth's initial rotation (with slight offset for variety)
    clouds.rotation.y = earth.rotation.y + (Math.random() * 0.2 - 0.1); // Slightly offset from Earth
    clouds.rotation.x = earth.rotation.x; // Same tilt as Earth
    cloudsRef.current = clouds;
    scene.add(clouds);

    // Create atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x3366dd) },
        coefficient: { value: 0.4 },
        power: { value: 3.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float coefficient;
        uniform float power;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float intensity = pow(coefficient - dot(viewDirection, vNormal), power);
          intensity = clamp(intensity, 0.0, 1.0);
          
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.rotation.x = earth.rotation.x; // Match Earth's tilt
    atmosphere.rotation.y = earth.rotation.y; // Match Earth's rotation
    scene.add(atmosphere);

    // Add starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Random position on a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 50 + Math.random() * 50;
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      
      // Slight color variation (mostly white, some blue/yellow tint)
      const colorVariation = Math.random();
      if (colorVariation < 0.7) {
        starColors[i3] = 1;
        starColors[i3 + 1] = 1;
        starColors[i3 + 2] = 1;
      } else if (colorVariation < 0.85) {
        starColors[i3] = 0.8;
        starColors[i3 + 1] = 0.9;
        starColors[i3 + 2] = 1;
      } else {
        starColors[i3] = 1;
        starColors[i3 + 1] = 0.95;
        starColors[i3 + 2] = 0.8;
      }
      
      starSizes[i] = Math.random() * 2 + 0.5;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Lighting for nighttime Earth
    const ambientLight = new THREE.AmbientLight(0x111133, 0.3);
    scene.add(ambientLight);

    // Distant sun light (behind Earth for night view)
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.2);
    sunLight.position.set(5, 0, 1);
    scene.add(sunLight);

    // Subtle rim light to define the sphere
    const rimLight = new THREE.DirectionalLight(0x3366ff, 0.15);
    rimLight.position.set(-3, 1, -2);
    scene.add(rimLight);

    // Animation loop with time-based rotation
    const startTime = Date.now();
    let lastTime = startTime;
    
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (earthRef.current) {
        // Rotate Earth: one full rotation (2π) in 24 hours (86,400,000 ms)
        // Rotation per millisecond = (2 * Math.PI) / 86400000
        const earthRotationSpeed = (2 * Math.PI) / 86400000; // radians per millisecond
        earthRef.current.rotation.y += earthRotationSpeed * deltaTime;
      }

      if (cloudsRef.current) {
        // Clouds rotate slightly faster than Earth (20% faster)
        const cloudRotationSpeed = (2 * Math.PI) / 86400000 * 1.2;
        cloudsRef.current.rotation.y += cloudRotationSpeed * deltaTime;
      }

      // Rotate atmosphere with Earth
      if (earthRef.current) {
        atmosphere.rotation.y = earthRef.current.rotation.y;
      }

      // Subtle camera sway for dynamic feel
      const time = Date.now() * 0.0001;
      camera.position.x = Math.sin(time) * 0.15;
      camera.position.y = Math.cos(time * 0.7) * 0.1;
      camera.lookAt(0, 0, 0);

      // Rotate stars very slowly (one rotation per week)
      const starRotationSpeed = (2 * Math.PI) / (7 * 86400000);
      stars.rotation.y += starRotationSpeed * deltaTime;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose geometries
      earthGeometry.dispose();
      cloudsGeometry.dispose();
      atmosphereGeometry.dispose();
      starsGeometry.dispose();
      
      // Dispose materials
      earthMaterial.dispose();
      cloudsMaterial.dispose();
      atmosphereMaterial.dispose();
      starsMaterial.dispose();
      
      // Dispose textures
      earthDayTexture.dispose();
      earthNightTexture.dispose();
      earthBumpTexture.dispose();
      cloudsTexture.dispose();
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full h-full"
      style={{ 
        background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)',
        zIndex: 0 
      }}
    />
  );
};

export default RotatingEarth;
