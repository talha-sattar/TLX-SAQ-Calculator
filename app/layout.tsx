import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NASA TLX Calculator",
  description: "NASA TLX Calculator by Tanimal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="w-full border-b border-gray-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-4">
            <div className="text-lg font-semibold text-gray-900">
              NASA-TLX Toolkit
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Calculator
              </Link>
              <Link
                href="/lb-questionnaire"
                className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                LB Questionnaire
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
