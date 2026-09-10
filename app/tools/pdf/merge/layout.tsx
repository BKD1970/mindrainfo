import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF | Combine PDF Files Online",
  description:
    "Combine multiple PDF files into a single PDF document with MindraInfo's online PDF merger.",
  alternates: {
    canonical: "/tools/pdf/merge",
  },
};

export default function MergePDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}