import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { ADM_LOGO_SRC } from "@/components/brand/adm-logo";
import { ADM_COPY } from "@/lib/brand/copy";
import "./globals.css";

const googleSans = localFont({
  src: "../public/fonts/GoogleSans.ttf",
  variable: "--font-google-sans",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../public/fonts/NotoSans-Regular.ttf",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: ADM_COPY.pageTitle,
  description: ADM_COPY.pageDescription,
  icons: {
    icon: ADM_LOGO_SRC,
    apple: ADM_LOGO_SRC,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${googleSans.variable} ${jetbrainsMono.variable} ${googleSans.className} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
