import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word to PDF | Convert Word Documents to PDF",
  description:
    "Convert Word documents to PDF format quickly and conveniently with MindraInfo's online Word to PDF tool.",
  alternates: {
    canonical: "/tools/pdf/word-to-pdf",
  },
};

export default function WordToPDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}