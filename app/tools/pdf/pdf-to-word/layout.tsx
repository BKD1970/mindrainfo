import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Word | Convert PDF to Word",
  description:
    "Convert supported PDF files to editable Word documents with MindraInfo's online PDF to Word tool.",
  alternates: {
    canonical: "/tools/pdf/pdf-to-word",
  },
};

export default function PDFToWordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}