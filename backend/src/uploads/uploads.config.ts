import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Uploads live next to the project root (not inside dist/), so a rebuild
 * never wipes them.
 */
export const UPLOADS_DIR = join(process.cwd(), 'uploads');

export const ensureUploadsDir = () => {
  if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
};

/**
 * Absolute URL of a stored file. The frontend renders it with next/image,
 * which needs a full origin — a relative path would resolve against the
 * Next.js host instead of the API.
 */
export const publicUrlFor = (filename: string) => {
  const base = (process.env.PUBLIC_URL ?? 'http://localhost:4000').replace(
    /\/$/,
    '',
  );
  return `${base}/uploads/${filename}`;
};
