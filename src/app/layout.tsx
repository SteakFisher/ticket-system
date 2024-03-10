import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/next";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import Logout from "@/components/Logout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kreiva X Alfaaz",
  description: "Don't miss out on the fun - reserve your spot now!",
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,

}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Logout />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
