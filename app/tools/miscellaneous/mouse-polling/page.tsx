"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// 1. TYPES
// ==========================================

export type Theme = 'dark' | 'light';

// ==========================================
// 2. CUSTOM HOOK: HIGH-PERFORMANCE HZ TRACKER
// ==========================================

function useMousePolling() {
  const [hz, setHz] = useState(0);
  const [maxHz, setMaxHz] = useState(0);
  const [history, setHistory] = useState<number[]>(Array(50).fill(0));
  
  // We use refs so the mousemove event doesn't trigger a full React re-render,
  // which would cause micro-stutters and ruin the polling accuracy.
  const timestamps = useRef<number[]>([]);
  const hzRef = useRef<number>(0);
  const testAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = testAreaRef.current;
    if (!el) return;

    // 1. Capture timestamps on every micro-movement
    const handleMouseMove = () => {
      timestamps.current.push(performance.now());
    };

    el.addEventListener('mousemove', handleMouseMove);

    // 2. Process data in sync with monitor refresh rate
    let rafId: number;
    let lastHistoryUpdate = 0;

    const loop = (now: number) => {
      // Keep only timestamps from the last 1000ms (1 second rolling window)
      timestamps.current = timestamps.current.filter((t) => now - t <= 1000);
      
      const currentHz = timestamps.current.length;
      hzRef.current = currentHz;

      // Update UI Counter
      setHz(currentHz);
      setMaxHz((prev) => Math.max(prev, currentHz));

      // Push to history graph every 50ms for smooth animation
      if (now - lastHistoryUpdate > 50) {
        setHistory((prev) => [...prev.slice(1), currentHz]);
        lastHistoryUpdate = now;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const reset = () => {
    timestamps.current = [];
    setHz(0);
    setMaxHz(0);
    setHistory(Array(50).fill(0));
  };

  return { hz, maxHz, history, testAreaRef, reset };
}

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function MousePollingTester() {
  const [theme, setTheme] = useState<Theme>('dark');
  const { hz, maxHz, history, testAreaRef, reset } = useMousePolling();

  // Mouse Glow Trail Effect state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden relative transition-colors duration-500 flex flex-col items-center py-12 px-4 ${
      theme === 'dark' ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-100 text-slate-800'
    }`}>
      
      {/* Ambient Glow Background */}
      {theme === 'dark' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      )}

      {/* Header & Controls */}
      <div className="mb-10 flex flex-col items-center gap-6 z-10 text-center">
        <h1 className={`text-4xl font-extrabold tracking-tight ${
          theme === 'dark' ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent' : 'text-slate-900'
        }`}>
          Mouse Polling Rate Tester
        </h1>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
          Move your mouse rapidly inside the box to test your sensor's actual Hz.
        </p>
        
        {/* Theme Toggle & Reset */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className={`flex items-center gap-2 p-1.5 rounded-full border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white shadow-sm border-slate-200'}`}>
            <button
              onClick={() => setTheme('dark')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
            >
              Dark Mode
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${theme === 'light' ? 'bg-slate-200 text-slate-800 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Light Mode
            </button>
          </div>

          <button 
            onClick={reset}
            className="px-6 py-2 rounded-full text-sm font-bold bg-rose-500 text-white shadow-lg hover:bg-rose-400 transition-colors"
          >
            Reset Max
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 gap-8 mb-8 z-10 w-full max-w-3xl">
        <div className={`flex flex-col items-center justify-center p-8 rounded-3xl border backdrop-blur-xl ${theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-white shadow-xl border-slate-200'}`}>
          <span className={`text-sm font-bold tracking-widest uppercase mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Current Rate</span>
          <div className={`text-6xl font-black ${theme === 'dark' ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-slate-900'}`}>
            {hz} <span className="text-2xl text-slate-500 font-medium">Hz</span>
          </div>
        </div>

        <div className={`flex flex-col items-center justify-center p-8 rounded-3xl border backdrop-blur-xl ${theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-white shadow-xl border-slate-200'}`}>
          <span className={`text-sm font-bold tracking-widest uppercase mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Maximum Rate</span>
          <div className={`text-6xl font-black ${theme === 'dark' ? 'text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]' : 'text-purple-600'}`}>
            {maxHz} <span className="text-2xl text-slate-500 font-medium">Hz</span>
          </div>
        </div>
      </div>

      {/* Real-Time Live Graph */}
      <div className={`w-full max-w-3xl h-32 p-4 rounded-2xl border flex items-end justify-between gap-1 mb-8 z-10 overflow-hidden ${
        theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-white shadow-md border-slate-200'
      }`}>
        {history.map((val, i) => {
          // Normalize height based on maxHz (or at least 1000 to prevent layout jumps)
          const graphMax = Math.max(maxHz, 1000);
          const heightPercent = Math.min((val / graphMax) * 100, 100);
          
          return (
            <div key={i} className="flex-1 flex flex-col justify-end h-full">
              <motion.div
                initial={false}
                animate={{ height: `${heightPercent}%` }}
                transition={{ type: 'tween', duration: 0.05 }}
                className={`w-full rounded-t-sm ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'}`}
                style={{ opacity: 0.3 + (heightPercent / 100) * 0.7 }} // Higher values are brighter
              />
            </div>
          );
        })}
      </div>

      {/* Interactive Testing Area */}
      <div 
        ref={testAreaRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => setIsHovering(false)}
        className={`w-full max-w-3xl h-80 rounded-3xl border-2 border-dashed flex items-center justify-center relative overflow-hidden cursor-crosshair z-10 transition-colors ${
          theme === 'dark' ? 'bg-slate-800/30 border-slate-600 hover:border-purple-500/50' : 'bg-slate-200/50 border-slate-400 hover:border-purple-400'
        }`}
      >
        <span className={`text-xl font-semibold select-none pointer-events-none z-10 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Move mouse rapidly continuously inside this box
        </span>

        {/* Following Glow Effect */}
        <motion.div
          animate={{
            x: mousePos.x - 150, // Center the 300px circle
            y: mousePos.y - 150,
            opacity: isHovering ? 1 : 0
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 200, mass: 0.5 }}
          className={`absolute top-0 left-0 w-[300px] h-[300px] rounded-full blur-[60px] pointer-events-none ${
            theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-400/20'
          }`}
        />
      </div>

    </div>
  );
}