import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"; // Import our new wrapper

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | AM Tycoons Inc. - Premium Car Dealership",
    default: "AM Tycoons Inc. - Premium Car Dealership in Los Angeles",
  },
  description: "Discover premium cars at AM Tycoons Inc. Your trusted car dealership in Los Angeles.",
  metadataBase: new URL("https://amtycoons.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}