import type { Metadata, Viewport } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import { appConfig } from '@/config/app.config';
import { getSettings } from '@/lib/api';
import { getLocale } from '@/lib/locale';
import { LocaleProvider } from './components/LocaleProvider';
import Cursor from './components/motion/Cursor';
import MotionProvider from './components/motion/MotionProvider';
import ScrollProgress from './components/motion/ScrollProgress';
import SmoothScroll from './components/motion/SmoothScroll';
import { FALLBACK_SETTINGS } from '@/config/fallback-settings';
import { SettingsProvider } from './components/SettingsProvider';
import './globals.css';

// Body: a clean grotesque with an optical-size axis, so small labels and
// running text get different cuts. Display: Fraunces — a soft, old-style
// serif whose italic carries the "handmade" mood of the brand.
const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  axes: ['opsz'],
  display: 'swap',
});
const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FBF6EF',
  width: 'device-width',
  initialScale: 1,
};

// Title and description follow the settings edited in the admin panel.
export async function generateMetadata(): Promise<Metadata> {
  const settings = (await getSettings()) ?? FALLBACK_SETTINGS;

  return {
    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s | ${settings.name}`,
    },
    description: appConfig.description,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = (await getSettings()) ?? FALLBACK_SETTINGS;
  const lang = getLocale();

  return (
    <html lang={lang} className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <LocaleProvider lang={lang}>
          <SettingsProvider settings={settings}>
            <MotionProvider>
              <SmoothScroll />
              <ScrollProgress />
              <Cursor />
              {children}
            </MotionProvider>
          </SettingsProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
