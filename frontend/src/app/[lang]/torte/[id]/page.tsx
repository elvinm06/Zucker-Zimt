import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  appConfig,
  buildTelegramLink,
  buildWhatsAppLink,
  formatPrice,
  orderMessageTemplate,
} from '@/config/app.config';
import { ApiError, getProduct, getProducts, getSettings } from '@/lib/api';
import { getDictionary, toLocale } from '@/lib/locale';
import { allergenMeta } from '@/lib/allergens';
import type { Product } from '@/types/product';
import { TelegramIcon, WhatsAppIcon } from '@/app/components/BrandIcons';
import { AllergenIcon, ArrowLeft } from '@/app/components/icons';
import { FALLBACK_SETTINGS } from '@/config/fallback-settings';
import CatalogGrid from '@/app/components/CatalogGrid';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import LogoMark from '@/app/components/LogoMark';
import MobileOrderBar from '@/app/components/MobileOrderBar';
import ProductGallery from '@/app/components/ProductGallery';
import Magnetic from '@/app/components/motion/Magnetic';
import Reveal from '@/app/components/motion/Reveal';
import SplitText from '@/app/components/motion/SplitText';
import { Stagger, StaggerItem } from '@/app/components/motion/Stagger';

/**
 * Returns null for a missing id, so it renders the 404 page.
 *
 * Only a "not there" answer from the API counts. A backend that is down or
 * still waking up must keep failing: this page is cached, and swallowing
 * the error would replace a good page with a cached 404.
 */
async function loadProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProduct(id);
    // Hidden products must not be reachable through a direct link either.
    return product.is_active ? product : null;
  } catch (error) {
    // 400: the id is not a valid UUID; 404: no such product.
    if (error instanceof ApiError && [400, 404].includes(error.status)) {
      return null;
    }
    throw error;
  }
}

