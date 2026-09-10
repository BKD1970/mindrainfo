import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to JPG | Convert PDF Pages to Images",
  description:
    "Convert supported PDF pages into JPG images online with MindraInfo's PDF to JPG tool.",
  alternates: {
    canonical: "/tools/pdf/pdf-to-jpg",
  },
};

export default function PDFToJPGLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}