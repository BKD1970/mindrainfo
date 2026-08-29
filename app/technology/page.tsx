import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

const technologyTopics = [
  {
    title: "Web Development",
    slug: "web-development" ,
    icon: "🌐",
    description:
      "Learn how websites and web applications are designed, developed and deployed.",
  },
  {
    title: "Programming",
    slug: "programming",
    icon: "💻",
    description:
      "Understand programming fundamentals and explore languages used to build modern software.",
  },
  {
    title: "Cloud Computing",
    slug: "cloud-computing",
    icon: "☁️",
    description:
      "Learn how cloud platforms provide computing power, storage, databases and other services.",
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    icon: "🔐",
    description:
      "Understand the fundamentals of protecting systems, networks, applications and data.",
  },
  {
    title: "Databases",
    slug: "databases",
    icon: "🗄️",
    description:
      "Learn how information is stored, organized, queried and managed in modern applications.",
  },
  {
    title: "DevOps & Deployment",
    slug: "devops-deployment",
    icon: "⚡",
    description:
      "Explore Git, CI/CD, hosting, containers and the technologies used to deliver software.",
  },
];

const technologies = [
  "HTML & CSS",
  "JavaScript",
  "React",
  "Next.js",
  "Python",
  "Git & GitHub",
  "Cloud",
  "APIs",
];

const roadmap = [
  {
    number: "01",
    title: "Understand the Fundamentals",
    description:
      "Start with how computers, the internet, websites, software and applications work.",
  },
  {
    number: "02",
    title: "Learn to Build",
    description:
      "Choose a technology path and start building practical projects instead of only watching tutorials.",
  },
  {
    number: "03",
    title: "Understand the Stack",
    description:
      "Learn how frontend, backend, databases, APIs and hosting work together.",
  },
  {
    number: "04",
    title: "Build Real Projects",
    description:
      "Create useful applications that solve real problems and demonstrate your technical skills.",
  },
  {
    number: "05",
    title: "Deploy & Improve",
    description:
      "Put your projects online, collect feedback, fix problems and continuously improve them.",
  },
];

export default function TechnologyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}
<SiteHeader />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">

        {/* Soft technology background */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-indigo-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-48 h-[400px] w-[400px] rounded-full bg-blue-300/25 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[30%] h-[420px] w-[420px] rounded-full bg-cyan-300/20 blur-3xl" />

        {/* Decorative grid */}

        <div
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 opacity-[0.07] lg:block"
          style={{
            backgroundImage:
              "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur-md">

              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />

              Technology

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Understand
              <br />

              <span className="text-indigo-600">
                how technology works.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Explore programming, web development, cloud computing,
              cybersecurity and the technologies powering the modern digital
              world.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#topics"
                className="rounded-xl bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-700"
              >
                Explore Technology
              </a>

              <a
                href="#roadmap"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold transition hover:bg-gray-100"
              >
                Technology Roadmap
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          TECHNOLOGY TOPICS
      ====================================================== */}

      <section
        id="topics"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">
            Explore
          </p>

          <h2 className="mt-3 text-4xl font-black">
            The technology landscape.
          </h2>

          <p className="mt-4 max-w-2xl text-gray-600">
            Technology is a huge field. Start with an area that interests you
            and gradually understand how the different pieces connect.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {technologyTopics.map((topic) => (
  <Link
    key={topic.title}
    href={`/technology/${topic.slug}`}
    className="group relative block overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl"
  >
    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-200/30 blur-2xl transition group-hover:bg-indigo-300/50" />

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

      <span className="mt-6 inline-block text-sm font-bold text-indigo-600">
        Explore →
      </span>

    </div>
  </Link>
))}

        </div>

      </section>

      {/* =====================================================
          TECHNOLOGY STACK
      ====================================================== */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
                Modern Stack
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Technologies worth understanding.
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                You don't need to learn every technology that exists. Focus on
                strong fundamentals and learn tools that help you build useful
                things.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              {technologies.map((technology) => (

                <div
                  key={technology}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5 font-semibold transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
                >
                  {technology}
                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ROADMAP
      ====================================================== */}

      <section
        id="roadmap"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
            Technology Roadmap
          </p>

          <h2 className="mt-3 text-4xl font-black">
            From beginner to builder.
          </h2>

          <p className="mt-4 max-w-2xl text-gray-600">
            Technology becomes easier to understand when you learn how the
            different layers fit together.
          </p>

        </div>

        <div className="space-y-5">

          {roadmap.map((step) => (

            <div
              key={step.number}
              className="group flex gap-6 rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg md:p-8"
            >

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white">
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

      </section>

      {/* =====================================================
          BUILD SOMETHING
      ====================================================== */}

      <section className="border-y border-gray-200 bg-gray-900">

        <div className="mx-auto max-w-7xl px-6 py-20 text-white">

          <div className="grid gap-12 md:grid-cols-2 md:items-center">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-400">
                Learn by Building
              </p>

              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                The best way to learn technology is to build with it.
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                Tutorials can teach you concepts. Projects teach you how to
                solve problems, debug errors and connect different technologies
                together.
              </p>

            </div>

            <div className="grid gap-4">

              {[
                "Build a responsive website",
                "Create a dashboard",
                "Build an API",
                "Connect a database",
                "Deploy an application",
              ].map((project, index) => (

                <div
                  key={project}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300">
                    {index + 1}
                  </div>

                  <span className="font-semibold">
                    {project}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-4xl rounded-[2rem] border border-indigo-100 bg-indigo-50 p-10 text-center md:p-16">

          <h2 className="text-4xl font-black">
            Technology is a tool.
            <br />
            Learn to use it.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            Explore MindraInfo to learn practical technology concepts and
            discover skills that can help you build your future.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-indigo-700"
          >
            Back to MindraInfo
          </Link>

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
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Back to MindraInfo →
          </Link>

        </div>

      </footer>

    </main>
  );
}