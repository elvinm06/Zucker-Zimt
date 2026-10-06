import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/api';
import { getDictionary } from '@/lib/locale';
import { isSiteLang } from '@/lib/site-i18n';
import CatalogGrid from '../components/CatalogGrid';
import CatalogToolbar from '../components/CatalogToolbar';
import { SearchProvider } from '../components/SearchProvider';
import ContactCTA from '../components/ContactCTA';
import FeatureStrip from '../components/FeatureStrip';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Signature from '../components/Signature';
import IntroLoader from '../components/motion/IntroLoader';
import Reveal from '../components/motion/Reveal';
import SplitText from '../components/motion/SplitText';
import VelocityMarquee from '../components/motion/VelocityMarquee';

/**
 * Server Component — products are fetched on the server (better SEO and a
 * faster first paint); the interactive parts (grid, search, showcase) are
 * client children.
 *
 * The page is static and regenerated in the background (see `revalidate` in
 * `getProducts`). A failed fetch is deliberately not caught: the error aborts
 * the regeneration, so visitors keep getting the last good page while the
 * backend is down or waking up. Catching it would cache an empty catalogue
 * in place of the good page.
 */
export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  if (!isSiteLang(params.lang)) notFound();

  const t = getDictionary(params.lang);
  const products = await getProducts();

  return (
    <SearchProvider>
      <main className="min-h-screen">
        <IntroLoader />
        <Header />
        <Hero />
        <VelocityMarquee />
        <FeatureStrip />

        <section id="katalog" className="wrap py-20 sm:py-28">
          <div className="mb-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal direction="none">
                <span className="eyebrow">{t.catalogEyebrow}</span>
              </Reveal>
              <h2 className="mt-6 text-display-lg font-medium text-primary">
                <SplitText text={t.catalogTitle} />
              </h2>
            </div>
            <Reveal delay={0.2} className="lg:col-span-5">
              <p className="max-w-md text-pretty leading-relaxed text-muted lg:ml-auto">
                {t.catalogLead}
              </p>
            </Reveal>
          </div>

          <div className="mb-12">
            <CatalogToolbar products={products} />
          </div>
          <CatalogGrid products={products} />
        </section>

        <Signature products={products} />

        <HowItWorks />
        <ContactCTA />
        <Footer />
      </main>
    </SearchProvider>
  );
}
