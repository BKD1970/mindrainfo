import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mouse Polling Rate Checker | Real-Time Hz Test',
  description: 'Test your mouse polling rate (Hz) instantly. Free online tool to check if your gaming mouse is actually hitting 1000Hz, 4000Hz, or 8000Hz.',
  keywords: [
    'mouse polling rate test',
    'mouse hz tester',
    'check mouse polling rate',
    '1000hz mouse test',
    'mouse frequency tracker',
    'gaming mouse test',
    'mouse performance test'
  ],
  openGraph: {
    title: 'Mouse Polling Rate (Hz) Tester',
    description: 'Check your gaming mouse tracking speed and consistency in real-time.',
    url: 'https://mindrainfo.in/tools/miscellaneous/mouse-polling',
    siteName: 'YourSiteName',
    images: [
      {
        url: '/og-mouse-polling.png', 
        width: 1200,
        height: 630,
        alt: 'Mouse Polling Rate Live Graph',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Polling Rate (Hz) Tester',
    description: 'Check your gaming mouse tracking speed and consistency in real-time.',
  }
};

export default function MousePollingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}