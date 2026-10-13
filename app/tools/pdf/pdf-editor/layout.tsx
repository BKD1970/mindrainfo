import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online PDF Editor for Mobile | MindraInfo",
  description:
    "Edit supported PDF text, add text and images, and download a new PDF copy from your phone or computer. No sign-up or payment required.",
  openGraph: {
    title: "Free Online PDF Editor for Mobile | MindraInfo",
    description:
      "Edit supported PDF text, add text and images, and download a new PDF copy from your browser.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PdfEditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
