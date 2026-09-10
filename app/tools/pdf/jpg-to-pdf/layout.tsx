import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to PDF | Convert Images to PDF",
  description:
    "Convert JPG and supported image files into PDF documents online with MindraInfo's JPG to PDF tool.",
  alternates: {
    canonical: "/tools/pdf/jpg-to-pdf",
  },
};

export default function JPGToPDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}