"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ClassLevel,
  Gender,
  GameSettings,
  Language,
  Subject,
} from "./gameTypes";

type OnboardingProps = {
  onStart: (settings: GameSettings) => void;
};

type LocalSettings = {
  language: Language;
  classLevel: ClassLevel;
  gender: Gender;
  subject: Subject;
};

const languages: Array<{
  code: Language;
  label: string;
  native: string;
  icon: string;
  glow: string;
  ring: string;
}> = [
  {
    code: "en",
    label: "English",
    native: "A B C",
    icon: "🌎",
    glow: "from-sky-500 to-cyan-400",
    ring: "ring-sky-300",
  },
  {
    code: "hi",
    label: "हिंदी",
    native: "अ आ इ",
    icon: "🇮🇳",
    glow: "from-orange-500 to-amber-400",
    ring: "ring-orange-300",
  },
  {
    code: "or",
    label: "ଓଡ଼ିଆ",
    native: "ଅ ଆ ଇ",
    icon: "✨",
    glow: "from-emerald-500 to-lime-400",
    ring: "ring-emerald-300",
  },
];

const classLevels: Array<{
  value: ClassLevel;
  label: string;
}> = [
  {
    value: "KG1",
    label: "KG1",
  },
  {
    value: "KG2",
    label: "KG2",
  },
  ...Array.from(
    { length: 10 },
    (_, index) => {
      const classNumber =
        String(index + 1) as ClassLevel;

      return {
        value: classNumber,
        label: `Class ${index + 1}`,
      };
    }
  ),
];

const pearls = [
  {
    left: "4%",
    top: "7%",
    size: 18,
    delay: "0s",
    duration: "5.8s",
    opacity: 0.62,
  },
  {
    left: "15%",
    top: "31%",
    size: 10,
    delay: "-2.2s",
    duration: "6.8s",
    opacity: 0.42,
  },
  {
    left: "26%",
    top: "11%",
    size: 14,
    delay: "-1.3s",
    duration: "7.2s",
    opacity: 0.55,
  },
  {
    left: "37%",
    top: "24%",
    size: 8,
    delay: "-3.1s",
    duration: "5.2s",
    opacity: 0.48,
  },
  {
    left: "52%",
    top: "8%",
    size: 21,
    delay: "-1.7s",
    duration: "8.4s",
    opacity: 0.5,
  },
  {
    left: "67%",
    top: "28%",
    size: 12,
    delay: "-4.2s",
    duration: "6.2s",
    opacity: 0.56,
  },
  {
    left: "78%",
    top: "10%",
    size: 16,
    delay: "-2.8s",
    duration: "7.5s",
    opacity: 0.46,
  },
  {
    left: "90%",
    top: "30%",
    size: 9,
    delay: "-1.1s",
    duration: "5.7s",
    opacity: 0.58,
  },
  {
    left: "9%",
    top: "72%",
    size: 13,
    delay: "-4s",
    duration: "7.1s",
    opacity: 0.45,
  },
  {
    left: "25%",
    top: "86%",
    size: 19,
    delay: "-1.9s",
    duration: "8.2s",
    opacity: 0.52,
  },
  {
    left: "50%",
    top: "79%",
    size: 11,
    delay: "-3.5s",
    duration: "6.5s",
    opacity: 0.44,
  },
  {
    left: "72%",
    top: "88%",
    size: 16,
    delay: "-2.4s",
    duration: "7.8s",
    opacity: 0.5,
  },
  {
    left: "94%",
    top: "76%",
    size: 13,
    delay: "-0.8s",
    duration: "6.1s",
    opacity: 0.55,
  },
];

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

