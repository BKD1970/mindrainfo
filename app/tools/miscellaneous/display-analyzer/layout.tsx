import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Display Analyzer | Dead Pixel & Backlight Bleed Test',
  description: 'Free online monitor testing tool. Find dead pixels, check for backlight bleed on IPS panels, and test monitor color banding (8-bit vs 10-bit).',
  keywords: [
    'dead pixel test',
    'backlight bleed test',
    'ips glow test',
    'monitor color banding test',
    'stuck pixel fixer',
    'display analyzer',
    'monitor screen test',
    'check monitor health'
  ],
  openGraph: {
    title: 'Display Analyzer | Check Monitor Health',
    description: 'Find dead pixels, backlight bleed, and test color gradients in full-screen mode.',
    url: 'https://mindrainfo.in/tools/miscellaneous/display-analyzer',
    siteName: 'YourSiteName',
    images: [
      {
        url: '/og-display-analyzer.png', // Save an image showing the UI cards
        width: 1200,
        height: 630,
        alt: 'Monitor Display Test Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Display Analyzer | Dead Pixel Test',
    description: 'Check your monitor for dead pixels and backlight bleed instantly.',
  },
  alternates: {
    canonical: 'https://mindrainfo.in/tools/miscellaneous/display-analyzer',
  }
};

export default function DisplayAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}