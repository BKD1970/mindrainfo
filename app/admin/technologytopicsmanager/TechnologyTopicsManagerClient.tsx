"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { supabase } from "@/lib/supabase";

type TopicSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

type TechnologyTopic = {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  content: {
    sections?: TopicSection[];
  } | null;
  published: boolean;
};

const categories = [
  "Web Development",
  "Programming",
  "Cloud Computing",
  "Cybersecurity",
  "Databases",
  "DevOps & Deployment",
  "Artificial Intelligence",
  "Mobile Development",
  "Networking",
  "Software Engineering",
];

const createEmptySection = (): TopicSection => ({
  heading: "",
  paragraphs: [""],
  bullets: [],
});

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function TechnologyTopicsManagerPage() {
  const [topics, setTopics] = useState<TechnologyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "💻",
    category: "Web Development",
    sections: [createEmptySection()],
  });

  async function handleSignOut() {
  await supabaseBrowser.auth.signOut();

  window.location.replace("/admin/login?role=technology");
}

  async function loadTopics() {
    setLoading(true);

    const { data, error } = await supabase
      .from("technology_topics")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading technology topics:", error);
      setMessage(`Error loading topics: ${error.message}`);
    } else {
      setTopics(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTopics();
  }, []);

  function resetForm() {
    setForm({
      title: "",
      slug: "",
      description: "",
      icon: "💻",
      category: "Web Development",
      sections: [createEmptySection()],
    });

    setMessage("");
  }

  function updateSection(
    sectionIndex: number,
    field: keyof TopicSection,
    value: string | string[]
  ) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              [field]: value,
            }
          : section
      ),
    }));
  }

  function updateParagraph(
    sectionIndex: number,
    paragraphIndex: number,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) => {
        if (index !== sectionIndex) return section;

        const paragraphs = [...section.paragraphs];
        paragraphs[paragraphIndex] = value;

        return {
          ...section,
          paragraphs,
        };
      }),
    }));
  }

  function updateBullet(
    sectionIndex: number,
    bulletIndex: number,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) => {
        if (index !== sectionIndex) return section;

        const bullets = [...section.bullets];
        bullets[bulletIndex] = value;

        return {
          ...section,
          bullets,
        };
      }),
    }));
  }

  function addSection() {
    setForm((current) => ({
      ...current,
      sections: [...current.sections, createEmptySection()],
    }));
  }

  function removeSection(sectionIndex: number) {
    if (form.sections.length === 1) return;

    setForm((current) => ({
      ...current,
      sections: current.sections.filter(
        (_, index) => index !== sectionIndex
      ),
    }));
  }

  function addParagraph(sectionIndex: number) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              paragraphs: [...section.paragraphs, ""],
            }
          : section
      ),
    }));
  }

  function removeParagraph(
    sectionIndex: number,
    paragraphIndex: number
  ) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) => {
        if (index !== sectionIndex) return section;

        if (section.paragraphs.length === 1) {
          return section;
        }

        return {
          ...section,
          paragraphs: section.paragraphs.filter(
            (_, index) => index !== paragraphIndex
          ),
        };
      }),
    }));
  }

  function addBullet(sectionIndex: number) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              bullets: [...section.bullets, ""],
            }
          : section
      ),
    }));
  }

  function removeBullet(
    sectionIndex: number,
    bulletIndex: number
  ) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              bullets: section.bullets.filter(
                (_, index) => index !== bulletIndex
              ),
            }
          : section
      ),
    }));
  }

  async function saveTopic() {
    setSaving(true);
    setMessage("");

    try {
      const title = form.title.trim();
      const slug = form.slug.trim() || createSlug(title);
      const description = form.description.trim();

      if (!title) {
        setMessage("Please enter a technology topic title.");
        return;
      }

      if (!slug) {
        setMessage("Please enter a valid slug.");
        return;
      }

      const cleanSections = form.sections
        .map((section) => ({
          heading: section.heading.trim(),
          paragraphs: section.paragraphs
            .map((paragraph) => paragraph.trim())
            .filter(Boolean),
          bullets: section.bullets
            .map((bullet) => bullet.trim())
            .filter(Boolean),
        }))
        .filter(
          (section) =>
            section.heading ||
            section.paragraphs.length > 0 ||
            section.bullets.length > 0
        );

      const topicData = {
        title,
        slug,
        description: description || null,
        icon: form.icon.trim() || "💻",
        content: {
          sections: cleanSections,
        },
        published: false,
      };

      const { data, error } = await supabase
        .from("technology_topics")
        .insert(topicData)
        .select()
        .single();

      if (error) {
        console.error("SUPABASE ERROR:", error);
        setMessage(`Error: ${error.message}`);
        return;
      }

      console.log("TOPIC SAVED SUCCESSFULLY:", data);

      setMessage("Technology topic saved successfully as a draft.");

      resetForm();

      await loadTopics();
    } catch (error) {
      console.error("UNEXPECTED SAVE ERROR:", error);

      setMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred."
      );
    } finally {
      setSaving(false);
    }
  }

  async function publishTopic(id: number) {
    setMessage("");

    const { error } = await supabase
      .from("technology_topics")
      .update({ published: true })
      .eq("id", id);

    if (error) {
      console.error("Error publishing topic:", error);
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Technology topic published successfully.");
    await loadTopics();
  }

  async function unpublishTopic(id: number) {
    setMessage("");

    const { error } = await supabase
      .from("technology_topics")
      .update({ published: false })
      .eq("id", id);

    if (error) {
      console.error("Error moving topic to draft:", error);
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Technology topic moved back to draft.");
    await loadTopics();
  }

  function getSections(topic: TechnologyTopic): TopicSection[] {
    return topic.content?.sections ?? [];
  }

  return (
    <main className="min-h-screen bg-[#060816] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute right-[-180px] top-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[25%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060816]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-5">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">
              MindraInfo Studio
            </p>

            <h1 className="mt-1 text-2xl font-black">
              Technology Topics
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">

            <Link
              href="/admin"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              ← Director Panel
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Sign Out
            </button>

          </div>

        </div>
      </header>

      <div className="relative mx-auto max-w-[1500px] px-6 py-12">

        {/* HERO */}

        <section className="mb-12">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">

              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />

              Technology Content Studio

            </div>

            <h2 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
              Build the
              <span className="block bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                technology library.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/50">
              Create structured technology topics, organize technical
              knowledge and publish educational content without changing
              your existing technology topics.
            </p>

          </div>

        </section>

        {/* MESSAGE */}

        {message && (
          <div className="mb-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm font-semibold text-cyan-200">
            {message}
          </div>
        )}

        {/* EDITOR */}

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">

          {/* LEFT */}

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 md:p-8">

            <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-center">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-400">
                  New Topic
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Topic details
                </h3>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>

            </div>

            <div className="mt-8 space-y-6">

              {/* TITLE */}

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                  Topic Title
                </label>

                <input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;

                    setForm((current) => ({
                      ...current,
                      title,
                      slug:
                        current.slug === createSlug(current.title) ||
                        !current.slug
                          ? createSlug(title)
                          : current.slug,
                    }));
                  }}
                  placeholder="e.g. Artificial Intelligence"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-lg font-semibold text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
                />
              </div>

              {/* SLUG */}

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      slug: createSlug(e.target.value),
                    }))
                  }
                  placeholder="artificial-intelligence"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white/80 outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
                />

                <p className="mt-2 text-xs text-white/30">
                  Public URL: /technology/
                  {form.slug || "your-topic-slug"}
                </p>
              </div>

              {/* CATEGORY + ICON */}

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        category: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111525] px-5 py-4 text-white outline-none transition focus:border-violet-400/50"
                  >
                    {categories.map((category) => (
                      <option key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                    Icon
                  </label>

                  <input
                    value={form.icon}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        icon: e.target.value,
                      }))
                    }
                    maxLength={4}
                    placeholder="💻"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-2xl outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
                  />
                </div>

              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Explain what readers will learn from this technology topic."
                  className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-5 py-4 leading-7 text-white/80 outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
                />
              </div>

              {/* CONTENT BUILDER */}

              <div className="border-t border-white/10 pt-8">

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
                      Knowledge Builder
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Topic sections
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      Build each topic using headings, paragraphs and
                      bullet points.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSection}
                    className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5"
                  >
                    + Add Section
                  </button>

                </div>

                <div className="mt-6 space-y-6">

                  {form.sections.map((section, sectionIndex) => (

                    <div
                      key={sectionIndex}
                      className="rounded-3xl border border-white/10 bg-black/20 p-5"
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-sm font-black text-violet-300">
                            {String(sectionIndex + 1).padStart(2, "0")}
                          </span>

                          <span className="text-sm font-bold text-white/70">
                            Section {sectionIndex + 1}
                          </span>

                        </div>

                        {form.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeSection(sectionIndex)
                            }
                            className="text-xs font-bold text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}

                      </div>

                      {/* HEADING */}

                      <input
                        value={section.heading}
                        onChange={(e) =>
                          updateSection(
                            sectionIndex,
                            "heading",
                            e.target.value
                          )
                        }
                        placeholder="Section heading"
                        className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 font-bold text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
                      />

                      {/* PARAGRAPHS */}

                      <div className="mt-5">

                        <div className="flex items-center justify-between">

                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                            Paragraphs
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              addParagraph(sectionIndex)
                            }
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                          >
                            + Paragraph
                          </button>

                        </div>

                        <div className="mt-3 space-y-3">

                          {section.paragraphs.map(
                            (paragraph, paragraphIndex) => (

                              <div
                                key={paragraphIndex}
                                className="flex gap-3"
                              >

                                <textarea
                                  value={paragraph}
                                  onChange={(e) =>
                                    updateParagraph(
                                      sectionIndex,
                                      paragraphIndex,
                                      e.target.value
                                    )
                                  }
                                  rows={4}
                                  placeholder="Write the paragraph..."
                                  className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3.5 leading-7 text-white/75 outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
                                />

                                {section.paragraphs.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeParagraph(
                                        sectionIndex,
                                        paragraphIndex
                                      )
                                    }
                                    className="mt-2 text-xs font-bold text-red-400"
                                  >
                                    ×
                                  </button>
                                )}

                              </div>

                            )
                          )}

                        </div>

                      </div>

                      {/* BULLETS */}

                      <div className="mt-6">

                        <div className="flex items-center justify-between">

                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                            Bullet Points
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              addBullet(sectionIndex)
                            }
                            className="text-xs font-bold text-violet-400 hover:text-violet-300"
                          >
                            + Bullet
                          </button>

                        </div>

                        {section.bullets.length > 0 && (
                          <div className="mt-3 space-y-3">

                            {section.bullets.map(
                              (bullet, bulletIndex) => (

                                <div
                                  key={bulletIndex}
                                  className="flex gap-3"
                                >

                                  <input
                                    value={bullet}
                                    onChange={(e) =>
                                      updateBullet(
                                        sectionIndex,
                                        bulletIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Write a bullet point..."
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3.5 text-white/75 outline-none transition placeholder:text-white/20 focus:border-violet-400/40"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeBullet(
                                        sectionIndex,
                                        bulletIndex
                                      )
                                    }
                                    className="text-xs font-bold text-red-400"
                                  >
                                    ×
                                  </button>

                                </div>

                              )
                            )}

                          </div>
                        )}

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              {/* SAVE */}

              <div className="flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row">

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveTopic}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-4 font-black shadow-lg shadow-violet-500/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Topic as Draft"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={resetForm}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  Reset
                </button>

              </div>

            </div>

          </div>

          {/* RIGHT PREVIEW */}

          <aside className="xl:sticky xl:top-28 xl:self-start">

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
                  Live Preview
                </p>

                <h3 className="mt-2 text-xl font-black">
                  Topic appearance
                </h3>

              </div>

              <div className="p-6">

                <div className="rounded-3xl border border-white/10 bg-[#050816] p-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/10 text-3xl">
                      {form.icon || "💻"}
                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                        Technology
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        MindraInfo Topic
                      </p>

                    </div>

                  </div>

                  <h4 className="mt-6 text-2xl font-black leading-tight">
                    {form.title ||
                      "Your technology topic will appear here"}
                  </h4>

                  <p className="mt-4 text-sm leading-7 text-white/50">
                    {form.description ||
                      "Your topic description will appear here."}
                  </p>

                  <div className="mt-6 border-t border-white/10 pt-6">

                    {form.sections.slice(0, 2).map(
                      (section, index) => (

                        <div
                          key={index}
                          className="mb-6 last:mb-0"
                        >

                          <h5 className="text-lg font-black">
                            {section.heading ||
                              `Section ${index + 1}`}
                          </h5>

                          {section.paragraphs[0] && (
                            <p className="mt-3 text-sm leading-6 text-white/50">
                              {section.paragraphs[0]}
                            </p>
                          )}

                          {section.bullets.length > 0 && (
                            <div className="mt-3 space-y-2">

                              {section.bullets
                                .slice(0, 3)
                                .map(
                                  (bullet, bulletIndex) => (

                                    <div
                                      key={bulletIndex}
                                      className="text-xs text-white/50"
                                    >

                                      <span className="mr-2 text-violet-400">
                                        ✦
                                      </span>

                                      {bullet}

                                    </div>

                                  )
                                )}

                            </div>
                          )}

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* STATS */}

            <div className="mt-5 grid grid-cols-3 gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                  Topics
                </p>

                <p className="mt-2 text-2xl font-black">
                  {topics.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                  Live
                </p>

                <p className="mt-2 text-2xl font-black text-emerald-400">
                  {
                    topics.filter(
                      (topic) => topic.published
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                  Drafts
                </p>

                <p className="mt-2 text-2xl font-black text-amber-400">
                  {
                    topics.filter(
                      (topic) => !topic.published
                    ).length
                  }
                </p>
              </div>

            </div>

          </aside>

        </section>

        {/* EXISTING TOPICS */}

        <section className="mt-16">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-400">
              Technology Library
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Existing technology topics
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
              Your existing technology topics are preserved. You can
              publish or move topics back to draft without deleting them.
            </p>
          </div>

          {loading ? (

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center text-white/40">
              Loading technology topics...
            </div>

          ) : topics.length > 0 ? (

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {topics.map((topic) => (

                <article
                  key={topic.id}
                  className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.05]"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                      {topic.icon || "💻"}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        topic.published
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {topic.published
                        ? "Published"
                        : "Draft"}
                    </span>

                  </div>

                  <h3 className="mt-5 text-xl font-black leading-tight">
                    {topic.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/40">
                    {topic.description ||
                      "No description available."}
                  </p>

                  <div className="mt-5 text-xs text-white/25">
                    {getSections(topic).length} content{" "}
                    {getSections(topic).length === 1
                      ? "section"
                      : "sections"}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-5">

                    <Link
                      href={`/technology/${topic.slug}`}
                      target="_blank"
                      className="text-sm font-bold text-cyan-400 transition hover:text-cyan-300"
                    >
                      View topic →
                    </Link>

                    {topic.published ? (

                      <button
                        type="button"
                        onClick={() =>
                          unpublishTopic(topic.id)
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
                      >
                        Make Draft
                      </button>

                    ) : (

                      <button
                        type="button"
                        onClick={() =>
                          publishTopic(topic.id)
                        }
                        className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                      >
                        Publish
                      </button>

                    )}

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center text-white/40">
              No technology topics found.
            </div>

          )}

        </section>

      </div>

      {/* FOOTER */}

      <footer className="mt-16 border-t border-white/10">

        <div className="mx-auto max-w-[1500px] px-6 py-8 text-center text-sm text-white/30">
          © 2026 MindraInfo Technology Content Studio
        </div>

      </footer>

    </main>
  );
}
