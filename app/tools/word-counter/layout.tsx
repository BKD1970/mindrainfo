import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter | Count Words & Characters Online",
  description:
    "Count words, characters, sentences, and other text statistics quickly with MindraInfo's online Word Counter.",
  alternates: {
    canonical: "/tools/word-counter",
  },
};

export default function WordCounterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}