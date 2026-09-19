"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { GameSettings } from "./gameTypes";
import type { QuizQuestion } from "./questionTypes";
import { createQuizSession } from "./questionSelector";
import FeedbackOverlay from "./FeedbackOverlay";

interface QuizScreenProps {
  settings: GameSettings;
  studentId: string;
  sessionNumber: number;
  onComplete: (score: number) => void;
}

function formatSubjectLabel(
  subject: string
): string {
  if (subject === "random") {
    return "Random";
  }

  return subject
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatClassLabel(
  classLevel: string
): string {
  if (
    classLevel === "KG1" ||
    classLevel === "KG2"
  ) {
    return classLevel;
  }

  return `Class ${classLevel}`;
}

export default function QuizScreen({
  settings,
  studentId,
  sessionNumber,
  onComplete,
}: QuizScreenProps) {
  const [questions, setQuestions] =
    useState<QuizQuestion[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [feedback, setFeedback] =
    useState<
      "correct" | "wrong" | null
    >(null);

  /*
   * Keeps the latest score synchronously
   * available for the final question.
   */
  const scoreRef =
    useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      setError(null);

      try {
        const newQuestions =
          await createQuizSession({
            classLevel:
              settings.classLevel,
            language:
              settings.language,
            subject:
              settings.subject,
            studentId,
            sessionNumber,
          });

        if (cancelled) {
          return;
        }

        if (
          newQuestions.length !== 10
        ) {
          throw new Error(
            "Exactly 10 questions were not generated."
          );
        }

        setQuestions(newQuestions);
        setCurrentIndex(0);
        setSelectedIndex(null);
        setScore(0);

        scoreRef.current = 0;

        setFeedback(null);
        setLoading(false);
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "We could not prepare the quiz."
          );

          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [
    settings.classLevel,
    settings.language,
    settings.subject,
    studentId,
    sessionNumber,
  ]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100 p-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">
          <div className="text-6xl">
            🧠
          </div>

          <h2 className="mt-5 text-2xl font-black text-orange-600">
            Preparing Your Quiz...
          </h2>

          <p className="mt-2 text-gray-500">
            Getting 10 fresh questions for you.
          </p>
        </div>
      </main>
    );
  }

  if (
    error ||
    questions.length !== 10
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-50 p-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="text-5xl">
            😕
          </div>

          <h2 className="mt-4 text-2xl font-black text-red-600">
            Quiz Error
          </h2>

          <p className="mt-2 text-gray-600">
            {error ||
              "Exactly 10 questions were not created."}
          </p>
        </div>
      </main>
    );
  }

  const question =
    questions[currentIndex];

  const answered =
    selectedIndex !== null;

  const handleAnswer = (
    index: number
  ) => {
    if (
      answered ||
      feedback !== null
    ) {
      return;
    }

    const correct =
      index ===
      question.correctIndex;

    setSelectedIndex(index);

    if (correct) {
      scoreRef.current += 1;

      setScore(
        scoreRef.current
      );

      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  /*
   * Called only after the feedback
   * video fires "ended".
   */
  const handleFeedbackFinished =
    () => {
      setFeedback(null);

      /*
       * Last question completed.
       */
      if (currentIndex === 9) {
        onComplete(
          scoreRef.current
        );
        return;
      }

      /*
       * Move to next question.
       */
      setCurrentIndex(
        (previous) =>
          previous + 1
      );

      setSelectedIndex(null);
    };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100 px-4 py-6">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <header className="mb-6 flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-lg">
            <div>
              <h1 className="text-xl font-black text-orange-600 md:text-2xl">
                Gyan Gokul
              </h1>

              <p className="text-sm text-gray-500">
                {formatClassLabel(
                  settings.classLevel
                )}
              </p>
            </div>

            <div className="rounded-xl bg-orange-100 px-4 py-2 font-black text-orange-700">
              Score: {score}
            </div>
          </header>

          {/* Progress */}
          <div className="mb-5 rounded-2xl bg-white p-4 shadow-lg">
            <div className="mb-2 flex justify-between text-sm font-bold text-gray-600">
              <span>
                Question{" "}
                {currentIndex + 1} of 10
              </span>

              <span>
                Session{" "}
                {sessionNumber}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                style={{
                  width: `${
                    ((currentIndex + 1) /
                      10) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <section className="rounded-3xl bg-white p-6 shadow-2xl md:p-10">
            <div className="mb-8">
              <div className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-500">
                {formatSubjectLabel(
                  String(
                    question.subject
                  )
                )}
              </div>

              <h2 className="text-2xl font-black leading-relaxed text-gray-800 md:text-4xl">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="grid gap-4">
              {question.options.map(
                (
                  option,
                  index
                ) => {
                  const selected =
                    selectedIndex ===
                    index;

                  const correct =
                    index ===
                    question.correctIndex;

                  let classes =
                    "border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50";

                  if (
                    answered &&
                    correct
                  ) {
                    classes =
                      "border-green-500 bg-green-50";
                  } else if (
                    answered &&
                    selected &&
                    !correct
                  ) {
                    classes =
                      "border-red-500 bg-red-50";
                  }

                  return (
                    <button
                      key={`${question.id}-${index}`}
                      type="button"
                      disabled={
                        answered
                      }
                      onClick={() =>
                        handleAnswer(
                          index
                        )
                      }
                      className={`rounded-2xl border-2 p-5 text-left text-lg font-bold text-gray-800 transition ${classes} ${
                        answered
                          ? "cursor-default"
                          : ""
                      }`}
                    >
                      <span className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      {option}
                    </button>
                  );
                }
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Full-screen feedback */}
      {feedback !== null && (
        <FeedbackOverlay
          result={feedback}
          gender={settings.gender}
          onFinished={
            handleFeedbackFinished
          }
        />
      )}
    </>
  );
}