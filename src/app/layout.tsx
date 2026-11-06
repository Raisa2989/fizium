import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

// Префикс задаётся только при публикации в подпапку (GitHub Pages);
// для корня домена (reg.ru, свой домен) — пустая строка.
const BASE_PATH = (process.env as Record<string, string | undefined>).NEXT_PUBLIC_BASE_PATH ?? "";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ФизиУм — учебник-тренажёр по физике 7–11 классы",
  description:
    "Полный школьный курс физики по федеральным рабочим программам: теория, интерактивный тренажёр, справочник и шпаргалка формул. Два этапа: 7–9 и 10–11 классы, базовый и углублённый уровни.",
  applicationName: "ФизиУм",
  manifest: `${BASE_PATH}/manifest.webmanifest`,
  keywords: ["физика", "тренажёр", "7 класс", "8 класс", "9 класс", "10 класс", "11 класс", "ОГЭ", "ЕГЭ", "учебник", "формулы", "PWA"],
  icons: {
    icon: [
      { url: `${BASE_PATH}/logo.svg`, type: "image/svg+xml" },
      { url: `${BASE_PATH}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${BASE_PATH}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: `${BASE_PATH}/icons/apple-touch-icon.png`,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ФизиУм",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f0e9" },
    { media: "(prefers-color-scheme: dark)", color: "#221410" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
