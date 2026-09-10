import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Tools | Free Online PDF Tools",
  description:
    "MindraInfo PDF tools provide a range of useful online tools to work with PDF files, including compression, conversion, merging, splitting, rotation, and page organization.",
  alternates: {
    canonical: "/tools/pdf",
  },
};

export default function PDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}