import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Splash() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3500);

    const handleMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) / 80;
      const moveY = (e.clientY - window.innerHeight / 2) / 80;
      setMousePos({ x: moveX, y: moveY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [navigate]);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-background"
    >
      {/* Background Atmospheric Element: Monochromatic Soft Gradient */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-orange rounded-full blur-[100px]"></div>
      </div>

      {/* Central Branding Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-gutter">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-4xl font-serif font-bold text-primary tracking-tight mb-2">
            Kumari & Co.
          </h1>
          <p className="text-xs font-sans text-on-surface tracking-widest uppercase opacity-60">
            Bhubaneswar • Estd. 2024
          </p>
        </motion.div>

        {/* Illustrative Graphic */}
        <motion.div 
          className="mt-12 flex flex-col items-center"
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="w-full h-full rounded-full border border-primary/20 absolute"
            ></motion.div>
            <span className="material-symbols-outlined text-[120px] md:text-[160px] text-primary opacity-90 select-none">
              spa
            </span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8"
          >
            <p className="text-sm font-sans text-on-surface max-w-[240px] leading-relaxed">
              Your trusted local experts in wellness and refinement.
            </p>
          </motion.div>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-[-80px]"
        >
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-accent-orange/20">
            <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></div>
            <span className="text-xs font-medium text-on-surface">Entering the boutique...</span>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
