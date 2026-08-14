import Link from "next/link";

const generationTypes = [
  {
    icon: "✍️",
    title: "Text Generation",
    description:
      "Generate articles, emails, summaries, ideas, explanations, stories and other written content.",
  },
  {
    icon: "🎨",
    title: "Image Generation",
    description:
      "Create images from text descriptions, concepts, ideas and creative prompts.",
  },
  {
    icon: "🎬",
    title: "Video Generation",
    description:
      "Create and transform video content using text prompts, images and AI-powered editing.",
  },
  {
    icon: "🎵",
    title: "Audio Generation",
    description:
      "Generate speech, music, sound effects and other forms of audio using artificial intelligence.",
  },
  {
    icon: "💻",
    title: "Code Generation",
    description:
      "Generate, explain, debug and improve software code with AI assistance.",
  },
  {
    icon: "🧠",
    title: "Multimodal AI",
    description:
      "Work with multiple types of information such as text, images, audio and video together.",
  },
];

const useCases = [
  "Write and improve content",
  "Create images and designs",
  "Generate videos",
  "Summarize documents",
  "Write and understand code",
  "Brainstorm ideas",
  "Create presentations",
  "Learn difficult concepts",
];

export default function GenerativeAIPage() {
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

        {/* Background effects */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-200px] right-[25%] h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm backdrop-blur-md">

              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />

              Generative Artificial Intelligence

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              AI that can
              <br />

              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                create.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">

              Understand how generative AI creates text, images, audio,
              video and code—and learn how these technologies can be
              used in the real world.

            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#generation-types"
                className="rounded-xl bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-700"
              >
                Explore Generative AI
              </a>

              <a
                href="#how-it-works"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold transition hover:bg-gray-100"
              >
                How It Works
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
              What is it?
            </p>

            <h2 className="mt-3 text-4xl font-black">
              What is Generative AI?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">

              Generative AI refers to artificial intelligence systems
              that can create new content based on patterns learned
              from large amounts of data.

            </p>

            <p className="mt-4 leading-8 text-gray-600">

              Instead of only analyzing existing information, generative
              AI can produce new text, images, audio, video, code and
              other forms of content.

            </p>

          </div>

          <div className="relative">

            <div className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-sm">

              <div className="text-5xl">
                ✨
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Input → AI → Output
              </h3>

              <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">

                <div className="rounded-2xl bg-gray-50 px-6 py-4 text-center">

                  <div className="text-sm font-semibold text-gray-500">
                    Your Prompt
                  </div>

                  <div className="mt-1 font-bold">
                    "Create an image"
                  </div>

                </div>

                <div className="text-2xl text-purple-500">
                  →
                </div>

                <div className="rounded-2xl bg-purple-50 px-6 py-4 text-center">

                  <div className="text-sm font-semibold text-purple-500">
                    AI Model
                  </div>

                  <div className="mt-1 font-bold">
                    Generates
                  </div>

                </div>

                <div className="text-2xl text-purple-500">
                  →
                </div>

                <div className="rounded-2xl bg-cyan-50 px-6 py-4 text-center">

                  <div className="text-sm font-semibold text-cyan-600">
                    Result
                  </div>

                  <div className="mt-1 font-bold">
                    New Content
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* GENERATION TYPES */}

      <section
        id="generation-types"
        className="border-y border-gray-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Explore
            </p>

            <h2 className="mt-3 text-4xl font-black">
              What can Generative AI create?
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">
              Generative AI is not limited to chatbots. Different AI
              models can create and transform many types of content.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {generationTypes.map((item) => (

              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-purple-300 hover:bg-white hover:shadow-xl"
              >

                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-200/30 blur-2xl transition group-hover:bg-purple-300/50" />

                <div className="relative z-10">

                  <div className="text-4xl transition duration-300 group-hover:scale-110">
                    {item.icon}
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

      {/* HOW IT WORKS */}

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Behind the scenes
            </p>

            <h2 className="mt-3 text-4xl font-black">
              How does Generative AI work?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">

              Generative AI models are trained on large datasets and
              learn patterns, relationships and structures within that
              information.

            </p>

            <p className="mt-4 leading-8 text-gray-600">

              When you provide a prompt, the model uses what it has
              learned to generate an output that matches the request.

            </p>

          </div>

          <div className="space-y-4">

            {[
              {
                number: "01",
                title: "Training",
                text: "The model learns patterns from large datasets.",
              },
              {
                number: "02",
                title: "Prompt",
                text: "You provide instructions or information to the model.",
              },
              {
                number: "03",
                title: "Processing",
                text: "The model predicts and constructs an appropriate response.",
              },
              {
                number: "04",
                title: "Generation",
                text: "The model produces new content based on the request.",
              },
            ].map((step) => (

              <div
                key={step.number}
                className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-x-1 hover:shadow-md"
              >

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 font-black text-purple-600">
                  {step.number}
                </div>

                <div>

                  <h3 className="font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {step.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* PRACTICAL USE CASES */}

      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="rounded-[2rem] bg-gray-900 p-8 text-white md:p-14">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-400">
              Practical Applications
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              What can you actually do with it?
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Generative AI becomes most useful when it is applied to
              real problems and everyday work.
            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {useCases.map((useCase) => (

              <div
                key={useCase}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >

                <span className="mr-2 text-purple-400">
                  ✦
                </span>

                {useCase}

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* RESPONSIBLE USE */}

      <section className="mx-auto max-w-5xl px-6 pb-24 text-center">

        <div className="rounded-[2rem] border border-purple-100 bg-purple-50 p-10 md:p-14">

          <div className="text-4xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-3xl font-black">
            Generative AI can make mistakes.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">

            AI-generated information should not automatically be treated
            as fact. Verify important information, review generated
            content and avoid sharing sensitive personal information
            with AI systems.

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