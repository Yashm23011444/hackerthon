import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';

function PulsingOrb({ isActive }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && isActive) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color={isActive ? '#3b82f6' : '#9ca3af'}
        attach="material"
        distort={isActive ? 0.5 : 0.2}
        speed={isActive ? 2 : 0.5}
        roughness={0.4}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function MicrophoneVisualization({ isListening }) {
  return (
    <div className="w-full h-64 relative">
      <Suspense fallback={<div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl" />}>
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#60a5fa" />
          <PulsingOrb isActive={isListening} />
        </Canvas>
      </Suspense>
      
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-blue-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}
    </div>
  );
}
