import type { Metadata } from "next";
import { Exo_2, Rajdhani } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import SiteHeader from "@/components/home/Header";
import SiteFooter from "@/components/home/Footer";
import { AuthProvider } from "@/lib/firebase/auth";

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
          rajdhani.variable,
          exo2.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-gray-100 font-sans overflow-x-hidden">
            <AuthProvider>
              <SiteHeader />
              {children}
              <SiteFooter />
            </AuthProvider>
          </div>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
