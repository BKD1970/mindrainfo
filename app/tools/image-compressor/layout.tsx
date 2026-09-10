import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor | Reduce Image Size Online",
  description:
    "Compress images online and reduce file size while maintaining useful image quality with MindraInfo's Image Compressor.",
  alternates: {
    canonical: "/tools/image-compressor",
  },
};

export default function ImageCompressorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}