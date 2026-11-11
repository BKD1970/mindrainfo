import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Hardware Testing Tools | Keyboard, Mouse, Display & Mic',
  description: 'The ultimate collection of free online diagnostic tools for gamers and hardware engineers. Test your mechanical keyboard, mouse polling rate, monitor health, and A/V setup instantly.',
  keywords: [
    'hardware testing tools',
    'online pc diagnostic',
    'peripheral tester',
    'free keyboard tester',
    'mouse polling rate checker',
    'monitor dead pixel test',
    'webcam and mic tester',
    'gaming setup test',
    'hardware debugging tools',
  ],
  openGraph: {
    title: 'Ultimate Hardware Testing Tools Collection',
    description: 'Test your keyboard (NKRO), mouse polling rate (Hz), monitor backlight bleed, and webcam/mic instantly in your browser.',
    url: 'https://mindrainfo.in/tools/miscellaneous', 
    siteName: 'Mindrainfo', 
    images: [
      {
        url: '/og-misc-tools-catalog.png', // Save a cool screenshot of your catalog grid here
        width: 1200,
        height: 630,
        alt: 'Hardware Testing Tools Catalog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Hardware Testing Tools | Keyboard, Mouse & Display',
    description: 'The ultimate digital utility belt. Test your setup for ghosting, polling rate drops, dead pixels, and A/V desync.',
    images: ['/og-misc-tools-catalog.png'],
  },
  alternates: {
    canonical: 'https://mindrainfo.in/tools/miscellaneous', // REPLACE WITH YOUR ACTUAL URL
  }
};

export default function MiscellaneousToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // We wrap the children in a fragment. 
    // Any global providers specific to the miscellaneous section can also go here in the future.
    <>{children}</>
  );
}