import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Technology, AI, Careers & More",
  description:
    "Read useful articles about AI, technology, careers, data analytics, jobs, tools, and practical ideas from MindraInfo.",
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}