import type { Metadata } from "next";
import { Orbitron, Titillium_Web } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import SiteHeader from "@/components/home/Header";
import SiteFooter from "@/components/home/Footer";
import { AuthProvider } from "@/lib/firebase/auth";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-orbitron",
});

const titillium_web = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-titillium-web",
});

export const metadata: Metadata = {
  title: "CHALLENGE",
  description:
    "Creating Holistic Approaches for Learning, Liberty, and Equity in New Global Education",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          titillium_web.variable,
          orbitron.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-gray-100 font-sans overflow-x-hidden">
            <AuthProvider>
              <SiteHeader />
              <main className="flex flex-grow flex-col items-center justify-center p-4 pt-10 md:p-0 md:px-4 overflow-hidden relative">
                {children}
              </main>
              <SiteFooter />
            </AuthProvider>
          </div>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
