import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Float, OrbitControls } from '@react-three/drei';

function Animated3DText() {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Text
        fontSize={1.5}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        NEXUS
        <meshStandardMaterial 
          color="#3b82f6" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#60a5fa"
          emissiveIntensity={0.3}
        />
      </Text>
    </Float>
  );
}

export default function Logo3D() {
  return (
    <div className="w-64 h-32">
      <Suspense fallback={<div className="text-2xl font-bold text-blue-600">NEXUS</div>}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Animated3DText />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </Suspense>
    </div>
  );
}
