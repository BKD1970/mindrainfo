import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excel to PDF | Convert Excel to PDF",
  description:
    "Convert Excel spreadsheets to PDF format with MindraInfo's convenient online Excel to PDF tool.",
  alternates: {
    canonical: "/tools/pdf/excel-to-pdf",
  },
};

export default function ExcelToPDFLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}