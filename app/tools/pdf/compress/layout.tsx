import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF | Reduce PDF File Size",
  description:
    "Compress PDF files online and reduce their file size for easier storage, sharing, and uploading.",
  alternates: {
    canonical: "/tools/pdf/compress",
  },
};

export default function CompressPDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}