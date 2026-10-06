import { notFound } from 'next/navigation';

/**
 * Catches every address no other route matches, so the 404 page renders
 * inside the `[lang]` layout — in the visitor's language, with the header.
 */
export default function CatchAll() {
  notFound();
}
