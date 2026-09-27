'use client';

import { scrollToTarget } from '@/lib/scroll';
import { Close, Search } from './icons';
import { useSiteLang } from './LocaleProvider';
import { useSearch } from './SearchProvider';

/**
 * Catalogue search box. Filters the grid live via the shared search
 * context; submitting (Enter) glides to the results.
 */
export default function CakeSearch({ className = '' }: { className?: string }) {
  const { t } = useSiteLang();
  const { query, setQuery } = useSearch();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        scrollToTarget('#katalog', { offset: -80 });
      }}
      className={`relative w-full ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted"
      >
        <Search className="h-[18px] w-[18px]" />
      </span>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchPlaceholder}
        className="input-field pl-12 pr-12"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label={t.searchClear}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-cream-200 hover:text-primary"
        >
          <Close className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
