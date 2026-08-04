import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-primary",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineGlow | Premium Movie Experience",
  description: "Discover, explore, and save your favorite movies in style.",
};

// Prefer a project-provided icon in /public. Falls back to Next's default otherwise.
export const icons = {
  icon: "/file.svg",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
