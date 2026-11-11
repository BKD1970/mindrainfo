"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export type OSLayout = 'windows' | 'mac';
export type Theme = 'dark' | 'light';

export interface KeyConfig {
  code: string;           // Maps directly to KeyboardEvent.code
  label: string;          // Default/Windows label
  macLabel?: string;      // Label when Mac layout is toggled
  widthClass?: string;    // Tailwind width class (e.g., 'w-24')
  heightClass?: string;   // Tailwind height class (for tall numpad keys)
}

// ==========================================
// 2. KEYBOARD LAYOUT DEFINITIONS
// ==========================================

// MAIN 60% BLOCK + FUNCTION ROW
const MAIN_LAYOUT: KeyConfig[][] = [
  [
    { code: 'Escape', label: 'Esc' },
    { code: 'F1', label: 'F1' }, { code: 'F2', label: 'F2' }, { code: 'F3', label: 'F3' }, { code: 'F4', label: 'F4' },
    { code: 'F5', label: 'F5' }, { code: 'F6', label: 'F6' }, { code: 'F7', label: 'F7' }, { code: 'F8', label: 'F8' },
    { code: 'F9', label: 'F9' }, { code: 'F10', label: 'F10' }, { code: 'F11', label: 'F11' }, { code: 'F12', label: 'F12' },
  ],
  [
    { code: 'Backquote', label: '` ~' }, { code: 'Digit1', label: '1 !' }, { code: 'Digit2', label: '2 @' },
    { code: 'Digit3', label: '3 #' }, { code: 'Digit4', label: '4 $' }, { code: 'Digit5', label: '5 %' },
    { code: 'Digit6', label: '6 ^' }, { code: 'Digit7', label: '7 &' }, { code: 'Digit8', label: '8 *' },
    { code: 'Digit9', label: '9 (' }, { code: 'Digit0', label: '0 )' }, { code: 'Minus', label: '- _' },
    { code: 'Equal', label: '= +' }, { code: 'Backspace', label: 'Backspace', widthClass: 'w-28' },
  ],
  [
    { code: 'Tab', label: 'Tab', widthClass: 'w-20' }, { code: 'KeyQ', label: 'Q' }, { code: 'KeyW', label: 'W' },
    { code: 'KeyE', label: 'E' }, { code: 'KeyR', label: 'R' }, { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' }, { code: 'KeyU', label: 'U' }, { code: 'KeyI', label: 'I' },
    { code: 'KeyO', label: 'O' }, { code: 'KeyP', label: 'P' }, { code: 'BracketLeft', label: '[ {' },
    { code: 'BracketRight', label: '] }' }, { code: 'Backslash', label: '\\ |', widthClass: 'w-20' },
  ],
  [
    { code: 'CapsLock', label: 'Caps Lock', widthClass: 'w-24' }, { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' }, { code: 'KeyD', label: 'D' }, { code: 'KeyF', label: 'F' },
    { code: 'KeyG', label: 'G' }, { code: 'KeyH', label: 'H' }, { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' }, { code: 'KeyL', label: 'L' }, { code: 'Semicolon', label: '; :' },
    { code: 'Quote', label: "' \"" }, { code: 'Enter', label: 'Enter', widthClass: 'w-[6.5rem]' },
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', widthClass: 'w-32' }, { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' }, { code: 'KeyC', label: 'C' }, { code: 'KeyV', label: 'V' },
    { code: 'KeyB', label: 'B' }, { code: 'KeyN', label: 'N' }, { code: 'KeyM', label: 'M' },
    { code: 'Comma', label: ', <' }, { code: 'Period', label: '. >' }, { code: 'Slash', label: '/ ?' },
    { code: 'ShiftRight', label: 'Shift', widthClass: 'w-36' },
  ],
  [
    { code: 'ControlLeft', label: 'Ctrl', macLabel: 'control', widthClass: 'w-16' },
    { code: 'MetaLeft', label: 'Win', macLabel: 'command', widthClass: 'w-16' },
    { code: 'AltLeft', label: 'Alt', macLabel: 'option', widthClass: 'w-16' },
    { code: 'Space', label: '', widthClass: 'w-[22rem]' },
    { code: 'AltRight', label: 'Alt', macLabel: 'option', widthClass: 'w-16' },
    { code: 'MetaRight', label: 'Win', macLabel: 'command', widthClass: 'w-16' },
    { code: 'ContextMenu', label: 'Menu', macLabel: 'fn', widthClass: 'w-16' },
    { code: 'ControlRight', label: 'Ctrl', macLabel: 'control', widthClass: 'w-16' },
  ],
];

// NAVIGATION & SYSTEM CLUSTER
const NAV_LAYOUT: KeyConfig[][] = [
  [ { code: 'PrintScreen', label: 'PrtScn' }, { code: 'ScrollLock', label: 'ScrLk' }, { code: 'Pause', label: 'Pause' } ],
  [ { code: 'Insert', label: 'Ins' }, { code: 'Home', label: 'Home' }, { code: 'PageUp', label: 'PgUp' } ],
  [ { code: 'Delete', label: 'Del' }, { code: 'End', label: 'End' }, { code: 'PageDown', label: 'PgDn' } ],
  [ { code: 'Spacer1', label: '', widthClass: 'opacity-0 pointer-events-none' }, { code: 'ArrowUp', label: '↑' }, { code: 'Spacer2', label: '', widthClass: 'opacity-0 pointer-events-none' } ],
  [ { code: 'ArrowLeft', label: '←' }, { code: 'ArrowDown', label: '↓' }, { code: 'ArrowRight', label: '→' } ],
];

// NUMPAD CLUSTER
const NUMPAD_LAYOUT: KeyConfig[][] = [
  [ { code: 'NumLock', label: 'NumLk' }, { code: 'NumpadDivide', label: '/' }, { code: 'NumpadMultiply', label: '*' }, { code: 'NumpadSubtract', label: '-' } ],
  [ { code: 'Numpad7', label: '7' }, { code: 'Numpad8', label: '8' }, { code: 'Numpad9', label: '9' }, { code: 'NumpadAdd', label: '+', heightClass: 'h-[7.5rem] absolute right-0 top-0' } ],
  [ { code: 'Numpad4', label: '4' }, { code: 'Numpad5', label: '5' }, { code: 'Numpad6', label: '6' } ],
  [ { code: 'Numpad1', label: '1' }, { code: 'Numpad2', label: '2' }, { code: 'Numpad3', label: '3' }, { code: 'NumpadEnter', label: 'Ent', heightClass: 'h-[7.5rem] absolute right-0 top-0' } ],
  [ { code: 'Numpad0', label: '0', widthClass: 'w-[7.5rem]' }, { code: 'NumpadDecimal', label: '.' } ]
];

// EXTENDED / MEDIA KEYS (F13-F20, Media, UI, etc.)
const EXTENDED_KEYS: KeyConfig[] = [
  { code: 'F13', label: 'F13' }, { code: 'F14', label: 'F14' }, { code: 'F15', label: 'F15' }, { code: 'F16', label: 'F16' },
  { code: 'F17', label: 'F17' }, { code: 'F18', label: 'F18' }, { code: 'F19', label: 'F19' }, { code: 'F20', label: 'F20' },
  { code: 'AudioVolumeMute', label: 'Mute' }, { code: 'AudioVolumeDown', label: 'Vol -' }, { code: 'AudioVolumeUp', label: 'Vol +' },
  { code: 'MediaPlayPause', label: 'Play/Pause' }, { code: 'MediaStop', label: 'Stop' }, { code: 'MediaTrackNext', label: 'Next' }, { code: 'MediaTrackPrevious', label: 'Prev' },
  { code: 'BrightnessUp', label: 'Bright +' }, { code: 'BrightnessDown', label: 'Bright -' }, { code: 'Sleep', label: 'Sleep' }, { code: 'WakeUp', label: 'Wake' },
  { code: 'Help', label: 'Help' }, { code: 'Undo', label: 'Undo' }, { code: 'Redo', label: 'Redo' }, { code: 'Copy', label: 'Copy' }, { code: 'Paste', label: 'Paste' },
];

// ==========================================
// 3. CUSTOM HOOK: EVENT HANDLING
// ==========================================

function useKeyboardListener() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default actions except for F12 (DevTools) and F5 (Refresh)
      if (e.code !== 'F12' && e.code !== 'F5') {
        e.preventDefault();
      }
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.add(e.code);
        return newSet;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'F12' && e.code !== 'F5') {
        e.preventDefault();
      }
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.code);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return pressedKeys;
}