/** Product pages are generated on first visit and cached from then on. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await loadProduct(params.id);
  if (!product) return { title: 'Torte nicht gefunden' };

  return {
    title: product.name,
    description: product.description || appConfig.description,
    openGraph: {
      title: `${product.name}`,
      description: product.description || appConfig.description,
      images: product.images?.length ? product.images : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  // Fire all three backend calls at once instead of awaiting them in series —
  // on a slow/cold backend this cuts the page's wait from 3 round-trips to 1.
  const [product, settingsRaw, allProducts] = await Promise.all([
    loadProduct(params.id),
    getSettings(),
    getProducts().catch(() => [] as Product[]),
  ]);
  if (!product) notFound();

  const settings = settingsRaw ?? FALLBACK_SETTINGS;
  const t = getDictionary(params.lang);
  const lang = toLocale(params.lang);
  const price = formatPrice(product.price);
  const whatsappHref = buildWhatsAppLink(settings, product.name, lang);
  const telegramHref = buildTelegramLink(settings, product.name, lang);

  // Suggestions at the bottom; failure here must not break the page.
  const related = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen">
      <Header />

      <Reveal direction="down" duration={0.6}>
        <div className="wrap flex flex-col gap-4 pb-8 pt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <Link
            href="/#katalog"
            className="btn-ghost w-fit px-5 py-2.5 text-sm"
            aria-label={t.backToOverview}
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToOverview}
          </Link>

          <nav aria-label="Brotkrümelnavigation" className="text-sm text-muted">
            <Link href="/" className="transition hover:text-primary">
              {t.breadcrumbHome}
            </Link>
            <span className="mx-2 text-chocolate-200">/</span>
            <Link href="/#katalog" className="transition hover:text-primary">
              {t.breadcrumbCakes}
            </Link>
            <span className="mx-2 text-chocolate-200">/</span>
            <span className="text-primary">{product.name}</span>
          </nav>
        </div>
      </Reveal>

      <article className="wrap grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
        {/* --- Images --- */}
        <div className="lg:col-span-6">
          <ProductGallery
            images={product.images ?? []}
            name={product.name}
            badgeRing={t.badgeRing}
            badgeCenter={<LogoMark className="h-8 w-8 text-primary" />}
          />
        </div>

        {/* --- Details — every block cascades in on its own. --- */}
        <div className="space-y-10 lg:col-span-6 lg:pt-2">
          <div>
            <Reveal direction="none" duration={0.6}>
              <span className="eyebrow">{t.productEyebrow}</span>
            </Reveal>
            <h1 className="mt-6 text-display-lg font-medium text-primary">
              <SplitText text={product.name} trigger="mount" delay={0.2} />
            </h1>
            <Reveal delay={0.35} duration={0.6}>
              <p className="mt-5 font-display text-3xl text-accent sm:text-4xl">
                {price}
              </p>
            </Reveal>
          </div>

          {product.description && (
            <Reveal delay={0.1}>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                {product.description}
              </p>
            </Reveal>
          )}

          {product.ingredients?.length > 0 && (
            <section>
              <Reveal direction="none" duration={0.5}>
                <h2 className="label-mono mb-4">{t.ingredients}</h2>
              </Reveal>
              <Stagger className="flex flex-wrap gap-2">
                {product.ingredients.map((item) => (
                  <StaggerItem as="span" key={item} className="chip">
                    {item}
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          )}

          {product.allergens?.length > 0 && (
            <Reveal delay={0.1}>
              <section className="rounded-3xl border border-caramel-400/25 bg-caramel-300/10 p-6 sm:p-7">
                <h2 className="label-mono mb-4">{t.allergens}</h2>
                <Stagger className="grid gap-2 sm:grid-cols-2" stagger={0.06}>
                  {product.allergens.map((allergen) => {
                    const meta = allergenMeta(allergen);
                    const label = lang === 'en' ? meta.labelEn : meta.label;
                    return (
                      <StaggerItem key={allergen}>
                        <span className="flex items-center gap-3 rounded-2xl bg-cream-50/70 px-4 py-3 text-sm text-chocolate-600">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-caramel-400/40 text-primary">
                            <AllergenIcon allergen={allergen} className="h-4 w-4" />
                          </span>
                          {label}
                        </span>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
                <p className="mt-5 text-xs leading-relaxed text-muted">
                  {t.allergenNote}
                </p>
              </section>
            </Reveal>
          )}

          {/* Order buttons — the message text is built from the product name. */}
          <Reveal delay={0.15}>
            <section
              id="bestellen"
              className="rounded-3xl border border-line bg-cream-50/70 p-6 sm:p-7"
            >
              <h2 className="font-display text-2xl text-primary">
                {t.orderTitle}
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                {t.orderText}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Magnetic strength={0.15} className="flex-1">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full min-h-[3.25rem] whitespace-nowrap px-4 text-sm bg-[#25D366] text-[#0B3B22] shadow-soft hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0" />
                    {t.orderWhatsapp}
                  </a>
                </Magnetic>
                <Magnetic strength={0.15} className="flex-1">
                  <a
                    href={telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full min-h-[3.25rem] whitespace-nowrap px-4 text-sm bg-[#229ED9] text-cream-50 shadow-soft hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <TelegramIcon className="h-5 w-5 shrink-0" />
                    {t.orderTelegram}
                  </a>
                </Magnetic>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted">
                {t.messagePreview(
                  orderMessageTemplate(settings, product.name, lang),
                )}
              </p>
            </section>
          </Reveal>
        </div>
      </article>

      {related.length > 0 && (
        <section className="wrap pb-28">
          <div className="mb-12 flex flex-col gap-4 border-t border-line pt-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Reveal direction="none">
                <span className="eyebrow">{t.relatedEyebrow}</span>
              </Reveal>
              <h2 className="mt-6 text-display-md font-medium text-primary">
                <SplitText text={t.relatedTitle} />
              </h2>
            </div>
            <Reveal delay={0.2}>
              <Link href="/#katalog" className="btn-ghost px-5 py-2.5 text-sm">
                {t.footerAllCakes}
              </Link>
            </Reveal>
          </div>

          <CatalogGrid products={related} />
        </section>
      )}

      <MobileOrderBar
        price={price}
        href={whatsappHref}
        label={t.orderWhatsapp}
        anchorId="bestellen"
      />

      <Footer />
    </main>
  );
}
