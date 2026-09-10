import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PowerPoint to PDF | Convert PPT to PDF",
  description:
    "Convert PowerPoint presentations to PDF format conveniently with MindraInfo's online PowerPoint to PDF tool.",
  alternates: {
    canonical: "/tools/pdf/powerpoint-to-pdf",
  },
};

export default function PowerPointToPDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}