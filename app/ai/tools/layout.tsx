import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools | Useful Artificial Intelligence Tools",
  description:
    "Discover useful AI tools for writing, research, design, coding, productivity, and everyday work.",
  alternates: {
    canonical: "/ai/tools",
  },
};

export default function AIToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}