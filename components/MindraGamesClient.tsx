"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import {
  createNextQuestion,
  type GeneratedQuestion,
  type QuestionLanguage,
} from "@/components/mindragames/questionGenerator";

type Language = {
  code: string;
  name: string;
  native: string;
};

const QUESTIONS_PER_EPISODE = 5;

const USED_QUESTION_STORAGE_KEY =
  "mindragames-used-question-ids";

const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "brx", name: "Bodo", native: "बड़ो" },
  { code: "doi", name: "Dogri", native: "डोगरी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ks", name: "Kashmiri", native: "कॉशुर" },
  { code: "kok", name: "Konkani", native: "कोंकणी" },
  { code: "mai", name: "Maithili", native: "मैथिली" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mni", name: "Manipuri", native: "মেইতেই" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
  { code: "sat", name: "Santali", native: "ᱥᱱᱛᱟᱲᱤ" },
  { code: "sd", name: "Sindhi", native: "سنڌي" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ur", name: "Urdu", native: "اُردُو" },
];

const I18N: Record<string, Record<string, string>> = {
  en: {
    badge: "🎮 MindraGames",
    title: "Dharma",
    title2: "Quiz",
    subtitle:
      "A mythology-inspired knowledge game with cinematic judgment scenes.",
    begin: "Begin Judgment →",
    language: "Choose your language",
    question: "Question",
    continue: "Continue →",
    episode: "Episode",
    episodeComplete: "Episode Complete",
    score: "Your Score",
    nextEpisode: "Go to Next Episode →",
    playAgain: "Play Again",
    back: "← Back to MindraGames",
    perfect: "Perfect knowledge run.",
    excellent: "Excellent knowledge.",
    good: "Good attempt. Keep learning.",
    learning: "A new journey of learning awaits.",
    creator: "Brahma opens the path to Svarga",
    creatorText:
      "A correct answer unlocks the game's celestial path.",
    death: "Yama has judged the answer",
    deathText:
      "The incorrect answer sends your game character toward the Naraka sequence.",
    finalNote:
      "This is a mythology-inspired entertainment game. It does not determine anyone's actual religious destiny.",
    justGame: "🎬 Just a Game!",
    justGameText:
      "The drama is part of the game. Your answers here do not decide your real-life spiritual fate.",
    questionCount: "Questions answered",
    correct: "correct",
    chooseLanguage: "Choose Language",
  },

  hi: {
    badge: "🎮 मिंडागेम्स",
    title: "धर्म",
    title2: "क्विज़",
    subtitle:
      "पौराणिक परंपराओं से प्रेरित ज्ञान-खेल, जिसमें सिनेमाई निर्णय दृश्य हैं।",
    begin: "निर्णय शुरू करें →",
    language: "अपनी भाषा चुनें",
    question: "प्रश्न",
    continue: "आगे बढ़ें →",
    episode: "एपिसोड",
    episodeComplete: "एपिसोड पूरा हुआ",
    score: "आपका स्कोर",
    nextEpisode: "अगले एपिसोड पर जाएँ →",
    playAgain: "फिर खेलें",
    back: "← मिंडागेम्स पर लौटें",
    perfect: "पूर्ण ज्ञान यात्रा।",
    excellent: "बहुत अच्छा ज्ञान।",
    good: "अच्छा प्रयास। सीखते रहें।",
    learning: "सीखने की एक नई यात्रा आपका इंतज़ार कर रही है।",
    creator: "ब्रह्मा ने स्वर्ग का मार्ग खोला",
    creatorText:
      "सही उत्तर से खेल में स्वर्ग वाला रास्ता खुलता है।",
    death: "यम ने उत्तर का निर्णय किया",
    deathText:
      "गलत उत्तर आपके गेम-पात्र को नरक वाले दृश्य की ओर ले जाता है।",
    finalNote:
      "यह पौराणिक परंपराओं से प्रेरित मनोरंजन गेम है। यह किसी व्यक्ति के वास्तविक धार्मिक भाग्य का निर्णय नहीं करता।",
    justGame: "🎬 यह सिर्फ़ एक गेम है!",
    justGameText:
      "नाटकीय दृश्य खेल का हिस्सा हैं। आपके उत्तर वास्तविक जीवन के आध्यात्मिक भाग्य का निर्णय नहीं करते।",
    questionCount: "उत्तर दिए गए प्रश्न",
    correct: "सही",
    chooseLanguage: "भाषा चुनें",
  },

  or: {
    badge: "🎮 ମିଣ୍ଡାଗେମ୍ସ",
    title: "ଧର୍ମ",
    title2: "କୁଇଜ୍",
    subtitle:
      "ପୁରାଣ ପରମ୍ପରାରୁ ପ୍ରେରିତ ଜ୍ଞାନ ଖେଳ, ଯେଉଁଥିରେ ସିନେମାଟିକ୍ ନ୍ୟାୟ ଦୃଶ୍ୟ ରହିଛି।",
    begin: "ନିର୍ଣ୍ଣୟ ଆରମ୍ଭ କରନ୍ତୁ →",
    language: "ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ",
    question: "ପ୍ରଶ୍ନ",
    continue: "ଆଗକୁ →",
    episode: "ଏପିସୋଡ୍",
    episodeComplete: "ଏପିସୋଡ୍ ସମାପ୍ତ",
    score: "ଆପଣଙ୍କ ସ୍କୋର",
    nextEpisode: "ପରବର୍ତ୍ତୀ ଏପିସୋଡ୍ →",
    playAgain: "ପୁଣି ଖେଳନ୍ତୁ",
    back: "← ମିଣ୍ଡାଗେମ୍ସକୁ ଫେରନ୍ତୁ",
    perfect: "ସମ୍ପୂର୍ଣ୍ଣ ଜ୍ଞାନ ଯାତ୍ରା।",
    excellent: "ଅତ୍ୟନ୍ତ ଭଲ।",
    good: "ଭଲ ପ୍ରୟାସ। ଶିଖୁଥାନ୍ତୁ।",
    learning: "ଶିଖିବାର ନୂଆ ଯାତ୍ରା ଅପେକ୍ଷା କରୁଛି।",
    creator: "ବ୍ରହ୍ମା ସ୍ୱର୍ଗର ପଥ ଖୋଲିଲେ",
    creatorText:
      "ସଠିକ୍ ଉତ୍ତର ଖେଳରେ ସ୍ୱର୍ଗ ପଥ ଖୋଲେ।",
    death: "ଯମ ଉତ୍ତରର ନ୍ୟାୟ କଲେ",
    deathText:
      "ଭୁଲ ଉତ୍ତର ଆପଣଙ୍କ ଗେମ୍ ପାତ୍ରକୁ ନରକ ଦୃଶ୍ୟକୁ ନେଇଯାଏ।",
    finalNote:
      "ଏହା ପୁରାଣ ପରମ୍ପରାରୁ ପ୍ରେରିତ ଏକ ମନୋରଞ୍ଜନ ଖେଳ। ଏହା କାହାର ବାସ୍ତବ ଧାର୍ମିକ ଭାଗ୍ୟ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ।",
    justGame: "🎬 ଏହା କେବଳ ଏକ ଗେମ୍!",
    justGameText:
      "ନାଟକୀୟ ଦୃଶ୍ୟ ଖେଳର ଅଂଶ। ଆପଣଙ୍କ ଉତ୍ତର ବାସ୍ତବ ଆଧ୍ୟାତ୍ମିକ ଭାଗ୍ୟ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ।",
    questionCount: "ଉତ୍ତର ଦିଆ ପ୍ରଶ୍ନ",
    correct: "ସଠିକ୍",
    chooseLanguage: "ଭାଷା ବାଛନ୍ତୁ",
  },
};

export default function MindraGamesClient() {
  const [language, setLanguage] = useState("en");

  const [started, setStarted] = useState(false);

  const [question, setQuestion] =
    useState<GeneratedQuestion | null>(null);

  const [selected, setSelected] =
    useState<number | null>(null);

  const [judgment, setJudgment] =
    useState<"correct" | "wrong" | null>(null);

  const [episode, setEpisode] = useState(1);

  const [episodeScore, setEpisodeScore] =
    useState(0);

  const [episodeAnswered, setEpisodeAnswered] =
    useState(0);

  const [finished, setFinished] = useState(false);

  const [playedIds, setPlayedIds] =
    useState<string[]>([]);

  const [mediaError, setMediaError] =
    useState<string | null>(null);

  const answerVideoRef =
    useRef<HTMLVideoElement | null>(null);

  const scoreVideoRef =
    useRef<HTMLVideoElement | null>(null);

  const supportedLanguage: QuestionLanguage =
    language === "en" ||
    language === "hi" ||
    language === "or"
      ? language
      : "hi";

  const t =
    I18N[language] ?? I18N.en;

  const languageLabel = useMemo(() => {
    const item = LANGUAGES.find(
      (languageItem) =>
        languageItem.code === language
    );

    return item
      ? `${item.name} · ${item.native}`
      : language;
  }, [language]);

  const progress = Math.min(
    100,
    Math.round(
      (episodeAnswered /
        QUESTIONS_PER_EPISODE) *
        100
    )
  );

  const mediaSrc =
    judgment === "wrong"
      ? "/games/videos/wrong-answer.mp4"
      : judgment === "correct"
        ? "/games/videos/correct-answer.mp4"
        : null;

  function nextFreshQuestion(
    ids: string[]
  ): GeneratedQuestion {
    return createNextQuestion(
      supportedLanguage,
      ids
    );
  }
function getStoredPlayedIds(): string[] {
  try {
    const stored =
      window.localStorage.getItem(
        USED_QUESTION_STORAGE_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is string =>
            typeof item === "string"
        )
      : [];
  } catch {
    return [];
  }
}

  function startGame() {
  const storedPlayedIds =
    getStoredPlayedIds();

  const first =
    nextFreshQuestion(
      storedPlayedIds
    );

  const updatedPlayedIds = Array.from(
    new Set([
      ...storedPlayedIds,
      first.id,
    ])
  );

  window.localStorage.setItem(
    USED_QUESTION_STORAGE_KEY,
    JSON.stringify(
      updatedPlayedIds
    )
  );

  setStarted(true);

  setFinished(false);

  setEpisode(1);

  setEpisodeScore(0);

  setEpisodeAnswered(0);

  setPlayedIds(updatedPlayedIds);

  setSelected(null);

  setJudgment(null);

  setMediaError(null);

  setQuestion(first);
}

  function changeLanguage(
    nextLanguage: string
  ) {
    setLanguage(nextLanguage);

    setStarted(false);

    setFinished(false);

    setQuestion(null);

    setSelected(null);

    setJudgment(null);

    setPlayedIds([]);

    setEpisode(1);

    setEpisodeScore(0);

    setEpisodeAnswered(0);

    setMediaError(null);
  }

  function answerQuestion(
    optionIndex: number
  ) {
    if (
      !question ||
      selected !== null
    ) {
      return;
    }

    const correct =
      optionIndex === question.answer;

    setSelected(optionIndex);

    setJudgment(
      correct ? "correct" : "wrong"
    );

    setEpisodeAnswered(
      (value) => value + 1
    );

    if (correct) {
      setEpisodeScore(
        (value) => value + 1
      );
    }

    setMediaError(null);

    window.setTimeout(() => {
      if (answerVideoRef.current) {
        answerVideoRef.current.currentTime = 0;

        answerVideoRef.current
          .play()
          .catch(() => {
            // Browser autoplay may require user interaction.
          });
      }
    }, 50);
  }

  function continueAfterJudgment() {
    if (!question) return;

    if (
      episodeAnswered >=
      QUESTIONS_PER_EPISODE
    ) {
      setFinished(true);

      setJudgment(null);

      setSelected(null);

      setMediaError(null);

      window.setTimeout(() => {
        if (scoreVideoRef.current) {
          scoreVideoRef.current.currentTime = 0;

          scoreVideoRef.current
            .play()
            .catch(() => {
              // Muted autoplay is normally allowed.
            });
        }
      }, 100);

      return;
    }

    const next =
      nextFreshQuestion(
        playedIds
      );

    setPlayedIds((ids) => {
  const updatedIds = Array.from(
    new Set([
      ...ids,
      next.id,
    ])
  );

  window.localStorage.setItem(
    USED_QUESTION_STORAGE_KEY,
    JSON.stringify(updatedIds)
  );

  return updatedIds;
});

    setQuestion(next);

    setSelected(null);

    setJudgment(null);

    setMediaError(null);
  }

  function goToNextEpisode() {
    const next =
      nextFreshQuestion(
        playedIds
      );

    setEpisode(
      (value) => value + 1
    );

    setEpisodeScore(0);

    setEpisodeAnswered(0);

    setQuestion(next);

    setPlayedIds((ids) => {
  const updatedIds = Array.from(
    new Set([
      ...ids,
      next.id,
    ])
  );

  window.localStorage.setItem(
    USED_QUESTION_STORAGE_KEY,
    JSON.stringify(updatedIds)
  );

  return updatedIds;
});

    setSelected(null);

    setJudgment(null);

    setFinished(false);

    setMediaError(null);

    window.setTimeout(() => {
      if (scoreVideoRef.current) {
        scoreVideoRef.current.pause();
      }
    }, 50);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      {/* =====================================================
          SOFT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50">
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="absolute -right-32 top-80 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="absolute bottom-[-120px] left-1/3 h-80 w-80 rounded-full bg-pink-200/20 blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-32">

        {/* =====================================================
            START SCREEN
        ====================================================== */}

        {!started ? (
          <div className="mx-auto max-w-4xl text-center">

            <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 shadow-sm">
              {t.badge}
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-7xl">
              {t.title}{" "}
              <span className="bg-gradient-to-r from-amber-500 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
                {t.title2}
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
              {t.subtitle}
            </p>

            {/* LANGUAGE */}

            <div className="mx-auto mt-8 max-w-md text-left">

              <label className="mb-2 block text-sm font-extrabold text-slate-700">
                {t.chooseLanguage}
              </label>

              <select
                value={language}
                onChange={(event) =>
                  changeLanguage(
                    event.target.value
                  )
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              >
                {LANGUAGES.map(
                  (item) => (
                    <option
                      key={item.code}
                      value={item.code}
                    >
                      {item.name} —{" "}
                      {item.native}
                    </option>
                  )
                )}
              </select>

            </div>

            {/* FEATURES */}

            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
  <div className="text-3xl">✨</div>

  <h2 className="mt-3 text-2xl font-black text-slate-900">
    Enjoy games when you are free.
  </h2>

  <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
    Take a break, test your knowledge, enjoy the experience, and
    come back for a new set of questions anytime.
  </p>
            </div>

            {/* EPISODE INFO */}

            <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-violet-100 bg-violet-50 p-5 text-sm text-violet-800">
              <strong>
                {QUESTIONS_PER_EPISODE}
              </strong>{" "}
              questions per episode.
              Score appears after each episode.
            </div>

            <button
              onClick={startGame}
              className="mt-8 w-full max-w-md rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 text-base font-black text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto"
            >
              {t.begin}
            </button>

            <p className="mx-auto mt-5 max-w-xl text-xs leading-5 text-slate-400">
              {t.finalNote}
            </p>

          </div>

        ) : finished ? (

          /* =====================================================
             EPISODE SCORE SCREEN
          ====================================================== */

          <div className="mx-auto max-w-4xl text-center">

            {/* LOOPING JUST-A-GAME VIDEO */}

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-black shadow-xl sm:rounded-[2rem]">

              <video
                ref={scoreVideoRef}
                src="/games/videos/just-a-game.mp4"
                controls
                autoPlay
                loop
                playsInline
                className="aspect-video w-full object-cover"
                onError={() =>
                  setMediaError(
                    "just-a-game.mp4"
                  )
                }
              />

            </div>

            <div className="mt-7 text-6xl sm:text-7xl">
              🏆
            </div>

            <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              {t.episode} {episode}
            </p>

            <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl md:text-5xl">
              {t.episodeComplete}
            </h1>

            <p className="mt-4 text-base text-slate-500 sm:text-lg">
              {t.questionCount}:{" "}
              <strong className="text-slate-900">
                {episodeAnswered}
              </strong>{" "}
              ·{" "}
              <strong className="text-slate-900">
                {episodeScore}
              </strong>{" "}
              {t.correct}
            </p>

            {/* SCORE */}

            <div className="mx-auto mt-7 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {t.score}
              </p>

              <div className="mt-3 text-6xl font-black text-slate-900 sm:text-7xl">
                {episodeScore}/
                {QUESTIONS_PER_EPISODE}
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {episodeScore ===
                QUESTIONS_PER_EPISODE
                  ? t.perfect
                  : episodeScore >= 4
                    ? t.excellent
                    : episodeScore >= 3
                      ? t.good
                      : t.learning}
              </p>

            </div>

            {/* JUST A GAME */}

            <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-6">

              <h2 className="text-2xl font-black text-amber-700">
                {t.justGame}
              </h2>

              <p className="mt-3 text-sm leading-6 text-amber-900/60">
                {t.justGameText}
              </p>

            </div>

            {mediaError && (
              <p className="mt-4 text-sm font-semibold text-red-600">
                Video file not found:{" "}
                {mediaError}
              </p>
            )}

            {/* NEXT EPISODE */}

            <button
              onClick={goToNextEpisode}
              className="mt-7 w-full max-w-md rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 font-black text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto"
            >
              {t.nextEpisode}
            </button>

            {/* PLAY AGAIN */}

            <div className="mt-4">

              <button
                onClick={startGame}
                className="rounded-2xl border border-slate-200 bg-white px-7 py-3 font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                {t.playAgain}
              </button>

            </div>

            <div className="mt-7">

              <Link
                href="/games"
                className="text-sm font-semibold text-slate-400 transition hover:text-slate-800"
              >
                {t.back}
              </Link>

            </div>

          </div>

        ) : (

          /* =====================================================
             QUESTION / JUDGMENT SCREEN
          ====================================================== */

          <div className="mx-auto max-w-4xl">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-600">
                  MindraGames
                </p>

                <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  {t.episode} {episode}
                </h1>

                <p className="mt-1 text-xs font-semibold text-slate-400 sm:text-sm">
                  {languageLabel}
                </p>

              </div>

              <div className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm sm:px-4 sm:text-sm">
                {episodeAnswered + 1} /{" "}
                {QUESTIONS_PER_EPISODE}
              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                style={{
                  width: `${Math.max(
                    3,
                    progress
                  )}%`,
                }}
              />

            </div>

            {judgment ? (

              /* =================================================
                 JUDGMENT VIDEO
              ================================================== */

              <div
                className={`mt-7 overflow-hidden rounded-[1.5rem] border bg-white p-3 shadow-xl sm:mt-10 sm:rounded-[2rem] sm:p-5 ${
                  judgment === "correct"
                    ? "border-amber-200"
                    : "border-red-200"
                }`}
              >

                <video
                  ref={answerVideoRef}
                  src={
                    mediaSrc ??
                    undefined
                  }
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full rounded-[1rem] bg-black object-cover sm:rounded-[1.5rem]"
                  onError={() =>
                    setMediaError(
                      judgment ===
                        "correct"
                        ? "correct-answer.mp4"
                        : "wrong-answer.mp4"
                    )
                  }
                />

                <div className="px-2 pb-3 text-center sm:px-4">

                  <div className="mt-6 text-5xl sm:text-6xl">
                    {judgment ===
                    "correct"
                      ? "🪷"
                      : "⚖️"}
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-slate-900 sm:text-4xl">
                    {judgment ===
                    "correct"
                      ? t.creator
                      : t.death}
                  </h2>

                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    {judgment ===
                    "correct"
                      ? t.creatorText
                      : t.deathText}
                  </p>

                  <div className="mx-auto mt-5 max-w-2xl rounded-2xl bg-slate-50 p-4 text-left">
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                      Explanation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {question?.explanation}
                    </p>
                  </div>

                  {mediaError && (
                    <p className="mt-4 text-sm font-semibold text-red-600">
                      Video file not found:{" "}
                      {mediaError}
                    </p>
                  )}

                  <button
                    onClick={
                      continueAfterJudgment
                    }
                    className="mt-6 w-full rounded-2xl bg-slate-900 px-7 py-4 font-black text-white shadow-lg transition hover:bg-slate-800 sm:w-auto"
                  >
                    {t.continue}
                  </button>

                </div>

              </div>

            ) : question ? (

              /* =================================================
                 QUESTION CARD
              ================================================== */

              <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl sm:mt-10 sm:rounded-[2rem] sm:p-8 md:p-10">

                <div className="inline-flex rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
                  {t.question}{" "}
                  {episodeAnswered + 1}
                </div>

                <h2 className="mt-5 text-2xl font-black leading-tight text-slate-900 sm:text-3xl md:text-4xl">
                  {question.question}
                </h2>

                {/* OPTIONS */}

                <div className="mt-7 grid gap-3 sm:mt-8 sm:gap-4">

                  {question.options.map(
                    (
                      option,
                      optionIndex
                    ) => (
                      <button
                        key={`${question.id}-${optionIndex}`}
                        type="button"
                        onClick={() =>
                          answerQuestion(
                            optionIndex
                          )
                        }
                        className="group flex min-h-[62px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 active:scale-[0.99] sm:gap-4 sm:p-4"
                      >

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-slate-500 shadow-sm transition group-hover:bg-cyan-500 group-hover:text-white">
                          {String.fromCharCode(
                            65 + optionIndex
                          )}
                        </span>

                        <span className="text-sm font-bold leading-6 text-slate-700 sm:text-base">
                          {option}
                        </span>

                      </button>
                    )
                  )}

                </div>

              </div>

            ) : null}

          </div>
        )}

      </section>
    </main>
  );
}