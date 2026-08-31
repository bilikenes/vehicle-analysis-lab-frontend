import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";

import { Providers } from "@/app/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Vehicle Analysis Lab",
  description: "Turn vehicle images into structured data.",
  openGraph: {
    title: "See what the model sees.",
    description: "Upload a vehicle image and turn it into structured data.",
    images: [{ alt: "Vehicle Analysis Lab", height: 909, url: "/og.png", width: 1731 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "See what the model sees.",
    description: "Upload a vehicle image and turn it into structured data.",
    images: ["/og.png"],
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
