"use client";

import { useEffect, useRef, useState } from "react";

type ScrollVideoProps = {
  src: string;
  className?: string;
};

export default function ScrollVideo({
  src,
  className = "",
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.currentTime = 0;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.currentTime = 0;
          video.muted = true;
          setIsMuted(true);

          video.play().catch(() => {
            setIsPlaying(false);
          });
        } else {
          video.pause();
          video.currentTime = 0;
          video.muted = true;
          setIsMuted(true);
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();

      video.pause();

      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* VIDEO CONTROLS */}

      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2">

        {/* PLAY / PAUSE */}

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-lg text-white shadow-lg backdrop-blur-md transition hover:bg-black/75"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        {/* SOUND */}

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Turn sound on" : "Mute video"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-lg text-white shadow-lg backdrop-blur-md transition hover:bg-black/75"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

      </div>
    </div>
  );
}