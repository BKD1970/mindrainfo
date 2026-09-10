import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Helper | Create Better AI Prompts",
  description:
    "Create clearer and more effective AI prompts with MindraInfo's AI Prompt Helper for writing, learning, research, coding, and everyday tasks.",
  alternates: {
    canonical: "/tools/ai-prompt-helper",
  },
};

export default function AIPromptHelperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}