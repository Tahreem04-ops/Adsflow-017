import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AdFlow — Ad Analytics Platform',
  description: 'Track, analyze and optimize your advertising campaigns in real time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
