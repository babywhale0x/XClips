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
        <script defer data-domain="your-domain.com" src="https://analytics.vgdh.io/js/script.js"></script>
        <script defer data-domain="your-domain.com" src="https://analytics.vgdh.io/js/script.js"></script>
        <script defer data-domain="your-domain.com" src="https://analytics.vgdh.io/js/script.js"></script>
        <script src="https://pl29636561.effectivecpmnetwork.com/61/48/ef/6148efde6aa5c70100cd3c535d65fbb0.js"></script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <script src="https://pl29636611.effectivecpmnetwork.com/2f/e6/ed/2fe6ed034a49b30dddf4803c5b42877a.js"></script>
      </body>
    </html>
  );
}
