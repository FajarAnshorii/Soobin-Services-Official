import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import PageTransitionLoader from '@/components/PageTransitionLoader';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL("https://soobinservices.com"),

  title: {
    default: "Soobin Services | Layanan Akademik, Desain dan Administrasi",
    template: "%s | Soobin Services",
  },

  description:
    "Soobin Services menyediakan layanan pendampingan akademik, parafrase, desain PowerPoint, pengolahan data, formatting dokumen, dan administrasi.",

  keywords: [
    "Soobin Services",
    "jasa parafrase",
    "jasa desain PPT",
    "jasa pengolahan data",
    "jasa formatting skripsi",
    "layanan akademik",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Soobin Services",
    title: "Soobin Services | Layanan Akademik, Desain dan Administrasi",
    description:
      "Layanan pendampingan akademik, parafrase, presentasi, pengolahan data, dan administrasi.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Soobin Services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Soobin Services",
    description:
      "Layanan akademik, desain, pengolahan data, dan administrasi.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <PageTransitionLoader />
            </Suspense>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}