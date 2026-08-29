import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

const careerPaths = [
  {
    title: "Data Analyst",
    icon: "📊",
    description:
      "Analyze data, create dashboards and turn information into useful business insights.",
    href: "/data-analytics",
  },
  {
    title: "Software Developer",
    icon: "💻",
    description:
      "Build websites, applications and software using modern programming technologies.",
    href: "/technology",
  },
  {
    title: "AI & Machine Learning",
    icon: "🤖",
    description:
      "Explore artificial intelligence, machine learning and the technologies shaping the future.",
    href: "/ai",
  },
  {
    title: "Digital Marketing",
    icon: "📱",
    description:
      "Learn SEO, social media, content marketing and digital growth strategies.",
    href: "/tools",
  },
  {
    title: "Cybersecurity",
    icon: "🔐",
    description:
      "Learn how organizations protect systems, networks and information from cyber threats.",
    href: "/technology",
  },
  {
    title: "Government Jobs",
    icon: "🏛️",
    description:
      "Explore government career opportunities, competitive exams and preparation resources.",
    href: "/jobs",
  },
];

const skills = [
  "Communication",
  "Problem Solving",
  "Excel & Data",
  "Programming",
  "AI Tools",
  "Critical Thinking",
];

export default function CareerPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}
<SiteHeader />

      {/* =========================
          HERO
      ========================== */}

      <section className="relative overflow-hidden">

        {/* Decorative background */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />

        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
              Career
            </p>

            <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
              Build a career
              <br />

              <span className="text-blue-600">
                that moves you forward.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Explore career paths, understand the skills employers want,
              discover job opportunities and create a practical roadmap for
              your future.
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
                Discover Skills
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          CAREER PATHS
      ========================== */}

      <section
        id="career-paths"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Explore
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Career paths worth exploring
          </h2>

          <p className="mt-4 max-w-2xl text-gray-600">
            Start with an area that interests you and gradually build the
            skills needed to enter the field.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {careerPaths.map((career) => (

            <Link
              key={career.title}
              href={career.href}
              className="group rounded-3xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl"
            >

              <div className="text-4xl">
                {career.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {career.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {career.description}
              </p>

              <span className="mt-6 inline-block text-sm font-bold text-blue-600 transition group-hover:translate-x-1">
                Explore path →
              </span>

            </Link>

          ))}

        </div>

      </section>

      {/* =========================
          SKILLS
      ========================== */}

      <section
        id="skills"
        className="border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
                Essential Skills
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Skills that work across careers.
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                Technology changes quickly, but certain skills remain valuable
                across almost every industry. Build these alongside your
                technical knowledge.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              {skills.map((skill) => (

                <div
                  key={skill}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5 font-semibold transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
                >
                  {skill}
                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          JOB PREPARATION
      ========================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="rounded-[2rem] bg-gray-900 p-8 text-white md:p-14">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Job Preparation
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Learning is only the beginning.
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Prepare yourself for the actual job market with practical
              projects, resumes, interviews and job-search strategies.
            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[
              "Build Projects",
              "Create Your Resume",
              "Prepare for Interviews",
              "Find Relevant Jobs",
            ].map((item) => (

              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="font-semibold">
                  {item}
                </p>
              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =========================
          CTA
      ========================== */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-4xl rounded-[2rem] border border-blue-100 bg-blue-50 p-10 text-center md:p-16">

          <h2 className="text-4xl font-black">
            Don't wait for the perfect career.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            Start learning, build useful skills and take one practical step
            toward the career you want.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-blue-700"
          >
            Explore MindraInfo
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