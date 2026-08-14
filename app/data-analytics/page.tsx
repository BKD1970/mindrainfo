import Link from "next/link";

const learningPaths = [
  {
    title: "Excel",
    icon: "📗",
    description:
      "Master formulas, functions, PivotTables, charts, dashboards and data cleaning.",
  },
  {
    title: "SQL",
    icon: "🗄️",
    description:
      "Learn how to query databases, filter data, join tables and extract useful insights.",
  },
  {
    title: "Power BI",
    icon: "📊",
    description:
      "Create interactive dashboards, reports and business intelligence solutions.",
  },
  {
    title: "Python",
    icon: "🐍",
    description:
      "Use Python and libraries such as Pandas to analyze and manipulate data.",
  },
];

const roadmap = [
  {
    number: "01",
    title: "Learn Excel",
    description:
      "Start with spreadsheets, formulas, functions, PivotTables and basic data visualization.",
  },
  {
    number: "02",
    title: "Learn SQL",
    description:
      "Understand databases and learn to retrieve and analyze data using SQL queries.",
  },
  {
    number: "03",
    title: "Learn Power BI",
    description:
      "Turn raw data into interactive dashboards and meaningful business reports.",
  },
  {
    number: "04",
    title: "Build Projects",
    description:
      "Work with real-world datasets and create projects that demonstrate your skills.",
  },
  {
    number: "05",
    title: "Prepare for Jobs",
    description:
      "Create your resume, prepare for interviews and start applying for analyst positions.",
  },
];

const skills = [
  "Data Cleaning",
  "Data Visualization",
  "SQL",
  "Excel",
  "Power BI",
  "Statistics",
  "Problem Solving",
  "Business Analysis",
];

export default function DataAnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">

      {/* =========================
          HEADER
      ========================== */}

      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-blue-600">Mindra</span>
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

      {/* =========================
          HERO
      ========================== */}

      <section className="relative overflow-hidden">

        {/* Background decoration */}

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />

        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
              Data Analytics
            </p>

            <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">

              Turn data into
              <br />

              <span className="text-blue-600">
                useful decisions.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Learn the tools and skills used by modern data analysts.
              From Excel and SQL to Power BI and Python, build practical
              skills through real-world projects.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#roadmap"
                className="rounded-xl bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-700"
              >
                View Roadmap
              </a>

              <a
                href="#learning-paths"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold transition hover:bg-gray-100"
              >
                Explore Skills
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          LEARNING PATHS
      ========================== */}

      <section
        id="learning-paths"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Learn the Tools
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Build your analytics toolkit.
          </h2>

          <p className="mt-4 max-w-2xl text-gray-600">
            These are some of the most useful technologies and skills to
            develop when starting a career in data analytics.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {learningPaths.map((item) => (

            <div
              key={item.title}
              className="group rounded-3xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl"
            >

              <div className="text-4xl transition group-hover:scale-110">
                {item.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {item.description}
              </p>

              <span className="mt-6 inline-block text-sm font-bold text-blue-600">
                Learn more →
              </span>

            </div>

          ))}

        </div>

      </section>

      {/* =========================
          ROADMAP
      ========================== */}

      <section
        id="roadmap"
        className="border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Career Roadmap
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Your path to becoming a Data Analyst.
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              You don't need to learn everything at once. Follow a structured
              path and build your skills step by step.
            </p>

          </div>

          <div className="space-y-5">

            {roadmap.map((step) => (

              <div
                key={step.number}
                className="group flex gap-6 rounded-3xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg md:p-8"
              >

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-sm font-black text-white">
                  {step.number}
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600">
                    {step.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =========================
          SKILLS
      ========================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-600">
              Core Skills
            </p>

            <h2 className="mt-3 text-4xl font-black">
              More than just tools.
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              A good data analyst doesn't simply know software. You also need
              analytical thinking, communication and the ability to turn
              numbers into useful business insights.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {skills.map((skill) => (

              <div
                key={skill}
                className="rounded-2xl border border-gray-200 bg-white p-5 font-semibold transition hover:-translate-y-1 hover:shadow-md"
              >
                {skill}
              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =========================
          PROJECTS
      ========================== */}

      <section className="border-y border-gray-200 bg-gray-900">

        <div className="mx-auto max-w-7xl px-6 py-20 text-white">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              Practice
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Build projects, not just certificates.
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Real projects are one of the best ways to demonstrate your
              ability to analyze data and solve practical problems.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {[
              "Sales Dashboard",
              "Employee Analytics",
              "E-commerce Analysis",
            ].map((project) => (

              <div
                key={project}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:bg-white/10"
              >

                <h3 className="text-xl font-bold">
                  {project}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Analyze a realistic dataset and create a professional
                  dashboard or analytical report.
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =========================
          CTA
      ========================== */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-4xl rounded-[2rem] border border-blue-100 bg-blue-50 p-10 text-center md:p-16">

          <h2 className="text-4xl font-black">
            Ready to start learning?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            Start with Excel, move to SQL and Power BI, build projects and
            gradually become job-ready.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-blue-700"
          >
            Back to MindraInfo
          </Link>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">

          © 2026 MindraInfo. All rights reserved.

        </div>

      </footer>

    </main>
  );
}