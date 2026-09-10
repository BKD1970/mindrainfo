import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV Viewer | View CSV Files Online",
  description:
    "View and explore CSV files online with a simple, convenient CSV viewer from MindraInfo.",
  alternates: {
    canonical: "/tools/csv-viewer",
  },
};

export default function CSVViewerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}