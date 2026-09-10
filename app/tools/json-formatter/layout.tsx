import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter | Format & Read JSON Online",
  description:
    "Format, organize, and read JSON data easily with MindraInfo's online JSON Formatter.",
  alternates: {
    canonical: "/tools/json-formatter",
  },
};

export default function JSONFormatterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}