export default function Onboarding({
  onStart,
}: OnboardingProps) {
  const [settings, setSettings] =
    useState<LocalSettings>({
      language: "en",
      classLevel: "1",
      gender: "boy",
      subject: "random",
    });

  const [
    subjectOptions,
    setSubjectOptions,
  ] = useState<Subject[]>([
    "random",
  ]);

  const [
    subjectsLoading,
    setSubjectsLoading,
  ] = useState(false);

  const [
    subjectsError,
    setSubjectsError,
  ] = useState<string | null>(null);

  const selectedLanguage =
    languages.find(
      (item) =>
        item.code ===
        settings.language
    ) ?? languages[0];

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      setSubjectsLoading(true);
      setSubjectsError(null);

      /*
       * Always reset to Random when
       * class/language changes.
       */
      setSettings((current) => ({
        ...current,
        subject: "random",
      }));

      try {
        const params =
          new URLSearchParams({
            classLevel:
              settings.classLevel,
            language:
              settings.language,
          });

        const response =
          await fetch(
            `/api/gyangokul/question-options?${params.toString()}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Unable to load subjects."
          );
        }

        const data =
          (await response.json()) as {
            subjects?: string[];
          };

        const subjects =
          Array.isArray(data.subjects)
            ? data.subjects.filter(
                (
                  value
                ): value is string =>
                  typeof value ===
                    "string" &&
                  value.trim()
                    .length > 0
              )
            : [];

        const uniqueSubjects =
          Array.from(
            new Set([
              "random",
              ...subjects,
            ])
          );

        if (!cancelled) {
          setSubjectOptions(
            uniqueSubjects
          );
        }
      } catch (error) {
        console.error(
          "GyanGokul subject loading error:",
          error
        );

        if (!cancelled) {
          setSubjectOptions([
            "random",
          ]);

          setSubjectsError(
            "Subjects could not be loaded."
          );
        }
      } finally {
        if (!cancelled) {
          setSubjectsLoading(false);
        }
      }
    }

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, [
    settings.classLevel,
    settings.language,
  ]);

  const updateLanguage = (
    language: Language
  ) => {
    setSettings((current) => ({
      ...current,
      language,
    }));
  };

  const updateClass = (
    classLevel: ClassLevel
  ) => {
    setSettings((current) => ({
      ...current,
      classLevel,
      subject: "random",
    }));
  };

  const updateSubject = (
    subject: Subject
  ) => {
    setSettings((current) => ({
      ...current,
      subject,
    }));
  };

  const updateGender = (
    gender: Gender
  ) => {
    setSettings((current) => ({
      ...current,
      gender,
    }));
  };

  const handleStart = () => {
    onStart(settings);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.98),transparent_34%),radial-gradient(circle_at_85%_13%,rgba(255,255,255,0.92),transparent_28%),linear-gradient(135deg,#e9fbff_0%,#fdfefe_48%,#effbea_100%)] px-4 py-5 sm:px-6 lg:px-8">

      {/* ===================================== */}
      {/* PEARL BACKGROUND */}
      {/* ===================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pearls.map((pearl, index) => (
          <span
            key={index}
            className="pearl-drop absolute rounded-full bg-white shadow-[inset_0_1px_3px_rgba(255,255,255,1),0_8px_22px_rgba(72,136,158,0.11)]"
            style={{
              left: pearl.left,
              top: pearl.top,
              width: pearl.size,
              height: pearl.size,
              opacity: pearl.opacity,
              animationDelay:
                pearl.delay,
              animationDuration:
                pearl.duration,
            }}
          />
        ))}

        <div className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-cyan-100/45 blur-3xl" />

        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-emerald-100/55 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl" />
      </div>

      {/* ===================================== */}
      {/* MAIN */}
      {/* ===================================== */}

      <section className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(390px,0.85fr)] lg:items-center lg:gap-12 xl:gap-16">

          {/* ================================= */}
          {/* LEFT HERO */}
          {/* ================================= */}

          <div className="px-1 py-3 sm:px-3 lg:py-10">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/75 px-4 py-2 text-sm font-black text-slate-700 shadow-[0_10px_30px_rgba(54,93,114,0.08)] backdrop-blur-xl">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-sm shadow-inner">
                🎓
              </span>

              Learn • Play • Grow
            </div>

            <div className="max-w-2xl">
              <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] text-slate-900 sm:text-7xl xl:text-[88px]">
                Welcome to

                <span className="mt-2 block bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  Gyan Gokul
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-slate-600 sm:text-xl">
                A playful learning space where every answer feels like a tiny
                celebration. Pick your language, class and player — then
                let&apos;s begin!
              </p>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">

              <div className="rounded-[26px] border border-white/90 bg-white/60 p-4 shadow-[0_16px_40px_rgba(56,95,112,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1">
                <div className="text-2xl">
                  🧠
                </div>

                <div className="mt-2 text-xl font-black text-slate-900">
                  10
                </div>

                <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                  Questions
                </div>
              </div>

              <div className="rounded-[26px] border border-white/90 bg-white/60 p-4 shadow-[0_16px_40px_rgba(56,95,112,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1">
                <div className="text-2xl">
                  🎬
                </div>

                <div className="mt-2 text-xl font-black text-slate-900">
                  Fun
                </div>

                <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                  Video Rewards
                </div>
              </div>

              <div className="rounded-[26px] border border-white/90 bg-white/60 p-4 shadow-[0_16px_40px_rgba(56,95,112,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1">
                <div className="text-2xl">
                  🍫
                </div>

                <div className="mt-2 text-xl font-black text-slate-900">
                  Score
                </div>

                <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                  Chocolates
                </div>
              </div>

            </div>

            <div className="mt-8 hidden items-center gap-3 text-sm font-extrabold text-slate-500 lg:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.12)]" />

              Made for curious young learners

              <span className="text-slate-300">
                •
              </span>

              KG1 to Class 10
            </div>
          </div>

          {/* ================================= */}
          {/* RIGHT SETUP CARD */}
          {/* ================================= */}

          <div className="relative mx-auto w-full max-w-xl">

            <div className="absolute -inset-4 rounded-[40px] bg-white/25 blur-2xl" />

            <div className="relative overflow-hidden rounded-[34px] border border-white/95 bg-white/82 p-5 shadow-[0_28px_80px_rgba(45,87,108,0.16)] backdrop-blur-2xl sm:p-7">

              <div className="mb-6 flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Let&apos;s set up your game
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    Choose your adventure
                  </h2>
                </div>

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-xl text-white shadow-lg">
                  ✨
                </div>
              </div>

              {/* STEPS */}

              <div className="mb-7 flex items-center gap-2">

                {[
                  ["1", "Language"],
                  ["2", "Class"],
                  ["3", "Subject"],
                  ["4", "Player"],
                ].map(
                  ([number, label], index) => (
                    <div
                      key={number}
                      className="flex min-w-0 flex-1 items-center gap-2"
                    >
                      <div className="flex items-center gap-2">

                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 text-xs font-black text-sky-700">
                          {number}
                        </span>

                        <span className="hidden text-xs font-black text-slate-500 sm:inline">
                          {label}
                        </span>
                      </div>

                      {index < 3 && (
                        <span className="h-px flex-1 bg-slate-200" />
                      )}
                    </div>
                  )
                )}

              </div>

              {/* LANGUAGE */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-sm font-black text-slate-800">
                    🌎 Choose language
                  </label>

                  <span className="text-xs font-extrabold text-slate-400">
                    {selectedLanguage.label}
                  </span>

                </div>

                <div className="grid grid-cols-3 gap-2.5">

                  {languages.map(
                    (language) => {
                      const selected =
                        settings.language ===
                        language.code;

                      return (
                        <button
                          key={
                            language.code
                          }
                          type="button"
                          aria-pressed={
                            selected
                          }
                          onClick={() =>
                            updateLanguage(
                              language.code
                            )
                          }
                          className={`group relative overflow-hidden rounded-2xl border-2 px-2 py-3.5 text-left transition duration-300 focus:outline-none focus:ring-4 ${
                            selected
                              ? `border-transparent bg-gradient-to-br ${language.glow} text-white shadow-[0_12px_28px_rgba(23,120,153,0.23)] ring-2 ${language.ring}`
                              : "border-slate-200 bg-white/80 text-slate-700 hover:-translate-y-1 hover:border-slate-300 hover:bg-white"
                          }`}
                        >
                          <span
                            className={`absolute right-2 top-2 h-2 w-2 rounded-full ${
                              selected
                                ? "bg-white"
                                : "bg-slate-200"
                            }`}
                          />

                          <span className="text-lg">
                            {
                              language.icon
                            }
                          </span>

                          <span className="mt-2 block text-sm font-black leading-4">
                            {
                              language.label
                            }
                          </span>

                          <span
                            className={`mt-1 block text-[10px] font-bold ${
                              selected
                                ? "text-white/80"
                                : "text-slate-400"
                            }`}
                          >
                            {
                              language.native
                            }
                          </span>
                        </button>
                      );
                    }
                  )}

                </div>
              </div>

              {/* CLASS */}

              <div className="mt-6">

                <label
                  htmlFor="gyangokul-class"
                  className="mb-3 block text-sm font-black text-slate-800"
                >
                  🎒 Pick your class
                </label>

                <div className="relative">

                  <select
                    id="gyangokul-class"
                    value={
                      settings.classLevel
                    }
                    onChange={(event) =>
                      updateClass(
                        event.target
                          .value as ClassLevel
                      )
                    }
                    className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-white/90 px-4 py-4 pr-12 text-base font-black text-slate-800 shadow-[0_6px_20px_rgba(45,87,108,0.05)] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  >
                    {classLevels.map(
                      (item) => (
                        <option
                          key={item.value}
                          value={
                            item.value
                          }
                        >
                          {item.label}
                        </option>
                      )
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                    ⌄
                  </span>

                </div>
              </div>

              {/* SUBJECT */}

              <div className="mt-6">

                <div className="mb-3 flex items-center justify-between">

                  <label
                    htmlFor="gyangokul-subject"
                    className="text-sm font-black text-slate-800"
                  >
                    📚 Choose subject
                  </label>

                  <span className="text-xs font-extrabold text-slate-400">
                    {subjectsLoading
                      ? "Loading..."
                      : formatSubjectLabel(
                          String(
                            settings.subject
                          )
                        )}
                  </span>

                </div>

                <div className="relative">

                  <select
                    id="gyangokul-subject"
                    value={
                      settings.subject
                    }
                    onChange={(event) =>
                      updateSubject(
                        event.target
                          .value as Subject
                      )
                    }
                    disabled={
                      subjectsLoading
                    }
                    className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-white/90 px-4 py-4 pr-12 text-base font-black text-slate-800 shadow-[0_6px_20px_rgba(45,87,108,0.05)] outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-wait disabled:opacity-70"
                  >
                    {subjectOptions.map(
                      (subject) => (
                        <option
                          key={subject}
                          value={subject}
                        >
                          {formatSubjectLabel(
                            subject
                          )}
                        </option>
                      )
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                    ⌄
                  </span>

                </div>

                {subjectsError && (
                  <p className="mt-2 text-xs font-bold text-amber-600">
                    {subjectsError} Random
                    mode is still available.
                  </p>
                )}

              </div>

              {/* GENDER */}

              <div className="mt-6">

                <div className="mb-3 flex items-center justify-between">

                  <span className="text-sm font-black text-slate-800">
                    🧒 Who is playing today?
                  </span>

                  <span className="text-xs font-extrabold text-slate-400">
                    Pick one
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  {/* BOY */}

                  <button
                    type="button"
                    aria-pressed={
                      settings.gender ===
                      "boy"
                    }
                    onClick={() =>
                      updateGender(
                        "boy"
                      )
                    }
                    className={`group relative overflow-hidden rounded-3xl border-2 p-4 text-left transition duration-300 focus:outline-none focus:ring-4 ${
                      settings.gender ===
                      "boy"
                        ? "border-transparent bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-[0_14px_30px_rgba(60,88,125,0.2)] ring-2 ring-sky-300"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:-translate-y-1 hover:border-slate-300 hover:bg-white"
                    }`}
                  >

                    <span className="absolute -right-2 -top-2 text-6xl opacity-10 transition duration-300 group-hover:scale-110">
                      👦
                    </span>

                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-3xl shadow-sm">
                      👦
                    </span>

                    <span className="mt-3 block text-lg font-black">
                      Boy
                    </span>

                    <span
                      className={`mt-0.5 block text-xs font-bold ${
                        settings.gender ===
                        "boy"
                          ? "text-white/80"
                          : "text-slate-400"
                      }`}
                    >
                      Ready to explore
                    </span>

                  </button>

                  {/* GIRL */}

                  <button
                    type="button"
                    aria-pressed={
                      settings.gender ===
                      "girl"
                    }
                    onClick={() =>
                      updateGender(
                        "girl"
                      )
                    }
                    className={`group relative overflow-hidden rounded-3xl border-2 p-4 text-left transition duration-300 focus:outline-none focus:ring-4 ${
                      settings.gender ===
                      "girl"
                        ? "border-transparent bg-gradient-to-br from-fuchsia-500 to-pink-400 text-white shadow-[0_14px_30px_rgba(60,88,125,0.2)] ring-2 ring-pink-300"
                        : "border-slate-200 bg-white/80 text-slate-700 hover:-translate-y-1 hover:border-slate-300 hover:bg-white"
                    }`}
                  >

                    <span className="absolute -right-2 -top-2 text-6xl opacity-10 transition duration-300 group-hover:scale-110">
                      👧
                    </span>

                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-3xl shadow-sm">
                      👧
                    </span>

                    <span className="mt-3 block text-lg font-black">
                      Girl
                    </span>

                    <span
                      className={`mt-0.5 block text-xs font-bold ${
                        settings.gender ===
                        "girl"
                          ? "text-white/80"
                          : "text-slate-400"
                      }`}
                    >
                      Ready to shine
                    </span>

                  </button>

                </div>
              </div>

              {/* START BUTTON */}

              <button
                type="button"
                onClick={
                  handleStart
                }
                disabled={
                  subjectsLoading
                }
                className="start-game-button group relative mt-7 flex w-full items-center justify-center gap-3 overflow-hidden rounded-[22px] bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-6 py-4 text-lg font-black text-white shadow-[0_18px_38px_rgba(13,148,136,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(13,148,136,0.3)] active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-wait disabled:opacity-70"
              >

                <span className="absolute inset-y-0 -left-20 w-16 -skew-x-12 bg-white/30 blur-sm transition-all duration-700 group-hover:left-[120%]" />

                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-xl backdrop-blur">
                  ▶
                </span>

                <span>
                  {subjectsLoading
                    ? "Loading Subjects..."
                    : "Start My Adventure"}
                </span>

                <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-bold text-slate-400">
                <span>
                  🌟 10 questions
                </span>

                <span>•</span>

                <span>
                  🎬 instant feedback
                </span>

                <span>•</span>

                <span>
                  🍫 rewards
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .pearl-drop {
          animation-name: pearlFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }

        .start-game-button {
          animation: startButtonFloat 3.1s ease-in-out infinite;
        }

        @keyframes pearlFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(0, -14px, 0) scale(1.08);
          }
        }

        @keyframes startButtonFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-2px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pearl-drop,
          .start-game-button {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}