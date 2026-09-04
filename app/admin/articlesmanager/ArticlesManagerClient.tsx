"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

type Article = {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  published: boolean;
  description: string | null;
  icon: string | null;
  section: ArticleSection[] | null;
};

const emptySection: ArticleSection = {
  heading: "",
  paragraphs: [""],
  bullets: [],
};

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  description: "",
  category: "Data Analytics",
  image_url: "",
  icon: "📚",
  sections: [emptySection],
};

const categories = [
  "Data Analytics",
  "AI",
  "AI & Careers",
  "Technology",
  "Tools",
  "Career",
  "Jobs",
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ArticlesManagerPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();

    window.location.replace("/admin/login?role=articles");
  }

  async function loadArticles() {
    setLoading(true);

    const { data, error } = await supabaseBrowser
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading articles:", error);
      setMessage(`Error loading articles: ${error.message}`);
    } else {
      setArticles(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  function updateForm(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateSection(
    sectionIndex: number,
    field: keyof ArticleSection,
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
        if (index !== sectionIndex) {
          return section;
        }

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
        if (index !== sectionIndex) {
          return section;
        }

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
      sections: [
        ...current.sections,
        {
          heading: "",
          paragraphs: [""],
          bullets: [],
        },
      ],
    }));
  }

  function removeSection(sectionIndex: number) {
    setForm((current) => ({
      ...current,
      sections:
        current.sections.length === 1
          ? current.sections
          : current.sections.filter(
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
        if (index !== sectionIndex) {
          return section;
        }

        if (section.paragraphs.length === 1) {
          return section;
        }

        return {
          ...section,
          paragraphs: section.paragraphs.filter(
            (_, paragraph) => paragraph !== paragraphIndex
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
                (_, bullet) => bullet !== bulletIndex
              ),
            }
          : section
      ),
    }));
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      title: "",
      slug: "",
      excerpt: "",
      description: "",
      category: "Data Analytics",
      image_url: "",
      icon: "📚",
      sections: [
        {
          heading: "",
          paragraphs: [""],
          bullets: [],
        },
      ],
    });

    setMessage("");
  }

  function editArticle(article: Article) {
    setEditingId(article.id);

    setForm({
      title: article.title || "",
      slug: article.slug || "",
      excerpt: article.excerpt || "",
      description: article.description || "",
      category: article.category || "Data Analytics",
      image_url: article.image_url || "",
      icon: article.icon || "📚",
      sections:
        article.section && article.section.length > 0
          ? article.section.map((section) => ({
              heading: section.heading || "",
              paragraphs:
                section.paragraphs &&
                section.paragraphs.length > 0
                  ? [...section.paragraphs]
                  : [""],
              bullets: section.bullets
                ? [...section.bullets]
                : [],
            }))
          : [
              {
                heading: "",
                paragraphs: [""],
                bullets: [],
              },
            ],
    });

    setMessage(
      `Editing: ${article.title}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function saveArticle() {
    setSaving(true);
    setMessage("");

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

    const slug =
      form.slug.trim() || createSlug(form.title);

    if (!form.title.trim()) {
      setMessage("Please enter an article title.");
      setSaving(false);
      return;
    }

    if (!slug) {
      setMessage("Please enter a valid slug.");
      setSaving(false);
      return;
    }

    /* =====================================================
       EDIT EXISTING ARTICLE
    ====================================================== */

    if (editingId !== null) {
      const { data, error } = await supabaseBrowser
        .from("articles")
        .update({
          title: form.title.trim(),
          slug,
          excerpt: form.excerpt.trim(),
          content: "",
          category: form.category,
          image_url: form.image_url.trim() || null,
          description: form.description.trim(),
          icon: form.icon.trim() || "📚",
          section: cleanSections,
        })
        .eq("id", editingId)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating article:", error);
        setMessage(`Error updating article: ${error.message}`);
        setSaving(false);
        return;
      }

      if (!data) {
        setMessage("Article update could not be verified.");
        setSaving(false);
        return;
      }

      setMessage("Article updated successfully.");
      resetForm();
      await loadArticles();

      setSaving(false);
      return;
    }

    /* =====================================================
       CREATE NEW ARTICLE
    ====================================================== */

    const { data, error } = await supabaseBrowser
      .from("articles")
      .insert({
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt.trim(),
        content: "",
        category: form.category,
        image_url: form.image_url.trim() || null,
        published: false,
        description: form.description.trim(),
        icon: form.icon.trim() || "📚",
        section: cleanSections,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error saving article:", error);
      setMessage(`Error: ${error.message}`);
      setSaving(false);
      return;
    }

    if (!data) {
      setMessage("Article could not be saved.");
      setSaving(false);
      return;
    }

    setMessage("Article saved successfully as a draft.");
    resetForm();
    await loadArticles();

    setSaving(false);
  }

  async function publishArticle(id: number) {
    setMessage("");

    const { data, error } = await supabaseBrowser
      .from("articles")
      .update({ published: true })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error publishing article:", error);
      setMessage(`Error publishing article: ${error.message}`);
      return;
    }

    if (!data) {
      setMessage("Publish could not be verified.");
      return;
    }

    setMessage("Article published successfully.");
    await loadArticles();
  }

  async function unpublishArticle(id: number) {
    setMessage("");

    const { data, error } = await supabaseBrowser
      .from("articles")
      .update({ published: false })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error unpublishing article:", error);
      setMessage(`Error unpublishing article: ${error.message}`);
      return;
    }

    if (!data) {
      setMessage("Draft change could not be verified.");
      return;
    }

    setMessage("Article moved back to draft.");
    await loadArticles();
  }

  async function deleteArticle(id: number) {
    const article = articles.find(
      (item) => item.id === id
    );

    if (!article) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${article.title}" permanently?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    const { data, error } = await supabaseBrowser
      .from("articles")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      console.error("Error deleting article:", error);
      setMessage(`Error deleting article: ${error.message}`);
      setDeletingId(null);
      return;
    }

    if (!data) {
      setMessage("Article deletion could not be verified.");
      setDeletingId(null);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage("Article deleted successfully.");
    setDeletingId(null);

    await loadArticles();
  }

  return (
    <main className="min-h-screen bg-[#070914] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-180px] top-[15%] h-[560px] w-[560px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[25%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070914]/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-5">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
              MindraInfo Studio
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight">
              Article Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/admin"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              ← Director Panel
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl bg-red-500/90 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
            >
              Sign Out
            </button>

          </div>

        </div>

      </header>

      <div className="relative mx-auto max-w-[1500px] px-6 py-10">

        {/* INTRO */}

        <section className="mb-10">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Editorial Workspace
            </div>

            <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">

              {editingId !== null ? (
                <>
                  Edit your
                  <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                    article.
                  </span>
                </>
              ) : (
                <>
                  Create something
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                    worth reading.
                  </span>
                </>
              )}

            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/50">
              Create and manage MindraInfo articles without changing
              the existing public article experience.
            </p>

          </div>

        </section>

        {/* MESSAGE */}

        {message && (
          <div className="mb-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm font-semibold text-cyan-200">
            {message}
          </div>
        )}

        {/* EDIT MODE BANNER */}

        {editingId !== null && (
          <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                Editing Article
              </p>

              <p className="mt-1 text-sm font-semibold text-white/70">
                Changes will update the existing article.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Cancel Editing
            </button>

          </div>
        )}

        {/* EDITOR */}

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">

          {/* LEFT EDITOR */}

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 md:p-8">

            <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-center">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
                  {editingId !== null
                    ? "Edit Article"
                    : "New Article"}
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Article details
                </h3>

              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>

            </div>

            <div className="mt-8 space-y-6">

              {/* TITLE */}

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Title
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
                  placeholder="e.g. Excel Skills Every Data Analyst Should Know"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-lg font-semibold text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 focus:bg-white/[0.04]"
                />
              </div>

              {/* SLUG */}

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(e) =>
                    updateForm(
                      "slug",
                      createSlug(e.target.value)
                    )
                  }
                  placeholder="excel-skills-data-analyst"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white/80 outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 focus:bg-white/[0.04]"
                />

                <p className="mt-2 text-xs text-white/30">
                  Public URL: /articles/
                  {form.slug || "your-article-slug"}
                </p>
              </div>

              {/* CATEGORY + ICON */}

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      updateForm(
                        "category",
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111525] px-5 py-4 text-white outline-none transition focus:border-cyan-400/50"
                  >
                    {categories.map((category) => (
                      <option key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                    Icon
                  </label>

                  <input
                    value={form.icon}
                    onChange={(e) =>
                      updateForm(
                        "icon",
                        e.target.value
                      )
                    }
                    maxLength={4}
                    placeholder="📚"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-2xl outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
                  />
                </div>

              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateForm(
                      "description",
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Short description shown near the article title."
                  className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-5 py-4 leading-7 text-white/80 outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 focus:bg-white/[0.04]"
                />
              </div>

              {/* EXCERPT */}

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Excerpt
                </label>

                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    updateForm(
                      "excerpt",
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Short summary for article cards and listings."
                  className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-5 py-4 leading-7 text-white/80 outline-none transition placeholder:text-white/20 focus:border-cyan-400/50 focus:bg-white/[0.04]"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Image URL
                </label>

                <input
                  value={form.image_url}
                  onChange={(e) =>
                    updateForm(
                      "image_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white/80 outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
                />
              </div>

              {/* SECTIONS */}

              <div className="border-t border-white/10 pt-8">

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

                  <div>

                    <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-400">
                      Content Builder
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Article sections
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      Each section can contain a heading,
                      paragraphs and bullet points.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={addSection}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5"
                  >
                    + Add Section
                  </button>

                </div>

                <div className="mt-6 space-y-6">

                  {form.sections.map(
                    (section, sectionIndex) => (

                      <div
                        key={sectionIndex}
                        className="rounded-3xl border border-white/10 bg-black/20 p-5"
                      >

                        <div className="flex items-center justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-black text-cyan-300">
                              {String(
                                sectionIndex + 1
                              ).padStart(2, "0")}
                            </span>

                            <span className="text-sm font-bold text-white/70">
                              Section{" "}
                              {sectionIndex + 1}
                            </span>

                          </div>

                          {form.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeSection(
                                  sectionIndex
                                )
                              }
                              className="text-xs font-bold text-red-400 transition hover:text-red-300"
                            >
                              Remove
                            </button>
                          )}

                        </div>

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
                          className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 font-bold text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/50"
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
                                addParagraph(
                                  sectionIndex
                                )
                              }
                              className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                            >
                              + Paragraph
                            </button>

                          </div>

                          <div className="mt-3 space-y-3">

                            {section.paragraphs.map(
                              (
                                paragraph,
                                paragraphIndex
                              ) => (

                                <div
                                  key={
                                    paragraphIndex
                                  }
                                  className="flex gap-3"
                                >

                                  <textarea
                                    value={
                                      paragraph
                                    }
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

                                  {section.paragraphs
                                    .length > 1 && (
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
                              Bullet points
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                addBullet(
                                  sectionIndex
                                )
                              }
                              className="text-xs font-bold text-purple-400 hover:text-purple-300"
                            >
                              + Bullet
                            </button>

                          </div>

                          {section.bullets.length > 0 && (
                            <div className="mt-3 space-y-3">

                              {section.bullets.map(
                                (
                                  bullet,
                                  bulletIndex
                                ) => (

                                  <div
                                    key={
                                      bulletIndex
                                    }
                                    className="flex gap-3"
                                  >

                                    <input
                                      value={
                                        bullet
                                      }
                                      onChange={(e) =>
                                        updateBullet(
                                          sectionIndex,
                                          bulletIndex,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Write a bullet point..."
                                      className="w-full rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3.5 text-white/75 outline-none transition placeholder:text-white/20 focus:border-purple-400/40"
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

                    )
                  )}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row">

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveArticle}
                  className={`flex-1 rounded-2xl px-6 py-4 font-black shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                    editingId !== null
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-500/10 hover:shadow-orange-500/20"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/10 hover:shadow-cyan-500/20"
                  }`}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Save Changes"
                    : "Save Article as Draft"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={resetForm}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  {editingId !== null
                    ? "Cancel"
                    : "Reset"}
                </button>

              </div>

            </div>

          </div>

          {/* RIGHT PREVIEW */}

          <aside className="xl:sticky xl:top-28 xl:self-start">

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-400">
                  Live Preview
                </p>

                <h3 className="mt-2 text-xl font-black">
                  Article appearance
                </h3>

              </div>

              <div className="p-6">

                <div className="rounded-3xl border border-white/10 bg-[#050816] p-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
                      {form.icon || "📚"}
                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                        {form.category ||
                          "Category"}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        MindraInfo Article
                      </p>

                    </div>

                  </div>

                  <h4 className="mt-6 text-2xl font-black leading-tight">
                    {form.title ||
                      "Your article title will appear here"}
                  </h4>

                  <p className="mt-4 text-sm leading-7 text-white/50">
                    {form.description ||
                      "Your article description will appear here."}
                  </p>

                  <div className="mt-6 border-t border-white/10 pt-6">

                    {form.sections
                      .slice(0, 2)
                      .map((section, index) => (

                        <div
                          key={index}
                          className="mb-6 last:mb-0"
                        >

                          <h5 className="text-lg font-black">
                            {section.heading ||
                              `Section ${
                                index + 1
                              }`}
                          </h5>

                          {section.paragraphs[0] && (
                            <p className="mt-3 text-sm leading-6 text-white/50">
                              {
                                section
                                  .paragraphs[0]
                              }
                            </p>
                          )}

                          {section.bullets.length >
                            0 && (
                            <div className="mt-3 space-y-2">

                              {section.bullets
                                .slice(0, 3)
                                .map(
                                  (
                                    bullet,
                                    bulletIndex
                                  ) => (

                                    <div
                                      key={
                                        bulletIndex
                                      }
                                      className="text-xs text-white/50"
                                    >
                                      <span className="mr-2 text-cyan-400">
                                        ✦
                                      </span>

                                      {bullet}

                                    </div>

                                  )
                                )}

                            </div>
                          )}

                        </div>

                      ))}

                  </div>

                </div>

              </div>

            </div>

            {/* QUICK STATS */}

            <div className="mt-5 grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                  Articles
                </p>

                <p className="mt-2 text-3xl font-black">
                  {articles.length}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                  Published
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-400">
                  {
                    articles.filter(
                      (article) =>
                        article.published
                    ).length
                  }
                </p>

              </div>

            </div>

          </aside>

        </section>

        {/* EXISTING ARTICLES */}

        <section className="mt-16">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
                Content Library
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Existing articles
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Manage, edit, publish, unpublish or delete
                your MindraInfo articles.
              </p>

            </div>

          </div>

          {loading ? (

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center text-white/40">
              Loading articles...
            </div>

          ) : articles.length > 0 ? (

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {articles.map((article) => (

                <article
                  key={article.id}
                  className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                      {article.icon || "📚"}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        article.published
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {article.published
                        ? "Published"
                        : "Draft"}
                    </span>

                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                    {article.category}
                  </p>

                  <h3 className="mt-2 text-xl font-black leading-tight">
                    {article.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/40">
                    {article.description ||
                      article.excerpt ||
                      "No description available."}
                  </p>

                  {/* ACTIONS */}

                  <div className="mt-5 border-t border-white/10 pt-5">

                    {/* TOP ACTIONS */}

                    <div className="grid grid-cols-2 gap-2">

                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-cyan-400 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        👁️ View
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          editArticle(article)
                        }
                        className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-3 py-2.5 text-xs font-bold text-blue-300 transition hover:bg-blue-400/20"
                      >
                        ✏️ Edit
                      </button>

                    </div>

                    {/* STATUS + DELETE */}

                    <div className="mt-2 grid grid-cols-2 gap-2">

                      {article.published ? (

                        <button
                          type="button"
                          onClick={() =>
                            unpublishArticle(
                              article.id
                            )
                          }
                          className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-400/20"
                        >
                          📝 Make Draft
                        </button>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            publishArticle(
                              article.id
                            )
                          }
                          className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400/20"
                        >
                          📢 Publish
                        </button>

                      )}

                      <button
                        type="button"
                        disabled={
                          deletingId === article.id
                        }
                        onClick={() =>
                          deleteArticle(
                            article.id
                          )
                        }
                        className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId ===
                        article.id
                          ? "Deleting..."
                          : "🗑️ Delete"}
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center text-white/40">
              No articles found.
            </div>

          )}

        </section>

      </div>

    </main>
  );
}