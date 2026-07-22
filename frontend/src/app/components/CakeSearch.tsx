'use client';

import { useSiteLang } from './LocaleProvider';
import { useSearch } from './SearchProvider';

/**
 * Hero search box. Filters the catalogue live via the shared search context;
 * submitting (Enter) scrolls down to the results.
 */
export default function CakeSearch({ className = '' }: { className?: string }) {
  const { t } = useSiteLang();
  const { query, setQuery } = useSearch();

  function scrollToCatalog() {
    document
      .getElementById('katalog')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        scrollToCatalog();
      }}
      className={`relative w-full max-w-md ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchPlaceholder}
        className="input-field pl-12 pr-11"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label={t.searchClear}
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-cream-200 hover:text-primary"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </form>
  );
}
