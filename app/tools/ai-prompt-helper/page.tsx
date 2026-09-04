"use client";

import Link from "next/link";
import { useState } from "react";

const taskTypes = [
  "Writing",
  "YouTube Content",
  "Marketing",
  "Coding",
  "Learning",
  "Research",
  "Business",
  "Data Analysis",
  "Image Generation",
  "General",
];

const tones = [
  "Professional",
  "Friendly",
  "Conversational",
  "Persuasive",
  "Educational",
  "Creative",
  "Simple",
];

const detailLevels = [
  "Concise",
  "Balanced",
  "Detailed",
  "Very Detailed",
];

export default function AiPromptHelperPage() {
  const [taskType, setTaskType] = useState("Writing");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [detail, setDetail] = useState("Detailed");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState("");

  const generatePrompt = () => {
    if (!idea.trim()) {
      alert("Please describe what you want the AI to help you with.");
      return;
    }

    const prompt = `You are an expert ${taskType.toLowerCase()} assistant.

TASK:
${idea.trim()}

OBJECTIVE:
Understand the task clearly and produce the most useful result possible.

TARGET AUDIENCE:
${audience.trim() || "A general audience"}

TONE:
${tone}

LEVEL OF DETAIL:
${detail}

${requirements.trim() ? `ADDITIONAL REQUIREMENTS:\n${requirements.trim()}\n` : ""}
INSTRUCTIONS:
1. First understand the user's actual objective.
2. Do not invent important facts or assumptions.
3. Organize the response clearly.
4. Use practical examples where they improve understanding.
5. Keep the response focused on the requested outcome.
6. If important information is genuinely missing, state the assumption clearly.
7. Make the final answer accurate, useful and easy to understand.

OUTPUT:
Provide the final response in a clear and well-structured format.`;

    setResult(prompt);
  };

  const copyPrompt = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      alert("Prompt copied to clipboard.");
    } catch {
      alert("Unable to copy prompt.");
    }
  };

  const clearAll = () => {
    setIdea("");
    setAudience("");
    setRequirements("");
    setResult("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/tools"
          className="mb-6 inline-flex text-sm font-bold text-violet-600 hover:text-violet-800"
        >
          ← Back to Tools
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🤖</div>

          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            AI Prompt Helper
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Turn a rough idea into a clear, structured prompt for AI tools.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
            <h2 className="text-xl font-extrabold text-slate-900">
              Build Your Prompt
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Task Type
                </label>

                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                >
                  {taskTypes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  What do you want the AI to do?
                </label>

                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Example: I want to create a 10-minute YouTube video explaining why people should take action instead of waiting for motivation."
                  className="min-h-[150px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 leading-6 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Target Audience
                </label>

                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Example: College students and young professionals"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tone
                  </label>

                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    {tones.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Detail Level
                  </label>

                  <select
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    {detailLevels.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Additional Requirements
                </label>

                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Example: Include real-world examples, statistics and a strong conclusion."
                  className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 leading-6 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generatePrompt}
                  className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-700"
                >
                  ✨ Generate Prompt
                </button>

                <button
                  onClick={clearAll}
                  className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-100"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-slate-900">
                Generated Prompt
              </h2>

              <button
                onClick={copyPrompt}
                disabled={!result}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                📋 Copy
              </button>
            </div>

            <div className="mt-5 min-h-[500px] whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 font-mono text-sm leading-7 text-violet-200">
              {result || (
                <span className="text-slate-500">
                  Your structured prompt will appear here...
                </span>
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              This tool builds prompts locally in your browser. It does not
              send your prompt to an AI provider.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}