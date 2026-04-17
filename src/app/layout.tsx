import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "딜리칩 (Deli-Cheap) - 배달 앱 통합 쿠폰 비교",
  description: "복잡한 배달어플들의 조건을 걷어내고, 지금 이 브랜드를 먹으려면 어느 앱이 가장 저렴한지 제공해주는 초직관적 비교 웹사이트",
  openGraph: {
    title: "딜리칩 (Deli-Cheap)",
    description: "어느 배달앱이 가장 쌀까? 1초 만에 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "딜리칩",
  },
  twitter: {
    card: "summary_large_image",
    title: "딜리칩 (Deli-Cheap)",
    description: "배달 앱 통합 쿠폰 비교",
  },
};

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <main className="max-w-md mx-auto w-full min-h-screen bg-white shadow-sm flex flex-col">
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
