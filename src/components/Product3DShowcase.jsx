import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import Card3D from './Card3D';

function FloatingDevice({ position, rotation, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef} position={position} rotation={rotation}>
        {/* Device screen */}
        <RoundedBox args={[2, 3, 0.1]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Screen glow */}
        <RoundedBox args={[1.8, 2.7, 0.05]} radius={0.08} smoothness={4} position={[0, 0, 0.06]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#60a5fa" 
            emissiveIntensity={0.5}
          />
        </RoundedBox>
      </group>
    </Float>
  );
}

function GlassOrb({ position }) {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh position={position}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshPhysicalMaterial
          color="#60a5fa"
          metalness={0.9}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function Product3DShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Experience in 3D
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interact with our platform across all your devices with stunning visual experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Canvas */}
          <motion.div
            className="h-[500px] rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }>
              <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} color="#60a5fa" />
                
                <FloatingDevice position={[-1.5, 0, 0]} rotation={[0.2, 0.3, 0]} color="#3b82f6" />
                <FloatingDevice position={[1.5, 0.5, -1]} rotation={[0.1, -0.2, 0]} color="#8b5cf6" />
                <GlassOrb position={[0, -1.5, 0]} />
              </Canvas>
            </Suspense>
          </motion.div>

          {/* Features List */}
          <div className="space-y-6">
            {[
              {
                title: 'Cross-Platform Compatible',
                description: 'Works seamlessly on desktop, tablet, and mobile devices',
                icon: '💻',
              },
              {
                title: 'Real-Time Synchronization',
                description: 'Your settings and preferences sync instantly across all devices',
                icon: '🔄',
              },
              {
                title: 'Offline Functionality',
                description: 'Continue working even without internet connection',
                icon: '📡',
              },
              {
                title: 'Cloud-Based Storage',
                description: 'Securely store your data with automatic backups',
                icon: '☁️',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card3D>
                  <div className="p-6 flex items-start space-x-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
