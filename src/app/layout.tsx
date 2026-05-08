import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SOOBIN Services | Turnitin, Parafrase & Joki Tugas Termurah',
  description: 'Solusi terpercaya untuk kebutuhan akademik Anda',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}