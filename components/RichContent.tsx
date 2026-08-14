import Link from "next/link";

export type RichContentBlock =
  | {
      type: "heading";
      heading: string;
      level?: 2 | 3;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "bullets";
      items: string[];
    }
  | {
      type: "numbered";
      items: string[];
    }
  | {
      type: "callout";
      title: string;
      text: string;
      tone?: "info" | "success" | "warning" | "tip";
    }
  | {
      type: "cards";
      items: {
        icon: string;
        title: string;
        text: string;
      }[];
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      type: "link";
      text: string;
      href: string;
    };

type RichContentProps = {
  blocks: RichContentBlock[];
};

const calloutStyles = {
  info: {
    wrapper: "border-cyan-400/15 bg-cyan-400/[0.05]",
    title: "text-cyan-400",
    icon: "ℹ️",
  },
  success: {
    wrapper: "border-green-400/15 bg-green-400/[0.05]",
    title: "text-green-400",
    icon: "✅",
  },
  warning: {
    wrapper: "border-yellow-400/20 bg-yellow-400/[0.05]",
    title: "text-yellow-400",
    icon: "⚠️",
  },
  tip: {
    wrapper: "border-purple-400/15 bg-purple-400/[0.05]",
    title: "text-purple-400",
    icon: "💡",
  },
};

export default function RichContent({
  blocks,
}: RichContentProps) {
  return (
    <div className="space-y-12">

      {blocks.map((block, index) => {

        /* =====================================================
           HEADING
        ====================================================== */

        if (block.type === "heading") {
          if (block.level === 3) {
            return (
              <h3
                key={index}
                className="text-2xl font-black text-white md:text-3xl"
              >
                {block.heading}
              </h3>
            );
          }

          return (
            <h2
              key={index}
              className="text-3xl font-black leading-tight text-white md:text-4xl"
            >
              {block.heading}
            </h2>
          );
        }

        /* =====================================================
           PARAGRAPH
        ====================================================== */

        if (block.type === "paragraph") {
          return (
            <p
              key={index}
              className="text-lg leading-8 text-white/60"
            >
              {block.text}
            </p>
          );
        }

        /* =====================================================
           BULLETS
        ====================================================== */

        if (block.type === "bullets") {
          return (
            <div key={index} className="space-y-3">
              {block.items.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/75 transition hover:border-cyan-400/20 hover:bg-white/[0.06]"
                >
                  <span className="mr-3 text-cyan-400">
                    ✦
                  </span>

                  {item}
                </div>
              ))}
            </div>
          );
        }

        /* =====================================================
           NUMBERED LIST
        ====================================================== */

        if (block.type === "numbered") {
          return (
            <div key={index} className="space-y-3">
              {block.items.map((item, itemIndex) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-purple-400/20 hover:bg-white/[0.06]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-400/10 text-sm font-black text-purple-400">
                    {String(itemIndex + 1).padStart(2, "0")}
                  </div>

                  <div className="pt-1 text-white/75">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        /* =====================================================
           CALLOUT
        ====================================================== */

        if (block.type === "callout") {
          const tone = block.tone ?? "info";
          const style = calloutStyles[tone];

          return (
            <div
              key={index}
              className={`rounded-[2rem] border p-7 ${style.wrapper}`}
            >
              <div className="flex items-center gap-3">

                <span className="text-2xl">
                  {style.icon}
                </span>

                <h3
                  className={`text-xl font-black ${style.title}`}
                >
                  {block.title}
                </h3>

              </div>

              <p className="mt-4 leading-7 text-white/60">
                {block.text}
              </p>
            </div>
          );
        }

        /* =====================================================
           CARDS
        ====================================================== */

        if (block.type === "cards") {
          return (
            <div
              key={index}
              className="grid gap-5 sm:grid-cols-2"
            >
              {block.items.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06]"
                >
                  <div className="text-4xl transition group-hover:scale-110">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          );
        }

        /* =====================================================
           TABLE
        ====================================================== */

        if (block.type === "table") {
          return (
            <div
              key={index}
              className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04]"
            >
              <table className="w-full min-w-[650px] border-collapse text-left">

                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    {block.headers.map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-sm font-bold text-cyan-400"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.03]"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${rowIndex}-${cellIndex}`}
                          className={`px-6 py-4 text-sm ${
                            cellIndex === 0
                              ? "font-semibold text-white"
                              : "text-white/55"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          );
        }

        /* =====================================================
           LINK
        ====================================================== */

        if (block.type === "link") {
          const isExternal =
            block.href.startsWith("http://") ||
            block.href.startsWith("https://");

          if (isExternal) {
            return (
              <a
                key={index}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white transition hover:-translate-y-1"
              >
                {block.text} →
              </a>
            );
          }

          return (
            <Link
              key={index}
              href={block.href}
              className="inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white transition hover:-translate-y-1"
            >
              {block.text} →
            </Link>
          );
        }

        return null;
      })}

    </div>
  );
}