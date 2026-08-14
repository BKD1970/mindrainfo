import Link from "next/link";

const promptPrinciples = [
  {
    number: "01",
    icon: "🎯",
    title: "Be Specific",
    description:
      "Clearly explain what you want the AI to accomplish instead of giving a vague instruction.",
  },
  {
    number: "02",
    icon: "📋",
    title: "Give Context",
    description:
      "Provide the background, audience, goal and information the AI needs to produce a useful response.",
  },
  {
    number: "03",
    icon: "👤",
    title: "Define the Role",
    description:
      "Tell the AI what perspective or expertise it should use when responding to your request.",
  },
  {
    number: "04",
    icon: "📐",
    title: "Specify the Format",
    description:
      "Tell the AI whether you want a table, bullet points, checklist, explanation, code or another format.",
  },
  {
    number: "05",
    icon: "🔍",
    title: "Add Constraints",
    description:
      "Set useful boundaries such as length, language, difficulty level, tone or required information.",
  },
  {
    number: "06",
    icon: "🔄",
    title: "Iterate",
    description:
      "Good prompting is often a conversation. Review the result and refine your instructions.",
  },
];

const promptExamples = [
  {
    title: "Writing",
    icon: "✍️",
    weak: "Write a post about data analytics.",
    strong:
      "Write a 150-word LinkedIn post explaining why Excel, SQL and Power BI are useful skills for beginners entering data analytics. Use a professional but beginner-friendly tone.",
  },
  {
    title: "Learning",
    icon: "📚",
    weak: "Explain SQL.",
    strong:
      "Teach me SQL as a complete beginner. Explain SELECT, WHERE and GROUP BY using one simple sales dataset and provide three practice questions.",
  },
  {
    title: "Data Analysis",
    icon: "📊",
    weak: "Analyze this data.",
    strong:
      "Act as a data analyst. Examine this sales dataset, identify the three most important trends, point out unusual values and present your findings in a concise table.",
  },
  {
    title: "Coding",
    icon: "💻",
    weak: "Fix my code.",
    strong:
      "Act as a senior JavaScript developer. Find the bug in the following code, explain why it happens, provide the corrected version and briefly explain each change.",
  },
];

const promptFormula = [
  "Role",
  "Task",
  "Context",
  "Constraints",
  "Output Format",
];

