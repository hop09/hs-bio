import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Space_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "HS Bio — One link, entirely yours", template: "%s · HS Bio" },
  description: "Premium, responsive bio pages for creators, professionals, and modern brands.",
  applicationName: "HS Bio",
  icons: {
    icon: "/brand-mark.svg",
    shortcut: "/brand-mark.svg",
  },
  openGraph: {
    siteName: "HS Bio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable} ${spaceMono.variable} min-h-full antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
