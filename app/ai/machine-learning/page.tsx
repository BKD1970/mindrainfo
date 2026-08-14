import Link from "next/link";

const mlAreas = [
  {
    icon: "📚",
    title: "Supervised Learning",
    description:
      "Learn how machine learning models use labeled examples to make predictions or classifications.",
  },
  {
    icon: "🔍",
    title: "Unsupervised Learning",
    description:
      "Understand how algorithms can discover patterns, groups and structures in data without labeled answers.",
  },
  {
    icon: "🧠",
    title: "Neural Networks",
    description:
      "Explore the basic idea behind neural networks and how they are used for complex learning tasks.",
  },
  {
    icon: "📈",
    title: "Prediction",
    description:
      "Understand how machine learning can use historical data to estimate future outcomes.",
  },
  {
    icon: "🗂️",
    title: "Classification",
    description:
      "Learn how models can assign data to categories such as spam or not spam.",
  },
  {
    icon: "⚙️",
    title: "Model Training",
    description:
      "Understand how data, algorithms and evaluation work together to create useful machine learning models.",
  },
];

const learningPath = [
  {
    number: "01",
    title: "Learn Python",
    description:
      "Build a foundation in Python because it is widely used for data science and machine learning.",
  },
  {
    number: "02",
    title: "Understand Data",
    description:
      "Learn how to collect, clean, explore and prepare datasets.",
  },
  {
    number: "03",
    title: "Learn the Fundamentals",
    description:
      "Understand concepts such as features, labels, training, testing and model evaluation.",
  },
  {
    number: "04",
    title: "Study Algorithms",
    description:
      "Explore regression, classification, clustering, decision trees and other fundamental algorithms.",
  },
  {
    number: "05",
    title: "Build Projects",
    description:
      "Apply your knowledge to real datasets and create practical machine learning projects.",
  },
  {
    number: "06",
    title: "Move to Advanced AI",
    description:
      "Gradually explore neural networks, deep learning, natural language processing and computer vision.",
  },
];

const examples = [
  {
    icon: "🏠",
    title: "House Price Prediction",
    description:
      "Use historical property data to build a model that estimates house prices.",
  },
  {
    icon: "📧",
    title: "Spam Detection",
    description:
      "Train a model to distinguish between unwanted messages and legitimate messages.",
  },
  {
    icon: "🛒",
    title: "Recommendation Systems",
    description:
      "Use user behavior and preferences to recommend products, movies or other content.",
  },
  {
    icon: "🏦",
    title: "Fraud Detection",
    description:
      "Analyze transaction patterns to identify potentially unusual or fraudulent activity.",
  },
];

const importantConcepts = [
  "Dataset",
  "Features",
  "Labels",
  "Training Data",
  "Testing Data",
  "Model",
  "Prediction",
  "Accuracy",
];

