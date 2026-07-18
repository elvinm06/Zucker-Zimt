'use client';

import Link from 'next/link';
import { appConfig } from '@/config/app.config';
import Logo from './Logo';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';

export default function Footer() {
  const settings = useSettings();
  const { t } = useSiteLang();

  return (
    <footer className="border-t border-cream-300/70 bg-cream-100/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo size="sm" showSub={false} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {t.footerDescription}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t.footerRange}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <Link href="/#katalog" className="transition hover:text-primary">
                {t.footerAllCakes}
              </Link>
            </li>
            <li>
              <Link href="/#ablauf" className="transition hover:text-primary">
                {t.footerHowToOrder}
              </Link>
            </li>
            <li>
              <Link href="/#kontakt" className="transition hover:text-primary">
                {t.footerCustom}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t.footerContact}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>{settings.address}</li>
            <li>{settings.hours}</li>
            <li>
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="transition hover:text-primary"
              >
                {settings.phone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t.footerFollow}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-primary"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`https://t.me/${settings.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-primary"
              >
                Telegram
              </a>
            </li>
            <li>
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-primary"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-300/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {settings.name}. {t.footerRights}
          </span>

        </div>
      </div>
    </footer>
  );
}
