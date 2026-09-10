import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF | Rotate PDF Pages Online",
  description:
    "Rotate pages in supported PDF files online with MindraInfo's simple PDF rotation tool.",
  alternates: {
    canonical: "/tools/pdf/rotate",
  },
};

export default function RotatePDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}