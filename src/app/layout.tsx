import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  applicationName: '딜리칩',
  title: {
    default: '딜리칩 - 배달 앱 할인 비교',
    template: '%s | 딜리칩',
  },
  description: '복잡한 배달어플들의 조건을 걷어내고, 지금 이 브랜드를 먹으려면 어느 앱이 가장 저렴한지 제공해주는 초직관적 비교 웹사이트',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: '딜리칩 (Deli-Cheap)',
    description: '어느 배달앱이 가장 쌀까? 1초 만에 확인하세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '딜리칩',
  },
  twitter: {
    card: 'summary_large_image',
    title: '딜리칩 (Deli-Cheap)',
    description: '배달 앱 통합 쿠폰 비교',
  },
};

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
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
      <body className="min-h-full bg-gray-50">
        <div className="max-w-md mx-auto w-full min-h-screen bg-white shadow-sm flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
