import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to PowerPoint | Convert PDF to PPT",
  description:
    "Convert supported PDF files into PowerPoint presentations with MindraInfo's PDF to PowerPoint tool.",
  alternates: {
    canonical: "/tools/pdf/pdf-to-powerpoint",
  },
};

export default function PDFToPowerPointLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}