import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MindraSave | Save Supported Online Media",
  description:
    "MindraSave helps you save supported online media in convenient MP4 and MP3 formats.",
  alternates: {
    canonical: "/tools/mindrasave",
  },
};

export default function MindraSaveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}