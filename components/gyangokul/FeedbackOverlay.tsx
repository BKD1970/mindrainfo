"use client";

import { useEffect, useRef } from "react";
import type { Gender } from "./gameTypes";

interface FeedbackOverlayProps {
  result: "correct" | "wrong";
  gender: Gender;
  onFinished: () => void;
}

export default function FeedbackOverlay({
  result,
  gender,
  onFinished,
}: FeedbackOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoSrc =
    result === "correct"
      ? gender === "boy"
        ? "/games/GyanGokul/videos/correct-boy.mp4"
        : "/games/GyanGokul/videos/correct-girl.mp4"
      : "/games/GyanGokul/videos/wrong-answer.mp4";

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = 0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Video could not autoplay:", error);
      }
    };

    playVideo();
  }, [videoSrc]);

  const handlePause = (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;

    // Automatically resume if the browser attempts to pause it.
    void video.play().catch(() => {});
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLVideoElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={
        result === "correct"
          ? "Correct answer feedback"
          : "Wrong answer feedback"
      }
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        preload="auto"
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        className="pointer-events-none h-full w-full select-none object-cover"
        onEnded={onFinished}
        onPause={handlePause}
        onContextMenu={handleContextMenu}
      />

      {/* Fallback text in case the video takes a moment to load */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center">
        <div className="inline-block rounded-full bg-black/50 px-5 py-2 text-sm font-bold text-white">
          {result === "correct"
            ? "🎉 Correct!"
            : "❌ Wrong Answer"}
        </div>
      </div>
    </div>
  );
}