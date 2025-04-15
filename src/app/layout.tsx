import type { Metadata } from "next";
import { Exo_2, Rajdhani } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-exo2",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "CHALLENGE",
  description:
    "Creating Holistic Approaches for Learning, Liberty, and Equity in New Global Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          rajdhani.variable,
          exo2.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
