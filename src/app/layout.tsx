import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-primary",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "CineGlow | Premium Movie & Series Experience",
  description: "Discover, stream, and save your favorite movies and Korean dramas in style.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="preconnect" href="https://autoembed.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://autoembed.co" />
        <link rel="preconnect" href="https://vidsrc.pm" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vidsrc.pm" />
        <link rel="preconnect" href="https://vidsrc.me" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vidsrc.me" />
        <link rel="preconnect" href="https://2embed.skin" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://2embed.skin" />
        <link rel="preconnect" href="https://vidsrc.su" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vidsrc.su" />
        <link rel="preconnect" href="https://player.videasy.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://player.videasy.net" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
