import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Excel | Convert PDF to Excel",
  description:
    "Convert supported PDF files into Excel spreadsheets for easier data editing and analysis.",
  alternates: {
    canonical: "/tools/pdf/pdf-to-excel",
  },
};

export default function PDFToExcelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}