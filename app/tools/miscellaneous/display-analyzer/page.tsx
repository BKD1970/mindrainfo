"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. TYPES & DATA
// ==========================================

export type Theme = 'dark' | 'light';
export type TestType = 'solid' | 'gradient' | 'bleed';

const SOLID_COLORS = [
  { name: 'Pure Red', hex: '#FF0000', text: 'white' },
  { name: 'Pure Green', hex: '#00FF00', text: 'black' },
  { name: 'Pure Blue', hex: '#0000FF', text: 'white' },
  { name: 'Pure White', hex: '#FFFFFF', text: 'black' },
  { name: 'Pure Black', hex: '#000000', text: 'white' },
];

const GRADIENTS = [
  { name: 'Grayscale Banding', css: 'linear-gradient(to right, #000000, #FFFFFF)' },
  { name: 'Red Banding', css: 'linear-gradient(to right, #000000, #FF0000)' },
  { name: 'Green Banding', css: 'linear-gradient(to right, #000000, #00FF00)' },
  { name: 'Blue Banding', css: 'linear-gradient(to right, #000000, #0000FF)' },
];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function DisplayAnalyzer() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeTest, setActiveTest] = useState<TestType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto-hide tooltip during test when mouse stops moving
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (activeTest) {
      const handleMouseMove = () => {
        setShowTooltip(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setShowTooltip(false), 2000);
      };
      window.addEventListener('mousemove', handleMouseMove);
      timeout = setTimeout(() => setShowTooltip(false), 2000);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeout);
      };
    }
  }, [activeTest]);

  // Handle Fullscreen and Keyboard Navigation
  const exitTest = useCallback(() => {
    setActiveTest(null);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
  }, []);

  const nextStep = useCallback(() => {
    if (activeTest === 'solid') {
      setCurrentIndex((prev) => (prev + 1) % SOLID_COLORS.length);
    } else if (activeTest === 'gradient') {
      setCurrentIndex((prev) => (prev + 1) % GRADIENTS.length);
    }
  }, [activeTest]);

  const prevStep = useCallback(() => {
    if (activeTest === 'solid') {
      setCurrentIndex((prev) => (prev - 1 + SOLID_COLORS.length) % SOLID_COLORS.length);
    } else if (activeTest === 'gradient') {
      setCurrentIndex((prev) => (prev - 1 + GRADIENTS.length) % GRADIENTS.length);
    }
  }, [activeTest]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeTest) return;
      
      switch (e.code) {
        case 'Space':
        case 'ArrowRight':
          nextStep();
          break;
        case 'ArrowLeft':
          prevStep();
          break;
        case 'Escape':
          exitTest();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Listen for user pressing Esc natively to exit fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setActiveTest(null);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [activeTest, nextStep, prevStep, exitTest]);

  const startTest = (type: TestType) => {
    setCurrentIndex(0);
    setActiveTest(type);
    setShowTooltip(true);
    
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  // ==========================================
  // 3. RENDERERS
  // ==========================================

  // Dashboard View (When no test is running)
  if (!activeTest) {
    return (
      <div className={`min-h-screen font-sans overflow-x-hidden relative transition-colors duration-500 flex flex-col items-center py-12 px-4 ${
        theme === 'dark' ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-100 text-slate-800'
      }`}>
        
        {theme === 'dark' && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-900/20 blur-[120px] rounded-full pointer-events-none" />
        )}

        {/* Header & Controls */}
        <div className="mb-12 flex flex-col items-center gap-6 z-10 text-center">
          <h1 className={`text-4xl font-extrabold tracking-tight ${theme === 'dark' ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent' : 'text-slate-900'}`}>
            Display Analyzer
          </h1>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
            Find dead pixels, check backlight bleed, and test color banding on your monitor.
          </p>
          
          <div className={`flex items-center gap-2 p-1.5 rounded-full border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white shadow-sm border-slate-200'}`}>
            <button onClick={() => setTheme('dark')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}>Dark Mode</button>
            <button onClick={() => setTheme('light')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${theme === 'light' ? 'bg-slate-200 text-slate-800 shadow-md' : 'text-slate-400 hover:text-white'}`}>Light Mode</button>
          </div>
        </div>

        {/* Test Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-10">
          
          {/* Card 1: Solid Colors */}
          <div className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 backdrop-blur-xl ${theme === 'dark' ? 'bg-slate-900/60 border-slate-700 hover:border-amber-500/50' : 'bg-white shadow-xl border-slate-200 hover:border-amber-400'}`}>
            <div className="flex gap-1 mb-6 h-12 rounded-xl overflow-hidden shadow-inner">
              <div className="flex-1 bg-[#FF0000]" />
              <div className="flex-1 bg-[#00FF00]" />
              <div className="flex-1 bg-[#0000FF]" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dead Pixel Test</h3>
            <p className={`text-sm mb-8 flex-grow ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Cycles through pure RGB, white, and black to help you spot stuck or dead pixels. Look closely at the screen during each color.
            </p>
            <button onClick={() => startTest('solid')} className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-400 transition-colors shadow-lg">Start Test</button>
          </div>

          {/* Card 2: Backlight Bleed */}
          <div className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 backdrop-blur-xl ${theme === 'dark' ? 'bg-slate-900/60 border-slate-700 hover:border-slate-500/50' : 'bg-white shadow-xl border-slate-200 hover:border-slate-400'}`}>
            <div className="mb-6 h-12 rounded-xl bg-black shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] border border-slate-800" />
            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Backlight Bleed</h3>
            <p className={`text-sm mb-8 flex-grow ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Displays a pure black screen. Turn your monitor brightness to 100% and look for white/yellow glowing around the edges of your IPS/VA panel.
            </p>
            <button onClick={() => startTest('bleed')} className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors shadow-lg">Start Test</button>
          </div>

          {/* Card 3: Color Banding */}
          <div className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 backdrop-blur-xl ${theme === 'dark' ? 'bg-slate-900/60 border-slate-700 hover:border-blue-500/50' : 'bg-white shadow-xl border-slate-200 hover:border-blue-400'}`}>
            <div className="mb-6 h-12 rounded-xl" style={{ background: 'linear-gradient(to right, #000, #fff)' }} />
            <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Color Banding</h3>
            <p className={`text-sm mb-8 flex-grow ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Tests your monitor's color depth (8-bit vs 10-bit). Look for harsh vertical lines or "steps" in the gradient instead of a smooth transition.
            </p>
            <button onClick={() => startTest('gradient')} className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-400 transition-colors shadow-lg">Start Test</button>
          </div>

        </div>
      </div>
    );
  }

  // Active Test Overlay (Fullscreen)
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
        onClick={nextStep}
        style={{
          background: activeTest === 'solid' 
            ? SOLID_COLORS[currentIndex].hex 
            : activeTest === 'bleed' 
              ? '#000000' 
              : GRADIENTS[currentIndex].css
        }}
      >
        {/* Floating Tooltip Instruction */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-12 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-2xl flex flex-col items-center gap-1 pointer-events-none"
            >
              <div className="text-sm font-bold tracking-widest uppercase opacity-80">
                {activeTest === 'solid' ? SOLID_COLORS[currentIndex].name : activeTest === 'gradient' ? GRADIENTS[currentIndex].name : 'Pure Black'}
              </div>
              <div className="text-xs text-slate-300">
                Click or Space to next • Esc to exit
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}