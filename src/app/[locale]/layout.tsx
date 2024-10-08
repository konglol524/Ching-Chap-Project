import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DropdownNavigator } from "@/components/Dropdown";
import { Analytics } from "@vercel/analytics/react";
import TranslationProvider from "@/components/TranslationProvider";
import { AudioContextProvider } from "@/components/AudioContextProvider";

import initTranslations from "../i18n";

const i18nNamespaces = ["Common", "Nav", "About"];

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ching Chap Plus",
  description: "Metronome for Thai Music",
};

export default async function RootLayout({
  children,
  params, // Capture params for locale
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string }; // Add 'params' to capture the locale from route
}>) {
  // Fallback to 'th' if no locale is provided
  const locale = params?.locale || "th";
  // Load translations for the given locale and namespace(s)
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale}>
      <body className={inter.className}>
      <AudioContextProvider>
        <TranslationProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
          <DropdownNavigator />
          {children}
          <Analytics />
        </TranslationProvider>
        </AudioContextProvider>
      </body>
    </html>
  );
}
