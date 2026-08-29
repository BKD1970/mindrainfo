import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Section = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type TechnologyTopic = {
  title: string;
  slug: string;
  description: string;
  icon: string;
  content: {
    sections: Section[];
  };
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TechnologyTopicPage({
  params,
}: PageProps) {
  const resolvedParams = await params;
const slug = resolvedParams?.slug;

console.log("PARAMS RECEIVED:", resolvedParams);
console.log("SLUG RECEIVED:", slug);

  const { data: topic, error } = await supabase
    .from("technology_topics")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !topic) {
    notFound();
  }

  const technology = topic as TechnologyTopic;

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-indigo-600">
              Mindra
            </span>
            <span>
              Info
            </span>
          </Link>

          <Link
            href="/technology"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
          >
            ← Technology
          </Link>

        </div>

      </header>

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">

          <div className="text-6xl">
            {technology.icon}
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">
            Technology
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            {technology.title}
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
            {technology.description}
          </p>

        </div>

      </section>

      {/* CONTENT */}

      <article className="mx-auto max-w-5xl px-6 pb-24">

        <div className="space-y-16">

          {technology.content?.sections?.map((section) => (

            <section key={section.heading}>

              <h2 className="text-3xl font-black md:text-4xl">
                {section.heading}
              </h2>

              {section.paragraphs?.map((paragraph) => (

                <p
                  key={paragraph}
                  className="mt-5 text-lg leading-8 text-gray-600"
                >
                  {paragraph}
                </p>

              ))}

              {section.bullets &&
                section.bullets.length > 0 && (

                  <div className="mt-7 space-y-3">

                    {section.bullets.map((bullet) => (

                      <div
                        key={bullet}
                        className="rounded-2xl border border-gray-200 bg-white p-5 text-gray-700 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                      >

                        <span className="mr-3 font-bold text-indigo-600">
                          ✦
                        </span>

                        {bullet}

                      </div>

                    ))}

                  </div>

                )}

            </section>

          ))}

        </div>

        {/* CTA */}

        <section className="mt-20">

          <div className="rounded-[2rem] bg-gray-900 p-10 text-center text-white md:p-14">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-400">
              Continue Learning
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Explore more Technology topics
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
              Continue exploring programming, cloud computing,
              cybersecurity, databases and DevOps.
            </p>

            <Link
              href="/technology"
              className="mt-8 inline-flex rounded-xl bg-indigo-600 px-7 py-3.5 font-bold transition hover:-translate-y-1 hover:bg-indigo-700"
            >
              Back to Technology →
            </Link>

          </div>

        </section>

      </article>

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/technology"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Technology →
          </Link>

        </div>

      </footer>

    </main>
  );
}