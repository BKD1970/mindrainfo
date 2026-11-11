import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webcam & Microphone Tester | Hardware A/V Diagnostics',
  description: 'Free online camera and mic tester. Check your webcam resolution, framerate, and microphone audio levels in real-time. Secure, browser-based hardware diagnostic tool.',
  keywords: [
    'webcam test',
    'microphone test',
    'mic test online',
    'camera resolution checker',
    'webcam framerate test',
    'hardware diagnostic tool',
    'test camera online',
    'check mic volume',
    "Mindrainfo Camera Mic tester",
    "mindrainfo cameratest",
    "Camera test",
    "mic test",
    "microphone test",
  ],
  openGraph: {
    title: 'Hardware A/V Tester | Webcam & Mic',
    description: 'Verify your webcam resolution, framerate, and live microphone volume securely in your browser.',
    url: 'https://mindrainfo.in/tools/miscellaneous/camera-mic-test',
    siteName: 'Mindrainfo',
    images: [
      {
        url: '/og-camera-mic.png', 
        width: 1200,
        height: 630,
        alt: 'Camera and Mic Test Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webcam & Microphone Tester',
    description: 'Check your webcam resolution, framerate, and microphone audio levels in real-time.',
  }
};

export default function CameraMicTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}