export default function PromptEngineeringPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}

      <header className="relative z-20 border-b border-gray-200 bg-white/85 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-purple-600">Mindra</span>
            <span>Info</span>
          </Link>

          <Link
            href="/ai"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
          >
            ← AI Hub
          </Link>

        </div>

      </header>

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-200px] right-[25%] h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm backdrop-blur-md">

              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />

              Prompt Engineering

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Ask better.
              <br />

              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Get better.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">

              Learn how to communicate effectively with AI, write clearer
              prompts and get more useful results from AI systems.

            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#fundamentals"
                className="rounded-xl bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-700"
              >
                Learn Prompting
              </a>

              <a
                href="#examples"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold transition hover:bg-gray-100"
              >
                See Examples
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* INTRODUCTION */}

      <section
        id="fundamentals"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              The Basics
            </p>

            <h2 className="mt-3 text-4xl font-black">
              What is Prompt Engineering?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">

              Prompt engineering is the practice of designing and refining
              instructions given to an AI system to produce a useful,
              relevant and reliable response.

            </p>

            <p className="mt-4 leading-8 text-gray-600">

              You don't need complicated technical language. The goal is
              simply to communicate your objective clearly and provide the
              AI with enough context to understand what you need.

            </p>

          </div>

          <div>

            <div className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-sm">

              <div className="text-5xl">
                💬
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Prompt → AI → Response
              </h3>

              <div className="mt-7 space-y-3">

                <div className="rounded-2xl bg-gray-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    You provide
                  </p>

                  <p className="mt-2 font-semibold">
                    A clear instruction and relevant context
                  </p>

                </div>

                <div className="text-center text-xl text-purple-500">
                  ↓
                </div>

                <div className="rounded-2xl bg-purple-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-purple-500">
                    AI processes
                  </p>

                  <p className="mt-2 font-semibold">
                    Your instructions using its learned patterns
                  </p>

                </div>

                <div className="text-center text-xl text-purple-500">
                  ↓
                </div>

                <div className="rounded-2xl bg-cyan-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                    Result
                  </p>

                  <p className="mt-2 font-semibold">
                    A response based on your request
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* PRINCIPLES */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Core Principles
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Six habits of better prompts
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              Strong prompts usually combine a clear objective with
              context, constraints and a useful output format.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {promptPrinciples.map((item) => (

              <div
                key={item.number}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-300 hover:bg-white hover:shadow-xl"
              >

                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-200/30 blur-2xl transition group-hover:bg-purple-300/50" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between">

                    <div className="text-4xl transition duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>

                    <span className="text-sm font-black text-purple-300">
                      {item.number}
                    </span>

                  </div>

                  <h3 className="mt-6 text-2xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {item.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* PROMPT FORMULA */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="rounded-[2rem] bg-gray-900 p-8 text-white md:p-14">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-400">
              A Simple Framework
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Build a better prompt.
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              A useful starting framework is to tell the AI who it should
              be, what it should do, what it needs to know and how you
              want the answer presented.
            </p>

          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

            {promptFormula.map((item, index) => (

              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition hover:bg-white/10"
              >

                <div className="text-sm font-bold text-purple-400">
                  0{index + 1}
                </div>

                <div className="mt-2 font-bold">
                  {item}
                </div>

              </div>

            ))}

          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Example structure
            </p>

            <p className="mt-4 leading-8 text-gray-300">

              <span className="font-bold text-purple-400">
                Role:
              </span>{" "}
              Act as a data analyst.
              <br />

              <span className="font-bold text-purple-400">
                Task:
              </span>{" "}
              Analyze this sales dataset.
              <br />

              <span className="font-bold text-purple-400">
                Context:
              </span>{" "}
              The dataset contains monthly sales from 2025.
              <br />

              <span className="font-bold text-purple-400">
                Constraints:
              </span>{" "}
              Focus on the three most important trends.
              <br />

              <span className="font-bold text-purple-400">
                Output:
              </span>{" "}
              Present the findings in a concise table.

            </p>

          </div>

        </div>

      </section>

      {/* EXAMPLES */}

      <section
        id="examples"
        className="border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Before & After
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Turn weak prompts into useful prompts
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              Compare a vague instruction with a more specific prompt.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {promptExamples.map((example) => (

              <article
                key={example.title}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-7"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                    {example.icon}
                  </div>

                  <h3 className="text-2xl font-black">
                    {example.title}
                  </h3>

                </div>

                <div className="mt-7">

                  <div className="rounded-2xl border border-red-100 bg-red-50 p-5">

                    <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                      Weak prompt
                    </p>

                    <p className="mt-2 text-sm leading-7 text-gray-700">
                      "{example.weak}"
                    </p>

                  </div>

                  <div className="my-3 text-center text-purple-500">
                    ↓
                  </div>

                  <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                      Better prompt
                    </p>

                    <p className="mt-2 text-sm leading-7 text-gray-700">
                      "{example.strong}"
                    </p>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

      {/* COMMON MISTAKES */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-10 md:grid-cols-2">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Avoid These
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Common prompting mistakes
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Prompt engineering is not about writing extremely long
              prompts. It is about providing the right information.
            </p>

          </div>

          <div className="space-y-4">

            {[
              "Being too vague about the desired result",
              "Giving no context about the problem",
              "Not specifying the target audience",
              "Expecting the AI to know missing information",
              "Using unnecessary complexity",
              "Accepting the first answer without reviewing it",
            ].map((mistake) => (

              <div
                key={mistake}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >

                <span className="text-red-500">
                  ×
                </span>

                <span className="font-semibold">
                  {mistake}
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* RESPONSIBLE AI */}

      <section className="mx-auto max-w-5xl px-6 pb-24 text-center">

        <div className="rounded-[2rem] border border-purple-100 bg-purple-50 p-10 md:p-14">

          <div className="text-4xl">
            🧠
          </div>

          <h2 className="mt-5 text-3xl font-black">
            Better prompts don't guarantee perfect answers.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            AI systems can still misunderstand instructions or produce
            incorrect information. Review important outputs and verify
            facts before relying on them.
          </p>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/ai"
            className="font-semibold text-purple-600 hover:text-purple-700"
          >
            ← Back to AI
          </Link>

        </div>

      </footer>

    </main>
  );
}