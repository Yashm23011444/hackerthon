import React from 'react';
import { motion } from 'framer-motion';

const FloatingIcon = ({ children, delay = 0, duration = 3 }) => {
  return (
    <motion.div
      className="absolute"
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <FloatingIcon delay={0} duration={4}>
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-20 blur-sm transform rotate-12" />
      </FloatingIcon>
      
      <FloatingIcon delay={1} duration={5}>
        <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-sm" />
      </FloatingIcon>
      
      <FloatingIcon delay={2} duration={4.5}>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg opacity-20 blur-sm transform -rotate-12" />
      </FloatingIcon>
      
      <FloatingIcon delay={1.5} duration={6}>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-4 border-indigo-400 rounded-full opacity-10 blur-sm" />
      </FloatingIcon>
      
      <FloatingIcon delay={0.5} duration={5.5}>
        <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-600 rounded-2xl opacity-20 blur-sm transform rotate-45" />
      </FloatingIcon>

      {/* Accessibility icons floating */}
      <FloatingIcon delay={2.5} duration={7}>
        <div className="absolute top-1/2 left-10 text-6xl opacity-10">
          ♿
        </div>
      </FloatingIcon>
      
      <FloatingIcon delay={3} duration={6.5}>
        <div className="absolute bottom-1/4 right-10 text-5xl opacity-10">
          🎤
        </div>
      </FloatingIcon>
    </div>
  );
}
