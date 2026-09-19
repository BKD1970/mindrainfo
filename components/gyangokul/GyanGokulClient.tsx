"use client";

import { useState } from "react";
import Onboarding from "./Onboarding";
import QuizScreen from "./QuizScreen";
import type { GameSettings } from "./gameTypes";
import { getOrCreateStudentId } from "./studentIdentity";

const pearlDrops = [
  { left: "4%", top: "8%", size: 18, delay: "0s", duration: "6s" },
  { left: "13%", top: "28%", size: 9, delay: "-2.4s", duration: "7s" },
  { left: "24%", top: "12%", size: 14, delay: "-1.2s", duration: "8s" },
  { left: "36%", top: "34%", size: 11, delay: "-3.2s", duration: "6.5s" },
  { left: "49%", top: "9%", size: 20, delay: "-1.8s", duration: "8.5s" },
  { left: "61%", top: "26%", size: 10, delay: "-4.1s", duration: "6.2s" },
  { left: "73%", top: "11%", size: 15, delay: "-2.7s", duration: "7.4s" },
  { left: "88%", top: "31%", size: 9, delay: "-1s", duration: "5.8s" },
  { left: "7%", top: "72%", size: 12, delay: "-3.9s", duration: "7.2s" },
  { left: "21%", top: "88%", size: 19, delay: "-2.1s", duration: "8.1s" },
  { left: "42%", top: "78%", size: 8, delay: "-4.4s", duration: "5.6s" },
  { left: "56%", top: "91%", size: 14, delay: "-1.5s", duration: "7.8s" },
  { left: "76%", top: "73%", size: 18, delay: "-3.4s", duration: "8.6s" },
  { left: "94%", top: "85%", size: 11, delay: "-0.7s", duration: "6.4s" },
];

function PearlBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(255,255,255,0.98),transparent_30%),radial-gradient(circle_at_86%_5%,rgba(255,255,255,0.95),transparent_28%),linear-gradient(135deg,#eafcff_0%,#fbfefe_48%,#effbea_100%)]" />

      <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl" />
      <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35 blur-3xl" />

      {pearlDrops.map((pearl, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-white/90 shadow-[inset_0_1px_3px_rgba(255,255,255,1),0_8px_24px_rgba(76,124,145,0.12)]"
          style={{
            left: pearl.left,
            top: pearl.top,
            width: pearl.size,
            height: pearl.size,
            animation: `gyanPearlFloat ${pearl.duration} ease-in-out infinite`,
            animationDelay: pearl.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function GyanGokulClient() {
  const [settings, setSettings] =
    useState<GameSettings | null>(null);

  const [studentId, setStudentId] =
    useState<string | null>(null);

  const [sessionNumber, setSessionNumber] =
    useState(0);

  const [lastScore, setLastScore] =
    useState<number | null>(null);

  const handleStart = (
    gameSettings: GameSettings
  ) => {
    const id = getOrCreateStudentId();

    setStudentId(id);
    setSettings(gameSettings);
    setSessionNumber(1);
    setLastScore(null);
  };

  const handleQuizComplete = (
    score: number
  ) => {
    setLastScore(score);
  };

  const handleNextSession = () => {
    setLastScore(null);

    setSessionNumber(
      (previous) => previous + 1
    );
  };

  /*
   * ========================================
   * ONBOARDING
   * ========================================
   */
  if (!settings) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#eefbfc]">
        <PearlBackground />

        <div className="relative z-10 min-h-screen">
          <Onboarding
            onStart={handleStart}
          />
        </div>

        <style jsx global>{`
          @keyframes gyanPearlFloat {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 0.45;
            }

            50% {
              transform: translate3d(0, -14px, 0) scale(1.08);
              opacity: 0.8;
            }
          }

          @keyframes gyanButtonPulse {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-2px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `}</style>
      </main>
    );
  }

  /*
   * ========================================
   * SCORE / SESSION END
   * ========================================
   */
  if (lastScore !== null) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black">

        {/* FULL-SCREEN BACKGROUND VIDEO + AUDIO */}

        <video
          key={`score-video-${sessionNumber}`}
          src="/games/GyanGokul/videos/score-background.mp4"
          autoPlay
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          onContextMenu={(event) =>
            event.preventDefault()
          }
        />

        {/* VERY LIGHT VIDEO DARKENING */}

        <div className="pointer-events-none absolute inset-0 bg-black/10" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />

        {/* FLOATING PEARL LIGHTS */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute left-[8%] top-[12%] h-4 w-4 rounded-full bg-white/60 shadow-[0_0_24px_rgba(255,255,255,0.8)] animate-pulse" />

          <div
            className="absolute right-[12%] top-[18%] h-3 w-3 rounded-full bg-white/60 shadow-[0_0_22px_rgba(255,255,255,0.8)] animate-pulse"
            style={{ animationDelay: "0.8s" }}
          />

          <div
            className="absolute left-[15%] bottom-[18%] h-3 w-3 rounded-full bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.75)] animate-pulse"
            style={{ animationDelay: "1.2s" }}
          />

          <div
            className="absolute right-[20%] bottom-[22%] h-5 w-5 rounded-full bg-white/50 shadow-[0_0_28px_rgba(255,255,255,0.8)] animate-pulse"
            style={{ animationDelay: "1.8s" }}
          />
        </div>

        {/* SCORE CONTENT DIRECTLY OVER VIDEO */}

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">

          <div className="w-full max-w-3xl text-center">

            <div className="text-7xl drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)] sm:text-8xl">
              🏆
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white drop-shadow-[0_5px_12px_rgba(0,0,0,0.65)] sm:text-5xl md:text-6xl">
              Amazing Work!
            </h1>

            <div className="mx-auto mt-4 max-w-xl text-base font-extrabold leading-7 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.75)] sm:text-lg md:text-xl">
              <p>
                You completed all 10 questions!
              </p>

              <p>
                Your learning adventure continues.
              </p>
            </div>

            <div className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] sm:text-base">
              Your Score
            </div>

            <div className="mt-1 text-7xl font-black tracking-[-0.07em] text-white drop-shadow-[0_7px_18px_rgba(0,0,0,0.8)] sm:text-8xl md:text-9xl">
              {lastScore}

              <span className="ml-2 text-4xl tracking-normal text-white/80 sm:text-5xl md:text-6xl">
                /10
              </span>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
              {Array.from({ length: 10 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-black sm:h-10 sm:w-10 sm:text-xl ${
                      index < lastScore
                        ? "text-yellow-300 drop-shadow-[0_3px_8px_rgba(0,0,0,0.65)]"
                        : "text-white/35 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                    }`}
                  >
                    {index < lastScore
                      ? "★"
                      : "·"}
                  </div>
                )
              )}
            </div>

            <div className="mt-7">
              <div className="text-lg font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.75)] sm:text-xl md:text-2xl">
                🍫 Your learning rewards
              </div>

              <div className="mt-2 text-sm font-bold text-white/90 drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)] sm:text-base">
                Every point you earned is a little celebration!
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextSession}
              className="score-next-button group relative mx-auto mt-8 flex w-full max-w-xl items-center justify-center gap-3 overflow-hidden rounded-[24px] bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-500 px-6 py-5 text-lg font-black text-white shadow-[0_20px_45px_rgba(236,72,153,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(236,72,153,0.45)] active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-pink-200 sm:text-xl"
            >
              <span className="absolute inset-y-0 -left-24 w-16 -skew-x-12 bg-white/40 blur-sm transition-all duration-700 group-hover:left-[125%]" />

              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-white/20 text-xl backdrop-blur">
                🚀
              </span>

              <span className="relative">
                Next Session
              </span>

              <span className="relative text-2xl transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

            <p className="mt-4 text-xs font-bold text-white/90 drop-shadow-[0_3px_8px_rgba(0,0,0,0.75)] sm:text-sm">
              Fresh questions are waiting for you ✨
            </p>

          </div>
        </div>

        <style jsx>{`
          .score-next-button {
            animation: scoreButtonFloat 3s ease-in-out infinite;
          }

          @keyframes scoreButtonFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-3px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .score-next-button {
              animation: none;
            }
          }
        `}</style>

      </main>
    );
  }

  /*
   * ========================================
   * QUIZ SCREEN
   * ========================================
   */

  /*
   * Student ID is created when Start is pressed.
   * Therefore it should normally always exist
   * whenever the quiz is displayed.
   */
  if (!studentId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-50 p-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="text-5xl">
            😕
          </div>

          <h2 className="mt-4 text-2xl font-black text-red-600">
            Unable to start the quiz
          </h2>

          <p className="mt-2 text-gray-600">
            We could not create your anonymous student ID.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eefbfc]">
      <PearlBackground />

      <div className="relative z-10 min-h-screen">
        <QuizScreen
          key={sessionNumber}
          settings={settings}
          studentId={studentId}
          sessionNumber={sessionNumber}
          onComplete={handleQuizComplete}
        />
      </div>

      <style jsx global>{`
        @keyframes gyanPearlFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.45;
          }

          50% {
            transform: translate3d(0, -14px, 0) scale(1.08);
            opacity: 0.8;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </main>
  );
}