// ==========================================
// 4. COMPONENTS
// ==========================================

const Key = ({
  config,
  isPressed,
  os,
  theme,
}: {
  config: KeyConfig;
  isPressed: boolean;
  os: OSLayout;
  theme: Theme;
}) => {
  const label = os === 'mac' && config.macLabel ? config.macLabel : config.label;
  const baseWidth = config.widthClass || 'w-14';
  const baseHeight = config.heightClass || 'h-14';

  return (
    <motion.div
      custom={theme}
      variants={{
        idle: (currentTheme: Theme) => ({
          scale: 1,
          y: 0,
          backgroundColor: currentTheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
          boxShadow: currentTheme === 'dark' 
            ? '0px 6px 0px rgba(15, 23, 42, 1)' 
            : '0px 6px 0px rgba(203, 213, 225, 1)',
          color: currentTheme === 'dark' ? 'rgba(148, 163, 184, 1)' : 'rgba(71, 85, 105, 1)',
          borderColor: currentTheme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 1)'
        }),
        pressed: {
          scale: 0.92,
          y: 4,
          backgroundColor: '#06b6d4', 
          boxShadow: [
            '0px 0px 15px 5px rgba(6, 182, 212, 0.6)', 
            '0px 0px 25px 10px rgba(168, 85, 247, 0.7)',
            '0px 0px 15px 5px rgba(236, 72, 153, 0.6)'
          ],
          color: '#ffffff',
          borderColor: 'transparent',
          transition: { 
            boxShadow: { repeat: Infinity, repeatType: "reverse", duration: 1 }
          }
        },
      }}
      initial="idle"
      animate={isPressed ? 'pressed' : 'idle'}
      transition={{ duration: 0.15, type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        ${baseWidth} ${baseHeight} rounded-lg flex items-center justify-center 
        backdrop-blur-md border text-sm font-semibold select-none
      `}
    >
      {label}
    </motion.div>
  );
};

export default function KeyboardTester() {
  const [osLayout, setOsLayout] = useState<OSLayout>('windows');
  const [theme, setTheme] = useState<Theme>('dark');
  const pressedKeys = useKeyboardListener();

  const toggleOS = useCallback(() => setOsLayout(p => p === 'windows' ? 'mac' : 'windows'), []);
  const toggleTheme = useCallback(() => setTheme(p => p === 'dark' ? 'light' : 'dark'), []);

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden relative transition-colors duration-500 flex flex-col items-center py-12 px-4 ${
      theme === 'dark' ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-100 text-slate-800'
    }`}>
      
      {/* Ambient Glow */}
      {theme === 'dark' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none" />
      )}

      {/* Header & Controls */}
      <div className="mb-10 flex flex-col items-center gap-6 z-10 text-center">
        <h1 className={`text-4xl font-extrabold tracking-tight ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent' : 'text-slate-900'}`}>
          Ultimate Keyboard Tester
        </h1>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
          Press any key to test your switches, N-key rollover, and media keys.
        </p>
        
        {/* Toggle Switches */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* OS Toggle */}
          <div className={`flex items-center gap-2 p-1.5 rounded-full border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white shadow-sm border-slate-200'}`}>
            <button
              onClick={() => setOsLayout('windows')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                osLayout === 'windows' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Windows
            </button>
            <button
              onClick={() => setOsLayout('mac')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                osLayout === 'mac' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              MacBook
            </button>
          </div>

          {/* Theme Toggle */}
          <div className={`flex items-center gap-2 p-1.5 rounded-full border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white shadow-sm border-slate-200'}`}>
            <button
              onClick={() => setTheme('dark')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                theme === 'dark' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              Dark Mode
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                theme === 'light' ? 'bg-slate-200 text-slate-800 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Light Mode
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Size Keyboard Wrapper */}
      <div className={`flex gap-6 p-6 rounded-2xl shadow-2xl z-10 w-full max-w-7xl mx-auto overflow-x-auto border ${
        theme === 'dark' ? 'bg-slate-900/60 backdrop-blur-xl border-slate-700' : 'bg-slate-200/50 border-slate-300'
      }`}>
        
        {/* Main 60% Block */}
        <div className="flex flex-col gap-2 min-w-max">
          {MAIN_LAYOUT.map((row, i) => (
            <div key={`main-${i}`} className="flex gap-2">
              {row.map((keyConfig) => (
                <Key key={keyConfig.code} config={keyConfig} isPressed={pressedKeys.has(keyConfig.code)} os={osLayout} theme={theme} />
              ))}
            </div>
          ))}
        </div>

        {/* Navigation Cluster */}
        <div className="flex flex-col gap-2 min-w-max">
          {NAV_LAYOUT.map((row, i) => (
            <div key={`nav-${i}`} className={`flex gap-2 ${i === 1 || i === 4 ? 'mt-4' : ''}`}>
              {row.map((keyConfig) => (
                <Key key={keyConfig.code} config={keyConfig} isPressed={pressedKeys.has(keyConfig.code)} os={osLayout} theme={theme} />
              ))}
            </div>
          ))}
        </div>

        {/* Numpad Cluster */}
        <div className="flex flex-col gap-2 min-w-max relative">
          {NUMPAD_LAYOUT.map((row, i) => (
            <div key={`num-${i}`} className="flex gap-2">
              {row.map((keyConfig) => (
                <Key key={keyConfig.code} config={keyConfig} isPressed={pressedKeys.has(keyConfig.code)} os={osLayout} theme={theme} />
              ))}
            </div>
          ))}
        </div>
      </div>

      

      {/* Active Key Counter */}
      <div className={`mt-12 text-sm z-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
        <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{pressedKeys.size}</span> key(s) currently pressed
      </div>
    </div>
  );
}