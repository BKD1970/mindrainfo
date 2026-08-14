import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import RichContent from "@/components/articles/RichContent";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return articles
    .filter((article) => article.available)
    .map((article) => ({
      slug: article.slug,
    }));
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const article = articles.find(
    (item) => item.slug === slug && item.available
  );

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Mindra
            </span>
            <span className="text-white">Info</span>
          </Link>

          <Link
            href="/articles"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            ← All Articles
          </Link>

        </div>

      </header>

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 py-20 md:py-28">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            {article.category}
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {article.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/55 md:text-xl">
            {article.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/40">

            <span>{article.icon}</span>

            <span>•</span>

            <span>{article.category}</span>

            <span>•</span>

            <span>
              {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

          </div>

        </div>

      </section>

      {/* ARTICLE CONTENT */}

      <article className="mx-auto max-w-4xl px-6 pb-24">

        <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.04] p-7 md:p-10">

          <p className="text-lg leading-8 text-white/70">
            {article.description}
          </p>

        </div>

        <div className="mt-12 space-y-14">

          {article.sections.map((section) => (

            <section key={section.heading}>

              <h2 className="text-3xl font-black md:text-4xl">
                {section.heading}
              </h2>

              {section.paragraphs?.map((paragraph) => (

                <p
                  key={paragraph}
                  className="mt-5 text-lg leading-8 text-white/60"
                >
                  {paragraph}
                </p>

              ))}

              {section.bullets && section.bullets.length > 0 && (

                <div className="mt-6 space-y-3">

                  {section.bullets.map((bullet) => (

                    <div
                      key={bullet}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/75 transition hover:border-cyan-400/20 hover:bg-white/[0.06]"
                    >
                      <span className="mr-3 text-cyan-400">
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

        <section className="mt-16">

          <div className="rounded-[2rem] border border-cyan-400/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8 text-center md:p-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              Continue Learning
            </p>

            <h2 className="mt-4 text-3xl font-black">
              Explore more on MindraInfo
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/50">
              Discover more articles, guides, tools and practical resources.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-4">

              <Link
                href="/articles"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-bold transition hover:-translate-y-1"
              >
                More Articles →
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10"
              >
                Back Home
              </Link>

            </div>

          </div>

        </section>

      </article>

      {/* FOOTER */}

      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-white/40 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/articles"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            More Articles →
          </Link>

        </div>

      </footer>

    </main>
  );
}