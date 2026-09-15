import Link from "next/link";

export const metadata = {
  title: "Crawling & Data Use Policy | MindraInfo",
  description:
    "MindraInfo policy regarding automated crawling, scraping, data extraction, copying, indexing, and reuse of content and data.",
};

export default function CrawlingPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to MindraInfo
        </Link>

        <article className="space-y-10">
          <header className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-wider text-cyan-400">
              MindraInfo
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Crawling & Data Use Policy
            </h1>

            <p className="text-slate-300">
              This policy explains how automated crawlers, bots, scrapers,
              data-collection systems, and other automated technologies may
              interact with MindraInfo.
            </p>

            <p className="text-sm text-slate-400">
              Last updated: September 2026
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              1. Scope of this Policy
            </h2>

            <p className="text-slate-300">
              This policy applies to the publicly accessible websites,
              webpages, content, databases, APIs, digital services, tools,
              games, job information, articles, product information, and
              other resources operated or published by MindraInfo.
            </p>

            <p className="text-slate-300">
              It applies to automated systems including web crawlers, bots,
              spiders, scrapers, data-mining systems, AI agents, automated
              browsers, scripts, and similar technologies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              2. Robots.txt and Search Engines
            </h2>

            <p className="text-slate-300">
              MindraInfo publishes a robots.txt file that specifies its
              preferred crawling rules for automated crawlers.
            </p>

            <p className="text-slate-300">
              Search engines and other compliant crawlers are expected to
              respect the applicable instructions published in
              robots.txt.
            </p>

            <p className="text-slate-300">
              The robots.txt file is a technical crawling instruction and
              should not be interpreted as granting permission to copy,
              reproduce, redistribute, commercially exploit, or systematically
              extract MindraInfo content or data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              3. Prohibited Automated Collection
            </h2>

            <p className="text-slate-300">
              Unless expressly authorized by MindraInfo or otherwise permitted
              by applicable law, users and automated systems must not use
              automated methods to:
            </p>

            <ul className="list-disc space-y-2 pl-6 text-slate-300">
              <li>
                systematically scrape or extract substantial portions of
                MindraInfo content or data;
              </li>
              <li>
                create a mirror, clone, archive, or substantially similar
                reproduction of MindraInfo;
              </li>
              <li>
                reproduce or redistribute MindraInfo articles, databases,
                datasets, images, videos, software, game assets, or other
                protected material;
              </li>
              <li>
                perform high-volume automated requests that place an
                unreasonable load on MindraInfo infrastructure;
              </li>
              <li>
                bypass authentication, access controls, rate limits, bot
                protections, or other technical restrictions;
              </li>
              <li>
                use automated methods to access private, administrative,
                internal, or restricted endpoints;
              </li>
              <li>
                use collected MindraInfo data to create a competing database,
                service, website, application, or automated feed without
                authorization; or
              </li>
              <li>
                circumvent or deliberately ignore technical measures intended
                to control automated access.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              4. Search Engine Indexing
            </h2>

            <p className="text-slate-300">
              MindraInfo may permit legitimate search engines to crawl and
              index public pages so that users can discover MindraInfo through
              search results.
            </p>

            <p className="text-slate-300">
              Public sections intended for search visibility may include
              articles, jobs, technology information, AI resources, career
              information, tools, shop pages, and future games or other public
              sections.
            </p>

            <p className="text-slate-300">
              Search-engine access does not constitute permission to reproduce
              or systematically extract the underlying content or database.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              5. Future MindraInfo Games
            </h2>

            <p className="text-slate-300">
              MindraInfo may publish games and interactive experiences in the
              future. Public game pages may be made available for legitimate
              search-engine discovery.
            </p>

            <p className="text-slate-300">
              Game source code, game assets, graphics, levels, databases,
              proprietary APIs, scoring systems, and other non-public
              implementation resources must not be copied, extracted,
              reverse-engineered, mirrored, or redistributed without
              authorization, except where permitted by applicable law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              6. APIs and Restricted Systems
            </h2>

            <p className="text-slate-300">
              MindraInfo may operate APIs and other technical endpoints that
              are not intended for unrestricted automated access.
            </p>

            <p className="text-slate-300">
              Access to an endpoint does not by itself grant permission to
              perform bulk extraction, automated harvesting, database
              reconstruction, or other uses outside the intended functionality
              of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              7. Legal and Regulatory Compliance
            </h2>

            <p className="text-slate-300">
              MindraInfo expects users and automated systems interacting with
              its services to comply with applicable laws and regulations.
            </p>

            <p className="text-slate-300">
              Unauthorized access, circumvention of technical protections,
              unauthorized extraction of data, interference with computer
              resources, or other unlawful conduct may result in technical
              restrictions and/or appropriate legal action where applicable.
            </p>

            <p className="text-slate-300">
              Nothing in this policy is intended to restrict rights that cannot
              lawfully be restricted under applicable law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              8. Attribution and Third-Party Information
            </h2>

            <p className="text-slate-300">
              Some information presented by MindraInfo may originate from
              third-party sources. Where appropriate, MindraInfo may identify
              or link to the relevant source.
            </p>

            <p className="text-slate-300">
              Third-party content remains subject to the rights, licenses,
              permissions, and policies applicable to that content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              9. Requests for Authorized Access
            </h2>

            <p className="text-slate-300">
              Organizations that require structured access to MindraInfo data,
              APIs, feeds, or other resources should contact MindraInfo to
              discuss authorization, technical requirements, and applicable
              conditions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              10. Technical Enforcement
            </h2>

            <p className="text-slate-300">
              MindraInfo may use technical measures including robots.txt
              directives, rate limiting, authentication, access controls,
              request monitoring, bot detection, IP restrictions, and other
              security mechanisms to protect its services and infrastructure.
            </p>

            <p className="text-slate-300">
              MindraInfo may modify or strengthen these measures when
              necessary to protect availability, security, data, users, and
              infrastructure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              11. Changes to this Policy
            </h2>

            <p className="text-slate-300">
              MindraInfo may update this policy as its services, technology,
              legal requirements, and security practices evolve.
            </p>
          </section>

          <footer className="border-t border-white/10 pt-8">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} MindraInfo. All rights reserved.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}