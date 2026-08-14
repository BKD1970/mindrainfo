import Link from "next/link";

const automationAreas = [
  {
    icon: "📧",
    title: "Email Automation",
    description:
      "Use AI to summarize emails, draft responses, classify messages and organize repetitive communication.",
  },
  {
    icon: "📊",
    title: "Data Automation",
    description:
      "Automate repetitive data collection, cleaning, transformation and reporting tasks.",
  },
  {
    icon: "📝",
    title: "Content Automation",
    description:
      "Create drafts, summaries, social media content and other repetitive content workflows with AI.",
  },
  {
    icon: "🔄",
    title: "Workflow Automation",
    description:
      "Connect different applications and automate actions that normally require manual work.",
  },
  {
    icon: "🤖",
    title: "AI Agents",
    description:
      "Explore systems that can perform multiple steps toward a goal instead of responding to a single instruction.",
  },
  {
    icon: "⚡",
    title: "Productivity Automation",
    description:
      "Use AI to reduce repetitive work and spend more time on tasks that require human judgment.",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Identify",
    description: "Find a repetitive task that takes unnecessary time.",
  },
  {
    number: "02",
    title: "Design",
    description: "Define what should happen before, during and after the task.",
  },
  {
    number: "03",
    title: "Connect",
    description: "Connect the applications, data sources or AI tools involved.",
  },
  {
    number: "04",
    title: "Automate",
    description: "Let the workflow perform the repetitive steps automatically.",
  },
  {
    number: "05",
    title: "Review",
    description: "Monitor the results and improve the workflow when necessary.",
  },
];

const examples = [
  {
    icon: "📩",
    title: "Incoming Email",
    description:
      "An incoming customer email can be classified and summarized before being routed to the appropriate person.",
  },
  {
    icon: "📄",
    title: "Document Processing",
    description:
      "Information from documents can be extracted and transferred into a structured database or spreadsheet.",
  },
  {
    icon: "📈",
    title: "Weekly Reports",
    description:
      "Data can be collected from multiple sources and transformed into a recurring report.",
  },
  {
    icon: "📱",
    title: "Content Workflow",
    description:
      "One piece of content can be transformed into multiple formats for different platforms.",
  },
];

export default function AIAutomationPage() {
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

              AI Automation

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Automate the repetitive.
              <br />

              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Focus on what matters.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">

              Learn how AI can be combined with workflows, applications and
              data to reduce repetitive work and improve productivity.

            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#automation"
                className="rounded-xl bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-700"
              >
                Explore Automation
              </a>

              <a
                href="#workflow"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold transition hover:bg-gray-100"
              >
                See How It Works
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* WHAT IS AI AUTOMATION */}

      <section
        id="automation"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              The Fundamentals
            </p>

            <h2 className="mt-3 text-4xl font-black">
              What is AI Automation?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">

              AI automation combines traditional workflow automation with
              artificial intelligence. Instead of manually performing every
              step, software can handle repetitive actions while AI can
              help interpret, generate or classify information.

            </p>

            <p className="mt-4 leading-8 text-gray-600">

              The goal is not to automate everything. Good automation
              removes repetitive work while keeping humans involved where
              judgment, creativity or accountability are important.

            </p>

          </div>

          <div>

            <div className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-sm">

              <div className="text-5xl">
                ⚙️
              </div>

              <h3 className="mt-6 text-2xl font-black">
                A simple automation
              </h3>

              <div className="mt-7 space-y-3">

                <div className="rounded-2xl bg-gray-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Trigger
                  </p>

                  <p className="mt-2 font-semibold">
                    A new email arrives
                  </p>

                </div>

                <div className="text-center text-xl text-purple-500">
                  ↓
                </div>

                <div className="rounded-2xl bg-purple-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-purple-500">
                    AI Processing
                  </p>

                  <p className="mt-2 font-semibold">
                    AI summarizes and classifies the email
                  </p>

                </div>

                <div className="text-center text-xl text-purple-500">
                  ↓
                </div>

                <div className="rounded-2xl bg-cyan-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                    Action
                  </p>

                  <p className="mt-2 font-semibold">
                    The workflow sends it to the correct destination
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* AUTOMATION AREAS */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Explore Applications
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Where can AI automation help?
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              AI automation can be useful anywhere repetitive information
              processing or predictable workflows consume time.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {automationAreas.map((area) => (

              <div
                key={area.title}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-300 hover:bg-white hover:shadow-xl"
              >

                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-200/30 blur-2xl transition group-hover:bg-purple-300/50" />

                <div className="relative z-10">

                  <div className="text-4xl transition duration-300 group-hover:scale-110">
                    {area.icon}
                  </div>

                  <h3 className="mt-6 text-2xl font-bold">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {area.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* WORKFLOW */}

      <section
        id="workflow"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="rounded-[2rem] bg-gray-900 p-8 text-white md:p-14">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-400">
              Automation Process
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              From repetitive task to automated workflow.
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Start small. Find one repetitive process and design a
              workflow that saves time without removing necessary human
              oversight.
            </p>

          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">

            {workflowSteps.map((step) => (

              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10"
              >

                <div className="text-sm font-bold text-purple-400">
                  {step.number}
                </div>

                <h3 className="mt-3 font-bold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* REAL WORLD EXAMPLES */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Real-World Ideas
            </p>

            <h2 className="mt-3 text-4xl font-black">
              What could you automate?
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              These examples show the type of repetitive workflows that can
              be candidates for AI-assisted automation.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {examples.map((example) => (

              <article
                key={example.title}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                    {example.icon}
                  </div>

                  <h3 className="text-2xl font-black">
                    {example.title}
                  </h3>

                </div>

                <p className="mt-5 leading-7 text-gray-600">
                  {example.description}
                </p>

              </article>

            ))}

          </div>

        </div>

      </section>

      {/* AI AUTOMATION VS NORMAL AUTOMATION */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
            Understand the Difference
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Automation vs AI Automation
          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-gray-200 bg-white p-8">

            <div className="text-4xl">
              ⚙️
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Traditional Automation
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              Traditional automation generally follows predefined rules.
              When an event happens, a predetermined action takes place.
            </p>

            <div className="mt-6 rounded-2xl bg-gray-50 p-5 font-semibold">
              If X happens → Do Y
            </div>

          </div>

          <div className="rounded-3xl border border-purple-200 bg-purple-50 p-8">

            <div className="text-4xl">
              🧠
            </div>

            <h3 className="mt-5 text-2xl font-black">
              AI Automation
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              AI automation can introduce capabilities such as
              classification, summarization, extraction and natural
              language processing into a workflow.
            </p>

            <div className="mt-6 rounded-2xl bg-white p-5 font-semibold">
              Receive information → AI interprets it → Take action
            </div>

          </div>

        </div>

      </section>

      {/* RESPONSIBLE AUTOMATION */}

      <section className="mx-auto max-w-5xl px-6 pb-24 text-center">

        <div className="rounded-[2rem] border border-purple-100 bg-purple-50 p-10 md:p-14">

          <div className="text-4xl">
            🛡️
          </div>

          <h2 className="mt-5 text-3xl font-black">
            Automate responsibly.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Automation should be tested and monitored. Keep humans involved
            when decisions involve sensitive information, significant
            financial consequences, safety or accountability.
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