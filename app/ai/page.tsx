import Link from "next/link";

const aiTopics = [
  {
    title: "AI Tools",
    icon: "🧰",
    description:
      "Discover useful AI tools for writing, research, design, coding, productivity and everyday work.",
  },
  {
    title: "Generative AI",
    icon: "✨",
    description:
      "Understand how AI can generate text, images, audio, video and other types of content.",
  },
  {
    title: "Prompt Engineering",
    icon: "💬",
    description:
      "Learn how to communicate effectively with AI and create better prompts for better results.",
  },
  {
    title: "AI Automation",
    icon: "⚙️",
    description:
      "Explore how AI can automate repetitive tasks and improve productivity.",
  },
  {
    title: "AI & Careers",
    icon: "🚀",
    description:
      "Understand how artificial intelligence is changing jobs and creating new career opportunities.",
  },
  {
    title: "Machine Learning",
    icon: "🧠",
    description:
      "Learn the fundamentals of machine learning and how computers learn patterns from data.",
  },
];

const aiIdeas = [
  "Use AI to learn faster",
  "Automate repetitive tasks",
  "Analyze information",
  "Create content",
  "Improve productivity",
  "Build AI-powered projects",
];

export default function AIPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f4] text-gray-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="relative z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-purple-600">Mindra</span>
            <span>Info</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
          >
            ← Home
          </Link>

        </div>

      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">

        {/* Soft futuristic background */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-cyan-300/25 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-200px] right-[25%] h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-3xl" />

        {/* Subtle neural network */}

        <div className="pointer-events-none absolute right-[8%] top-[20%] hidden opacity-20 lg:block">

          <svg
            width="360"
            height="360"
            viewBox="0 0 360 360"
            fill="none"
          >

            <circle
              cx="80"
              cy="80"
              r="5"
              className="fill-purple-500"
            />

            <circle
              cx="200"
              cy="120"
              r="5"
              className="fill-blue-500"
            />

            <circle
              cx="120"
              cy="230"
              r="5"
              className="fill-cyan-500"
            />

            <circle
              cx="280"
              cy="220"
              r="5"
              className="fill-purple-500"
            />

            <circle
              cx="230"
              cy="300"
              r="5"
              className="fill-blue-500"
            />

            <path
              d="M80 80 L200 120 L120 230 L280 220 L230 300"
              stroke="currentColor"
              strokeWidth="1"
              className="text-purple-500"
            />

            <path
              d="M120 230 L230 300"
              stroke="currentColor"
              strokeWidth="1"
              className="text-cyan-500"
            />

          </svg>

        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm backdrop-blur-md">

              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />

              Artificial Intelligence

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Understand AI.
              <br />

              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Use it intelligently.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Learn how artificial intelligence works, discover useful AI
              tools and understand how this technology can change the way
              we learn, work and build.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#ai-topics"
                className="rounded-xl bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-700"
              >
                Explore AI
              </a>

              <a
                href="#ai-roadmap"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold transition hover:bg-gray-100"
              >
                Start Learning
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          AI TOPICS
      ====================================================== */}

      <section
        id="ai-topics"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
            Explore AI
          </p>

          <h2 className="mt-3 text-4xl font-black">
            What do you want to learn?
          </h2>

          <p className="mt-4 max-w-2xl text-gray-600">
            Artificial intelligence is much bigger than chatbots. Explore
            different areas and understand how they can be useful in real
            life.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {aiTopics.map((topic) => (

            <div
              key={topic.title}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl"
            >

              {/* Subtle AI glow */}

              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-200/30 blur-2xl transition group-hover:bg-purple-300/50" />

              <div className="relative z-10">

                <div className="text-4xl transition duration-300 group-hover:scale-110">
                  {topic.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {topic.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {topic.description}
                </p>

{topic.title === "AI Tools" ? (
  <Link
    href="/ai/tools"
    className="mt-6 inline-block text-sm font-bold text-purple-600 transition hover:text-purple-800"
  >
    Explore →
  </Link>
) : topic.title === "Generative AI" ? (
  <Link
    href="/ai/generative-ai"
    className="mt-6 inline-block text-sm font-bold text-purple-600 transition hover:text-purple-800"
  >
    Explore →
  </Link>
) : topic.title === "Prompt Engineering" ? (
  <Link
    href="/ai/prompt-engineering"
    className="mt-6 inline-block text-sm font-bold text-purple-600 transition hover:text-purple-800"
  >
    Explore →
  </Link>
) : topic.title === "AI Automation" ? (
  <Link
    href="/ai/automation"
    className="mt-6 inline-block text-sm font-bold text-purple-600 transition hover:text-purple-800"
  >
    Explore →
  </Link>
) : topic.title === "AI & Careers" ? (
  <Link
    href="/ai/careers"
    className="mt-6 inline-block text-sm font-bold text-purple-600 transition hover:text-purple-800"
  >
    Explore →
  </Link>
) : topic.title === "Machine Learning" ? (
  <Link
    href="/ai/machine-learning"
    className="mt-6 inline-block text-sm font-bold text-purple-600 transition hover:text-purple-800"
  >
    Explore →
  </Link>
) : (
  <span className="mt-6 inline-block text-sm font-bold text-gray-400">
    Coming Soon →
  </span>
)}

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* =====================================================
          AI ROADMAP
      ====================================================== */}

      <section
        id="ai-roadmap"
        className="border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
                AI Learning Path
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Start with the fundamentals.
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                You don't need to become a machine learning engineer to
                benefit from AI. Start with practical concepts and gradually
                move toward more advanced topics.
              </p>

            </div>

            <div className="space-y-4">

              {[
                "01 — Understand what AI actually is",
                "02 — Learn how generative AI works",
                "03 — Master effective prompting",
                "04 — Explore useful AI tools",
                "05 — Build AI-assisted workflows",
                "06 — Learn the fundamentals of machine learning",
              ].map((step) => (

                <div
                  key={step}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5 font-semibold transition hover:-translate-x-1 hover:bg-white hover:shadow-md"
                >
                  {step}
                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          AI IN EVERYDAY WORK
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="rounded-[2rem] bg-gray-900 p-8 text-white md:p-14">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-400">
              Practical AI
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Don't just learn AI.
              <br />
              Learn how to use it.
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              The most valuable AI skill is knowing how to apply it to real
              problems. Use AI as a tool to learn, research, create and
              automate.
            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {aiIdeas.map((idea) => (

              <div
                key={idea}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <span className="mr-2 text-purple-400">✦</span>
                {idea}
              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          RESPONSIBLE AI
      ====================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-10 pb-24 text-center">

        <div className="rounded-[2rem] border border-purple-100 bg-purple-50 p-10 md:p-14">

          <div className="text-4xl">
            🧠
          </div>

          <h2 className="mt-5 text-3xl font-black">
            Use AI with judgment.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            AI can be powerful, but it can also make mistakes. Always verify
            important information, protect personal data and use AI as an
            assistant rather than blindly trusting every answer.
          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/"
            className="font-semibold text-purple-600 hover:text-purple-700"
          >
            Back to MindraInfo →
          </Link>

        </div>

      </footer>

    </main>
  );
}