import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Where uploaded files are stored.
 *
 * On an ephemeral host (Render, Railway, Fly without a volume) the default
 * project-relative folder is WIPED on every deploy/restart — the DB keeps the
 * image URL but the file 404s. Point UPLOADS_DIR at a mounted persistent disk
 * (e.g. Render Disk at /var/data/uploads) so uploads survive redeploys.
 */
export const UPLOADS_DIR =
  process.env.UPLOADS_DIR?.trim() || join(process.cwd(), 'uploads');

export const ensureUploadsDir = () => {
  if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
};

/**
 * Absolute URL of a stored file. The frontend renders it with next/image,
 * which needs a full origin — a relative path would resolve against the
 * Next.js host instead of the API.
 *
 * `origin` is derived from the incoming request (protocol + host) so the URL
 * is always correct for however the client actually reached the API — behind
 * an HTTPS proxy (Vercel, Render, Railway) it yields the public https origin,
 * locally it yields http://localhost:4000. This is preferred over PUBLIC_URL
 * because a stale or http PUBLIC_URL produces links that are unreachable
 * (localhost) or blocked as mixed content on an https site. PUBLIC_URL stays
 * as an explicit override for setups that serve uploads from a separate host.
 */
export const publicUrlFor = (filename: string, origin?: string) => {
  const base = (origin || process.env.PUBLIC_URL || 'http://localhost:4000')
    .trim()
    .replace(/\/$/, '');
  return `${base}/uploads/${filename}`;
};

/* -------------------------------------------------------------------------- */
/*  Cloudinary                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Cloudinary is the persistent, CDN-backed store for production. It is used
 * whenever it is configured (a single CLOUDINARY_URL env var —
 * `cloudinary://<key>:<secret>@<cloud>` — is enough); otherwise uploads fall
 * back to local disk, which is fine for development.
 */
export const isCloudinaryEnabled = () =>
  Boolean(process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME);

let cloudinaryReady = false;
function cloudinaryClient() {
  if (!cloudinaryReady) {
    // With no args the SDK reads CLOUDINARY_URL from the environment;
    // secure:true forces https delivery URLs (no mixed content on an https site).
    cloudinary.config({ secure: true });
    cloudinaryReady = true;
  }
  return cloudinary;
}

/**
 * Uploads a file buffer to Cloudinary and resolves to its https delivery URL.
 * `publicId` is the stored name (no extension); Cloudinary infers the format.
 */
export function uploadToCloudinary(
  buffer: Buffer,
  publicId: string,
): Promise<string> {
  const cld = cloudinaryClient();
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder: 'bakery',
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Cloudinary-Upload fehlgeschlagen'));
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
