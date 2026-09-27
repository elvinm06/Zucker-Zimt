'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useReducedMotion } from '@/lib/motion';
import { TelegramIcon, WhatsAppIcon } from './BrandIcons';
import { ArrowUpRight, Clock, Instagram, MapPin, Phone } from './icons';
import { useSiteLang } from './LocaleProvider';
import { useSettings } from './SettingsProvider';
import Magnetic from './motion/Magnetic';
import Reveal from './motion/Reveal';
import SplitText from './motion/SplitText';

const BACKDROP =
  'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1600&q=70';

export default function ContactCTA() {
  const ref = useRef<HTMLElement>(null);
  const settings = useSettings();
  const { t } = useSiteLang();
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // The backdrop photo drifts slower than the page — quiet depth.
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const messengers = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/${settings.whatsapp}`,
      Icon: WhatsAppIcon,
    },
    {
      label: 'Telegram',
      href: `https://t.me/${settings.telegram}`,
      Icon: TelegramIcon,
    },
    { label: 'Instagram', href: settings.instagram, Icon: Instagram },
  ];

  return (
    <section
      ref={ref}
      id="kontakt"
      className="relative overflow-hidden bg-espresso text-cream-100"
    >
      <motion.div
        aria-hidden
        style={prefersReduced ? undefined : { y }}
        className="absolute -inset-y-[12%] inset-x-0"
      >
        <Image
          src={BACKDROP}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-espresso via-espresso/85 to-espresso"
      />
      <div
        aria-hidden
        className="blob -right-32 top-0 h-[34rem] w-[34rem] bg-caramel-500/15"
      />

      <div className="wrap relative py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal direction="none">
              <span className="eyebrow eyebrow-light">{t.ctaEyebrow}</span>
            </Reveal>

            <h2 className="mt-6 max-w-2xl text-display-lg font-medium text-cream-50">
              <SplitText text={t.ctaTitle} />
            </h2>

            <Reveal delay={0.15}>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream-200/85">
                {t.ctaText}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Magnetic strength={0.2} className="w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-light w-full sm:w-auto"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {t.ctaWhatsapp}
                  </a>
                </Magnetic>
                <Magnetic strength={0.2} className="w-full sm:w-auto">
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="btn-outline-light w-full sm:w-auto"
                  >
                    <Phone className="h-4 w-4" />
                    {settings.phone}
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <Reveal
            delay={0.2}
            className="lg:col-span-5 lg:border-l lg:border-cream-200/10 lg:pl-12"
          >
            <dl className="divide-y divide-cream-200/10 border-t border-cream-200/10 lg:border-t-0">
              <div className="flex gap-5 py-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cream-200/15 text-caramel-300">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <dt className="label-mono text-cream-300/60">{t.ctaHoursLabel}</dt>
                  <dd className="mt-1.5 text-cream-100">{settings.hours}</dd>
                </div>
              </div>

              <div className="flex gap-5 py-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cream-200/15 text-caramel-300">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <dt className="label-mono text-cream-300/60">
                    {t.ctaAddressLabel}
                  </dt>
                  <dd className="mt-1.5 text-cream-100">{settings.address}</dd>
                </div>
              </div>

              <div className="flex gap-5 py-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cream-200/15 text-caramel-300">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <dt className="label-mono text-cream-300/60">{t.ctaPhoneLabel}</dt>
                  <dd className="mt-1.5">
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, '')}`}
                      className="text-cream-100 transition-colors hover:text-caramel-300"
                    >
                      {settings.phone}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="py-6">
                <dt className="label-mono text-cream-300/60">
                  {t.ctaMessengerLabel}
                </dt>
                <dd className="mt-3 flex flex-col">
                  {messengers.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b border-cream-200/10 py-3 text-cream-100 transition-colors last:border-b-0 hover:text-caramel-300"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