export default function MachineLearningPage() {
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

              Machine Learning

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Teach computers.
              <br />

              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Let data reveal patterns.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">

              Understand the fundamentals of machine learning, how models
              learn from data and how these techniques are used to solve
              real-world problems.

            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#fundamentals"
                className="rounded-xl bg-gray-900 px-7 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-700"
              >
                Learn the Fundamentals
              </a>

              <a
                href="#roadmap"
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold transition hover:bg-gray-100"
              >
                Learning Roadmap
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* FUNDAMENTALS */}

      <section
        id="fundamentals"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              The Fundamentals
            </p>

            <h2 className="mt-3 text-4xl font-black">
              What is Machine Learning?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">

              Machine learning is a branch of artificial intelligence
              where computers learn patterns from data and use those
              patterns to make predictions, classifications or decisions.

            </p>

            <p className="mt-4 leading-8 text-gray-600">

              Instead of explicitly programming every possible rule,
              developers provide data and an appropriate learning
              algorithm so a model can identify useful relationships.

            </p>

          </div>

          <div>

            <div className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-sm">

              <div className="text-5xl">
                🧠
              </div>

              <h3 className="mt-6 text-2xl font-black">
                A simple example
              </h3>

              <div className="mt-7 space-y-3">

                <div className="rounded-2xl bg-gray-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Input Data
                  </p>

                  <p className="mt-2 font-semibold">
                    House size, location, bedrooms and previous prices
                  </p>

                </div>

                <div className="text-center text-xl text-purple-500">
                  ↓
                </div>

                <div className="rounded-2xl bg-purple-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-purple-500">
                    Machine Learning Model
                  </p>

                  <p className="mt-2 font-semibold">
                    Learns relationships between the data
                  </p>

                </div>

                <div className="text-center text-xl text-purple-500">
                  ↓
                </div>

                <div className="rounded-2xl bg-cyan-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                    Output
                  </p>

                  <p className="mt-2 font-semibold">
                    Predicts the price of a new house
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ML AREAS */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Explore Machine Learning
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Major areas to understand
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">

              Machine learning contains several approaches and techniques.
              These concepts form a useful foundation for further study.

            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {mlAreas.map((area) => (

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

      {/* IMPORTANT CONCEPTS */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Key Vocabulary
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Concepts you will hear everywhere.
            </h2>

            <p className="mt-5 leading-8 text-gray-600">

              Before moving into advanced machine learning, become
              comfortable with the terminology used to describe data,
              models and predictions.

            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {importantConcepts.map((concept) => (

              <div
                key={concept}
                className="rounded-2xl border border-gray-200 bg-white p-5 font-semibold shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
              >

                <span className="mr-2 text-purple-500">
                  ✦
                </span>

                {concept}

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* REAL WORLD EXAMPLES */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Real-World Applications
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Where is machine learning used?
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600">

              Machine learning is already used in many systems people
              interact with every day.

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

      {/* LEARNING ROADMAP */}

      <section
        id="roadmap"
        className="mx-auto max-w-7xl px-6 py-20"
      >

        <div className="rounded-[2rem] bg-gray-900 p-8 text-white md:p-14">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-400">
              Machine Learning Roadmap
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              From beginner to practical projects.
            </h2>

            <p className="mt-5 leading-7 text-gray-400">

              Machine learning becomes easier when you build the
              foundation step by step instead of trying to learn every
              algorithm at once.

            </p>

          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {learningPath.map((step) => (

              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
              >

                <div className="text-sm font-bold text-purple-400">
                  {step.number}
                </div>

                <h3 className="mt-3 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* MACHINE LEARNING VS AI */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-12">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Understand the Relationship
          </p>

          <h2 className="mt-3 text-4xl font-black">
            AI, Machine Learning and Deep Learning
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-gray-600">

            These terms are related but they are not interchangeable.

          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-gray-200 bg-white p-8">

            <div className="text-4xl">
              🤖
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Artificial Intelligence
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              The broad field of creating systems that can perform tasks
              associated with intelligent behavior.
            </p>

          </div>

          <div className="rounded-3xl border border-purple-200 bg-purple-50 p-8">

            <div className="text-4xl">
              🧠
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Machine Learning
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              A major approach within AI where systems learn patterns
              from data.
            </p>

          </div>

          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8">

            <div className="text-4xl">
              🔬
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Deep Learning
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              A specialized area of machine learning that commonly uses
              multi-layer neural networks.
            </p>

          </div>

        </div>

      </section>

      {/* RESPONSIBLE AI */}

      <section className="mx-auto max-w-5xl px-6 pb-24 text-center">

        <div className="rounded-[2rem] border border-purple-100 bg-purple-50 p-10 md:p-14">

          <div className="text-4xl">
            🧪
          </div>

          <h2 className="mt-5 text-3xl font-black">
            Good models need good data.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">

            Machine learning systems depend heavily on the quality and
            suitability of their data. Understanding data quality,
            evaluation and potential bias is just as important as
            understanding algorithms.

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