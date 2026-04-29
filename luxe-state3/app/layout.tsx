import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { LanguageProvider } from "./contexts/LanguageContext";
import { getDictionary } from "../lib/i18n";
import { defaultLocale, Locale, locales } from "../i18n/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxe Estate - Premium Real Estate",
  description: "Find your sanctuary with Luxe Estate.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = locales.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className={`${inter.variable} antialiased h-full`}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col selection:bg-mosque selection:text-white">
        <LanguageProvider initialLanguage={locale} initialDictionary={dictionary}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
