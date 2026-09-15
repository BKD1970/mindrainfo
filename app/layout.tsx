import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mindrainfo.in"),

  title: {
    default: "MindraInfo | AI, Technology, Careers, Shop, Tools & Jobs",
    template: "%s | MindraInfo",
  },

  description:
    "MindraInfo provides useful AI and technology resources, career guidance, job information, online tools, data analytics content, articles, and an online shop.",

  keywords: [
    "MindraInfo",
    "AI",
    "artificial intelligence",
    "technology",
    "career",
    "jobs",
    "data analytics",
    "online tools",
    "articles",
    "shop",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "MindraInfo",
    title: "MindraInfo | AI, Technology, Careers, Shop, Tools & Jobs",
    description:
      "Explore AI, technology, careers, jobs, data analytics, useful online tools, articles, and products on MindraInfo.",
    url: "https://mindrainfo.in",
  },

  twitter: {
    card: "summary_large_image",
    title: "MindraInfo | AI, Technology, Careers, Shop, Tools & Jobs",
    description:
      "Explore AI, technology, careers, jobs, data analytics, useful online tools, articles, and products on MindraInfo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}