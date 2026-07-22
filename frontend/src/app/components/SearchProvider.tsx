'use client';

import { createContext, useContext, useState } from 'react';

/**
 * Shares the cake-search query between the hero search box and the catalogue
 * grid, which live in separate components on the home page.
 */
type SearchContext = {
  query: string;
  setQuery: (value: string) => void;
};

const Ctx = createContext<SearchContext>({ query: '', setQuery: () => {} });

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  return <Ctx.Provider value={{ query, setQuery }}>{children}</Ctx.Provider>;
}

export const useSearch = () => useContext(Ctx);
