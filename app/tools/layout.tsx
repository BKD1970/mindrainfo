import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Tools | Free Useful Tools",
  description:
    "Use practical online tools from MindraInfo for PDFs, images, text, calculations, data, AI, media, and everyday tasks.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}