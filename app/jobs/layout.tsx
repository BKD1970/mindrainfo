import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs | Job Opportunities & Career Information",
  description:
    "Find useful job information, employment opportunities, career resources, and guidance to help you move forward in your career.",
  alternates: {
    canonical: "/jobs",
  },
};

export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}