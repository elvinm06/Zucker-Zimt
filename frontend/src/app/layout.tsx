import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { appConfig } from '@/config/app.config';
import { getSettings } from '@/lib/api';
import { getLocale } from '@/lib/locale';
import { LocaleProvider } from './components/LocaleProvider';
import ScrollProgress from './components/motion/ScrollProgress';
import { FALLBACK_SETTINGS } from '@/config/fallback-settings';
import { SettingsProvider } from './components/SettingsProvider';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

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
            <ScrollProgress />
            {children}
          </SettingsProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
