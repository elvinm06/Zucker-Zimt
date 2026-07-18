import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AdminLangProvider } from './components/AdminLangProvider';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Verwaltung — Bakery',
  description: 'Katalog- und Kontaktverwaltung.',
  // The admin panel must never show up in search results.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <AdminLangProvider>{children}</AdminLangProvider>
      </body>
    </html>
  );
}
