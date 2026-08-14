import Link from "next/link";

const careerAreas = [
  {
    icon: "💻",
    title: "AI-Assisted Software Development",
    description:
      "Learn how developers use AI coding assistants to understand code, build features, debug problems and work more efficiently.",
  },
  {
    icon: "📊",
    title: "Data & Analytics",
    description:
      "AI is changing how analysts explore data, generate insights, create reports and communicate findings.",
  },
  {
    icon: "🎨",
    title: "Creative Careers",
    description:
      "Designers, video creators, writers and other creative professionals can use AI to accelerate ideation and production.",
  },
  {
    icon: "📈",
    title: "Business & Marketing",
    description:
      "AI can help businesses analyze customers, generate content, research markets and automate repetitive marketing tasks.",
  },
  {
    icon: "⚙️",
    title: "AI Automation",
    description:
      "Professionals can combine AI with workflows to automate repetitive business and productivity tasks.",
  },
  {
    icon: "🧠",
    title: "AI & Machine Learning",
    description:
      "For people who want a deeper technical career, machine learning and AI engineering offer specialized career paths.",
  },
];

const skills = [
  {
    number: "01",
    title: "AI Literacy",
    description:
      "Understand what AI can do, where it can fail and how to use it responsibly.",
  },
  {
    number: "02",
    title: "Prompting",
    description:
      "Learn how to give clear instructions and work effectively with AI systems.",
  },
  {
    number: "03",
    title: "Data Skills",
    description:
      "Develop the ability to collect, understand, analyze and communicate information.",
  },
  {
    number: "04",
    title: "Problem Solving",
    description:
      "Focus on identifying real problems and designing practical solutions.",
  },
  {
    number: "05",
    title: "Communication",
    description:
      "Explain ideas clearly to people, teams and organizations.",
  },
  {
    number: "06",
    title: "Continuous Learning",
    description:
      "Keep learning as AI tools, technologies and workplace requirements evolve.",
  },
];

const careerExamples = [
  "Data Analyst",
  "AI Product Specialist",
  "AI Automation Specialist",
  "AI-Assisted Developer",
  "Machine Learning Engineer",
  "AI Content Specialist",
  "AI Researcher",
  "Business Intelligence Analyst",
];

export default function AICareersPage() {
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

              AI & Careers

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Build your career.
              <br />

              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Work intelligently with AI.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">

              Artificial intelligence is changing how people work across
              industries. Learn which skills matter, how AI can help you
              work better and where new career opportunities are emerging.

            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#career-paths"
                className="rounded-xl bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-700"
              >
                Explore Career Paths
              </a>

              <a
                href="#skills"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold transition hover:bg-gray-100"
              >
                Skills to Learn
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* INTRODUCTION */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              The Big Picture
            </p>

            <h2 className="mt-3 text-4xl font-black">
              AI is a career skill, not just a career.
            </h2>

            <p className="mt-5 leading-8 text-gray-600">

              You do not necessarily need to become an AI engineer to
              benefit from artificial intelligence. People in many
              different careers can use AI to research, analyze, create,
              automate and communicate more effectively.

            </p>

            <p className="mt-4 leading-8 text-gray-600">

              The strongest approach is to combine AI skills with a
              useful domain skill. For example, AI + data analytics,
              AI + software development or AI + marketing.

            </p>

          </div>

          <div>

            <div className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-sm">

              <div className="text-5xl">
                🚀
              </div>

              <h3 className="mt-6 text-2xl font-black">
                A powerful combination
              </h3>

              <div className="mt-7 space-y-3">

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-sm font-semibold text-gray-500">
                    Domain Skill
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    Data Analytics
                  </p>

                </div>

                <div className="text-center text-xl text-purple-500">
                  +
                </div>

                <div className="rounded-2xl bg-purple-50 p-5">

                  <p className="text-sm font-semibold text-purple-500">
                    AI Skill
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    AI-assisted analysis
                  </p>

                </div>

                <div className="text-center text-xl text-purple-500">
                  =
                </div>

                <div className="rounded-2xl bg-cyan-50 p-5">

                  <p className="text-sm font-semibold text-cyan-600">
                    Career Advantage
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    Faster and smarter workflows
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CAREER PATHS */}

      <section
        id="career-paths"
        className="border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Career Opportunities
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Where can AI take your career?
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">

              AI skills can complement traditional skills across many
              different professional fields.

            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {careerAreas.map((career) => (

              <div
                key={career.title}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-300 hover:bg-white hover:shadow-xl"
              >

                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-200/30 blur-2xl transition group-hover:bg-purple-300/50" />

                <div className="relative z-10">

                  <div className="text-4xl transition duration-300 group-hover:scale-110">
                    {career.icon}
                  </div>

                  <h3 className="mt-6 text-2xl font-bold">
                    {career.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {career.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* SKILLS */}

      <section
        id="skills"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="rounded-[2rem] bg-gray-900 p-8 text-white md:p-14">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-400">
              Skills That Matter
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Build skills that work with AI.
            </h2>

            <p className="mt-5 leading-7 text-gray-400">

              AI tools will change, but fundamental professional skills
              remain valuable. Focus on learning how to solve problems
              and use technology effectively.

            </p>

          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {skills.map((skill) => (

              <div
                key={skill.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
              >

                <div className="text-sm font-bold text-purple-400">
                  {skill.number}
                </div>

                <h3 className="mt-3 text-xl font-bold">
                  {skill.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {skill.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CAREER EXAMPLES */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Examples
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Careers worth exploring
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              These are examples of roles where AI knowledge can become
              useful alongside other professional skills.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {careerExamples.map((career) => (

              <div
                key={career}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 font-semibold transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
              >

                <span className="mr-2 text-purple-500">
                  ✦
                </span>

                {career}

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ROADMAP */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              A Practical Approach
            </p>

            <h2 className="mt-3 text-4xl font-black">
              How to prepare for an AI-powered workplace.
            </h2>

            <p className="mt-5 leading-8 text-gray-600">

              You don't need to learn everything at once. Start with
              the skills that are most relevant to the career you want.

            </p>

          </div>

          <div className="space-y-4">

            {[
              "01 — Choose a career or domain you are interested in",
              "02 — Build strong fundamentals in that field",
              "03 — Learn the AI tools relevant to your work",
              "04 — Build practical projects using those skills",
              "05 — Create a portfolio that demonstrates your abilities",
              "06 — Keep learning as the technology evolves",
            ].map((step) => (

              <div
                key={step}
                className="rounded-2xl border border-gray-200 bg-white p-5 font-semibold transition hover:-translate-x-1 hover:shadow-md"
              >
                {step}
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
            Your judgment still matters.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">

            AI can make work faster, but professional judgment,
            communication, creativity, responsibility and critical
            thinking remain essential. Use AI as a powerful assistant,
            not as a replacement for your own thinking.

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