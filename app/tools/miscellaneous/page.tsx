"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

// ==========================================
// 1. DATA & TYPES
// ==========================================

type ToolStatus = 'available' | 'coming-soon';

interface ToolCatalogItem {
  id: string;
  title: string;
  description: string;
  href: string;
  status: ToolStatus;
  gradient: string;
  icon: React.ReactNode;
}

const CATALOG_ITEMS: ToolCatalogItem[] = [
  {
    id: 'keyboard-tester',
    title: 'Ultimate Keyboard Tester',
    description: 'Test your mechanical switches, N-key rollover, and modifiers with a fully responsive, animated virtual board.',
    href: '/tools/miscellaneous/keyboardtest',
    status: 'available',
    gradient: 'from-cyan-400 to-blue-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5A2.25 2.25 0 0122.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 17.25V6.75A2.25 2.25 0 013.75 4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h.008v.008H6V9zm3 0h.008v.008H9V9zm3 0h.008v.008H12V9zm3 0h.008v.008H15V9zm3 0h.008v.008H18V9zm-9 3h.008v.008H9V12zm3 0h.008v.008H12V12zm3 0h.008v.008H15V12zm-3 3h4.5" />
      </svg>
    ),
  },
  {
    id: 'mouse-polling',
    title: 'Mouse Polling Rate',
    description: 'Analyze your mouse sensor tracking, hertz consistency, and click latency in real-time.',
    href: '/tools/miscellaneous/mouse-polling',
    status: 'available',
    gradient: 'from-purple-400 to-pink-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
      </svg>
    ),
  },
  {
    id: 'monitor-dead-pixel',
    title: 'Display Analyzer',
    description: 'Find dead pixels, check backlight bleed, and test color accuracy on your current display.',
    href: '/tools/miscellaneous/display-analyzer',
    status: 'available',
    gradient: 'from-amber-400 to-orange-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  {
    id: 'camera-mic-tester',
    title: 'Camera & Mic Tester',
    description: 'Verify webcam resolution, microphone levels, and A/V sync. Switch between inputs and record test clips.',
    href: '/tools/miscellaneous/camera-mic-test',
    status: 'available',
    gradient: 'from-emerald-400 to-teal-600',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 6.75v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  }
];

// ==========================================
// 2. ANIMATION VARIANTS
// ==========================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  }
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function MiscellaneousToolsPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/20 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 text-sm font-semibold mb-6 shadow-lg backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            The Arsenal is Expanding
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
            Misc <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Tools</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Your ultimate digital utility belt. We are building powerful, interactive micro-tools to test, analyze, and optimize your setup. <strong className="text-slate-200">More coming soon.</strong>
          </p>
        </motion.div>

        {/* CATALOG GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {CATALOG_ITEMS.map((item) => (
            <motion.div key={item.id} variants={itemVariants} className="h-full">
              
              {/* CARD CONTAINER */}
              <div className={`relative h-full flex flex-col p-8 rounded-3xl border transition-all duration-300 backdrop-blur-xl ${
                item.status === 'available' 
                  ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-cyan-500/50 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] group' 
                  : 'bg-slate-900/30 border-slate-800/50 opacity-70 grayscale-[0.3]'
              }`}>
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  {item.status === 'available' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Live
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                      Locked
                    </span>
                  )}
                </div>

                {/* Icon Wrapper with Gradient */}
                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${item.gradient} shadow-lg text-white`}>
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                
                <p className="text-slate-400 flex-grow mb-8 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Interactive Button */}
                {item.status === 'available' ? (
                  <Link href={item.href} className="mt-auto inline-block focus:outline-none">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-xl bg-cyan-500 text-white font-bold text-center flex items-center justify-center gap-2 group-hover:bg-cyan-400 transition-colors shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]"
                    >
                      Launch Tool
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </motion.div>
                  </Link>
                ) : (
                  <div className="mt-auto w-full py-3 px-6 rounded-xl bg-slate-800 text-slate-500 font-semibold text-center cursor-not-allowed flex items-center justify-center gap-2">
                    In Development
                    <span className="flex space-x-1">
                      <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}