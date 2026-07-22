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
import { getProduct, getProducts, getSettings } from '@/lib/api';
import { getDictionary, getLocale } from '@/lib/locale';
import type { Product } from '@/types/product';
import AllergenBadge from '@/app/components/AllergenBadge';
import { FALLBACK_SETTINGS } from '@/config/fallback-settings';
import CatalogGrid from '@/app/components/CatalogGrid';
import FadeIn from '@/app/components/FadeIn';
import ProductGallery from '@/app/components/ProductGallery';
import Reveal from '@/app/components/motion/Reveal';
import SplitText from '@/app/components/motion/SplitText';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';

/** Returns null instead of throwing, so a missing id renders the 404 page. */
async function loadProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProduct(id);
    // Hidden products must not be reachable through a direct link either.
    return product.is_active ? product : null;
  } catch {
    return null;
  }
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
  params: { id: string };
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
  const t = getDictionary();
  const lang = getLocale();

  // Suggestions at the bottom; failure here must not break the page.
  const related = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen">
      <Header />

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-8 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/#katalog"
          className="btn-ghost w-fit px-5 py-2.5 text-sm"
          aria-label={t.backToOverview}
        >
          {t.backToOverview}
        </Link>

        <nav aria-label="Brotkrümelnavigation" className="text-sm text-muted">
          <Link href="/" className="transition hover:text-primary">
            {t.breadcrumbHome}
          </Link>
          <span className="mx-2 text-cream-500">/</span>
          <Link href="/#katalog" className="transition hover:text-primary">
            {t.breadcrumbCakes}
          </Link>
          <span className="mx-2 text-cream-500">/</span>
          <span className="text-primary">{product.name}</span>
        </nav>
      </div>

      <article className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 lg:grid-cols-2 lg:gap-14">
        {/* --- Image --- */}
        <ProductGallery images={product.images ?? []} name={product.name} />

        {/* --- Details --- */}
        <FadeIn delay={0.1} className="space-y-8">
          <div>
            <span className="eyebrow">{t.productEyebrow}</span>
            <h1 className="mt-5 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              <SplitText text={product.name} trigger="mount" delay={0.2} />
            </h1>
            <p className="mt-4 font-display text-3xl font-semibold text-accent">
              {formatPrice(product.price)}
            </p>
          </div>

          {product.description && (
            <p className="text-lg leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          {product.ingredients?.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs uppercase tracking-[0.18em] text-chocolate-400">
                {t.ingredients}
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {product.allergens?.length > 0 && (
            <section className="rounded-3xl bg-caramel-300/10 p-6 ring-1 ring-inset ring-caramel-400/25">
              <h2 className="mb-3 text-xs uppercase tracking-[0.18em] text-chocolate-500">
                {t.allergens}
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen) => (
                  <AllergenBadge key={allergen} allergen={allergen} />
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                {t.allergenNote}
              </p>
            </section>
          )}

          {/* Order buttons — the message text is built from the product name. */}
          <section className="space-y-3 rounded-3xl border border-cream-300/80 bg-cream-100/70 p-6">
            <h2 className="font-display text-lg font-semibold text-primary">
              {t.orderTitle}
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              {t.orderText}
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a
                href={buildWhatsAppLink(settings, product.name, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-medium text-[#0B3B22] shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                {t.orderWhatsapp}
              </a>
              <a
                href={buildTelegramLink(settings, product.name, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#229ED9] px-7 py-3.5 font-medium text-cream-50 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                {t.orderTelegram}
              </a>
            </div>

            <p className="pt-1 text-xs leading-relaxed text-muted">
              {t.messagePreview(orderMessageTemplate(settings, product.name, lang))}
            </p>
          </section>

          <Link
            href="/#katalog"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
          >
            {t.backToOverview}
          </Link>
        </FadeIn>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="mb-10 text-center">
            <Reveal direction="none">
              <span className="eyebrow">{t.relatedEyebrow}</span>
            </Reveal>
            <h2 className="mt-5 text-2xl font-semibold text-primary sm:text-3xl">
              <SplitText text={t.relatedTitle} />
            </h2>
          </div>

          <CatalogGrid products={related} />
        </section>
      )}

      <Footer />
    </main>
  );
}
