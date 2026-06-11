import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XClips - Download X (Twitter) Videos Fast & Free",
  description: "Download high-quality videos from X (Twitter) instantly. No sign-in, no fees. The fastest X video downloader.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_ID && (
          <Script
            src="https://analytics.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
