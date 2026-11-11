
import type { Metadata } from "next";

const pageUrl =
  "https://www.mindrainfo.in/tools/miscellaneous/keyboardtest";

export const metadata: Metadata = {
  title: "Free Online Keyboard Tester – Test Keys, NKRO & Ghosting",
  description:
    "Test your keyboard online for unresponsive keys, N-key rollover (NKRO), keyboard ghosting and switch problems. Free interactive keyboard tester for Windows and Mac layouts.",
  keywords: [
    "online keyboard tester",
    "keyboard test",
    "mechanical keyboard tester",
    "N-key rollover test",
    "NKRO tester",
    "keyboard ghosting test",
    "laptop keyboard test",
    "Mac keyboard tester",
    "Windows keyboard tester",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: "MindraInfo",
    title: "Free Online Keyboard Tester | MindraInfo",
    description:
      "Test your keyboard for unresponsive keys, ghosting and N-key rollover with MindraInfo's free interactive keyboard tester.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Free Online Keyboard Tester | MindraInfo",
    description:
      "Test your keyboard for unresponsive keys, ghosting and N-key rollover.",
  },
};

export default function KeyboardTestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
