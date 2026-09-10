import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize PDF | Rearrange PDF Pages",
  description:
    "Organize and rearrange pages in supported PDF files with MindraInfo's online PDF organizer.",
  alternates: {
    canonical: "/tools/pdf/organize",
  },
};

export default function OrganizePDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}