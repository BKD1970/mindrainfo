"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. TYPES
// ==========================================

export type Theme = 'dark' | 'light';

interface StreamInfo {
  width: number;
  height: number;
  frameRate: number;
  aspectRatio: string;
}

// ==========================================
// 2. CUSTOM HOOK: MEDIA DEVICES & AUDIO
// ==========================================

function useHardwareTester() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize and get permissions
  const startTest = async (videoId?: string, audioId?: string) => {
    try {
      setError(null);
      // Stop existing stream tracks before starting a new one
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: videoId ? { deviceId: { exact: videoId } } : true,
        audio: audioId ? { deviceId: { exact: audioId } } : true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsTesting(true);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Extract Video Info
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        setStreamInfo({
          width: settings.width || 0,
          height: settings.height || 0,
          frameRate: Math.round(settings.frameRate || 0),
          aspectRatio: settings.width && settings.height 
            ? (settings.width / settings.height).toFixed(2) 
            : 'N/A'
        });
      }

      // Enumerate Devices (Now that we have permission)
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices);
      
      if (!videoId || !audioId) {
        const vDevice = allDevices.find(d => d.kind === 'videoinput');
        const aDevice = allDevices.find(d => d.kind === 'audioinput');
        if (vDevice) setSelectedVideo(vDevice.deviceId);
        if (aDevice) setSelectedAudio(aDevice.deviceId);
      }

      // Setup Audio Analyzer
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const actx = audioContextRef.current;
        if (actx.state === 'suspended') await actx.resume();

        const source = actx.createMediaStreamSource(new MediaStream([audioTrack]));
        const analyser = actx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateAudioLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          // Normalize to 0-100%
          const normalized = Math.min(100, Math.round((average / 128) * 100));
          setAudioLevel(normalized);
          rafIdRef.current = requestAnimationFrame(updateAudioLevel);
        };
        updateAudioLevel();
      }

    } catch (err: any) {
      console.error("Camera Error:", err);
      
      // Detailed error handling
      if (err.name === 'NotAllowedError') {
        setError('Permission denied. Please click the camera icon in your URL bar and allow access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera or microphone found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application (like Zoom or Teams). Close it and try again.');
      } else if (err.name === 'SecurityError') {
        setError('Blocked by browser security. You must use HTTPS or localhost to access the camera.');
      } else {
        setError(`Hardware Error: ${err.message || err.name}`);
      }
      setIsTesting(false);
    }
  };

  const stopTest = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    setStream(null);
    setIsTesting(false);
    setAudioLevel(0);
    setStreamInfo(null);
  }, [stream]);

  // Handle device change
  const handleDeviceChange = (type: 'video' | 'audio', deviceId: string) => {
    if (type === 'video') setSelectedVideo(deviceId);
    if (type === 'audio') setSelectedAudio(deviceId);
    if (isTesting) {
      startTest(
        type === 'video' ? deviceId : selectedVideo,
        type === 'audio' ? deviceId : selectedAudio
      );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTest();
  }, [stopTest]);

  return {
    isTesting,
    error,
    devices,
    selectedVideo,
    selectedAudio,
    audioLevel,
    streamInfo,
    videoRef,
    startTest,
    stopTest,
    handleDeviceChange
  };
}

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function CameraMicTester() {
  const [theme, setTheme] = useState<Theme>('dark');
  
  const {
    isTesting,
    error,
    devices,
    selectedVideo,
    selectedAudio,
    audioLevel,
    streamInfo,
    videoRef,
    startTest,
    stopTest,
    handleDeviceChange
  } = useHardwareTester();

  const videoDevices = devices.filter(d => d.kind === 'videoinput');
  const audioDevices = devices.filter(d => d.kind === 'audioinput');

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-500 flex flex-col items-center py-12 px-4 ${
      theme === 'dark' ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-100 text-slate-800'
    }`}>
      
      {/* Ambient Glow */}
      {theme === 'dark' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />
      )}

      {/* Header & Controls */}
      <div className="mb-10 flex flex-col items-center gap-6 z-10 text-center w-full max-w-5xl">
        <h1 className={`text-4xl font-extrabold tracking-tight ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent' : 'text-slate-900'}`}>
          Hardware A/V Tester
        </h1>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
          Verify your webcam resolution, framerate, and microphone input levels in real-time.
        </p>
        
        <div className={`flex items-center gap-2 p-1.5 rounded-full border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white shadow-sm border-slate-200'}`}>
          <button onClick={() => setTheme('dark')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}>Dark Mode</button>
          <button onClick={() => setTheme('light')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${theme === 'light' ? 'bg-slate-200 text-slate-800 shadow-md' : 'text-slate-400 hover:text-white'}`}>Light Mode</button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        
        {/* LEFT COLUMN: Camera Feed & Audio Meter */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Camera Viewport */}
          <div className={`relative aspect-video rounded-3xl overflow-hidden border backdrop-blur-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-black/50 border-slate-700 shadow-2xl' : 'bg-slate-200/50 border-slate-300 shadow-xl'
          }`}>
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-md z-20 p-8 text-center">
                <p className="text-red-500 font-bold text-lg">{error}</p>
              </div>
            )}

            {!isTesting && !error && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startTest()}
                className="px-8 py-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-colors z-10 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 6.75v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Start Camera & Mic Test
              </motion.button>
            )}

            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted // Always mute local video to prevent horrible audio feedback loops
              className={`w-full h-full object-cover transition-opacity duration-500 ${isTesting ? 'opacity-100' : 'opacity-0'}`} 
            />

            {/* Live Recording Indicator */}
            <AnimatePresence>
              {isTesting && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-bold text-white shadow-lg"
                >
                  <motion.div 
                    animate={{ opacity: [1, 0.3, 1] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  />
                  LIVE FEED
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Audio Volume Visualizer */}
          <div className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col gap-4 ${
            theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-white shadow-xl border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Microphone Input Level</h3>
              <span className={`text-sm font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{audioLevel}%</span>
            </div>
            
            {/* The Volume Bar */}
            <div className={`w-full h-6 rounded-full overflow-hidden flex items-center p-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div 
                animate={{ width: `${Math.max(2, audioLevel)}%` }}
                transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                style={{ 
                  boxShadow: audioLevel > 10 ? '0 0 15px rgba(52, 211, 153, 0.5)' : 'none',
                  backgroundColor: audioLevel > 85 ? '#ef4444' : '' // Turn red if peaking
                }}
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Controls & Metadata */}
        <div className="flex flex-col gap-6">
          
          {/* Hardware Specs Panel */}
          <div className={`p-6 rounded-3xl border backdrop-blur-xl ${
            theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-white shadow-xl border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Hardware Output</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Resolution</span>
                <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {streamInfo ? `${streamInfo.width}x${streamInfo.height}` : '---'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Aspect Ratio</span>
                <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {streamInfo ? streamInfo.aspectRatio : '---'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Frame Rate</span>
                <span className={`font-mono font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {streamInfo ? `${streamInfo.frameRate} FPS` : '---'}
                </span>
              </div>
            </div>
          </div>

          {/* Device Selection Panel */}
          <div className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col gap-4 ${
            theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-white shadow-xl border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Device Selection</h3>
            
            <div className="flex flex-col gap-2">
              <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Camera Input</label>
              <select 
                value={selectedVideo}
                onChange={(e) => handleDeviceChange('video', e.target.value)}
                disabled={!isTesting}
                className={`w-full p-3 rounded-xl border text-sm outline-none transition-colors ${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">{isTesting ? 'Select Camera' : 'Start test to view devices'}</option>
                {videoDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0,5)}`}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Microphone Input</label>
              <select 
                value={selectedAudio}
                onChange={(e) => handleDeviceChange('audio', e.target.value)}
                disabled={!isTesting}
                className={`w-full p-3 rounded-xl border text-sm outline-none transition-colors ${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">{isTesting ? 'Select Microphone' : 'Start test to view devices'}</option>
                {audioDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label || `Mic ${d.deviceId.slice(0,5)}`}</option>
                ))}
              </select>
            </div>

            {isTesting && (
              <button 
                onClick={stopTest}
                className="mt-4 w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors border border-slate-600 shadow-lg"
              >
                Stop Test
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}