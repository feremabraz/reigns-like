import type { Metadata } from 'next';
import { Pixelify_Sans } from 'next/font/google';
import './globals.css';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-pixelify',
});

export const metadata: Metadata = {
  title: 'Reigns-like Game',
  description: 'A web-based game inspired by Reigns.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pixelify.variable} font-pixelify`}>{children}</body>
    </html>
  );
}
