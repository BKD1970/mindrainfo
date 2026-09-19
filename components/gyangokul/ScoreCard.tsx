"use client";

import { useState } from "react";
import ChocolateReward from "./ChocolateReward";

interface ScoreCardProps {
  score: number;
  sessionNumber: number;
  onNextSession: () => void;
}

export default function ScoreCard({
  score,
  sessionNumber,
  onNextSession,
}: ScoreCardProps) {
  const [showKrishnaImage, setShowKrishnaImage] =
    useState(true);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100 px-4 py-8">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/70 bg-white/95 p-6 text-center shadow-2xl backdrop-blur md:p-10">

          {/* Trophy */}
          <div className="text-6xl md:text-7xl">
            🏆
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-4xl font-black text-orange-600 md:text-5xl">
            Quiz Complete!
          </h1>

          <p className="mt-2 text-gray-500">
            Session {sessionNumber}
          </p>

          {/* Krishna */}
          <div className="mt-8 flex justify-center">
            {showKrishnaImage ? (
              <img
                src="/games/GyanGokul/images/krishna.png"
                alt="Lord Krishna giving chocolates"
                className="h-64 w-64 rounded-3xl object-contain drop-shadow-xl md:h-80 md:w-80"
                onError={() =>
                  setShowKrishnaImage(false)
                }
              />
            ) : (
              <div
                className="flex h-64 w-64 flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-blue-100 to-blue-200 shadow-xl md:h-80 md:w-80"
                aria-label="Krishna illustration placeholder"
              >
                <div className="text-8xl">
                  🦚
                </div>

                <div className="mt-2 text-7xl">
                  🧒
                </div>

                <p className="mt-2 font-black text-blue-700">
                  Krishna
                </p>
              </div>
            )}
          </div>

          <p className="mt-5 text-xl font-bold text-gray-700">
            Well done! Krishna has a reward for you. 🙏
          </p>

          {/* Score */}
          <div className="mt-6 rounded-3xl bg-orange-50 p-6">
            <p className="text-lg font-bold text-gray-600">
              Your Score
            </p>

            <div className="mt-2 text-7xl font-black text-pink-500">
              {score}
              <span className="text-4xl text-gray-400">
                /10
              </span>
            </div>
          </div>

          {/* Chocolates */}
          <ChocolateReward score={score} />

          {/* Next session */}
          <button
            type="button"
            onClick={onNextSession}
            className="mt-10 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-5 text-xl font-black text-white shadow-lg transition hover:scale-[1.01] active:scale-[0.99]"
          >
            Next Session 🚀
          </button>
        </div>
      </div>
    </main>
  );
}