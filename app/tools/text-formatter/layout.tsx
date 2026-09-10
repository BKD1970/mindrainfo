import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Formatter | Format Text Online",
  description:
    "Format and clean text quickly with MindraInfo's simple online Text Formatter.",
  alternates: {
    canonical: "/tools/text-formatter",
  },
};

export default function TextFormatterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}