import { appConfig } from '@/config/app.config';
import type { Product, ProductPayload } from '@/types/product';
import type { SiteSettings } from '@/types/settings';

const BASE = appConfig.api.baseUrl;
const TOKEN_KEY = 'bakery_admin_token';

/* -------------------------------------------------------------------------- */
/*  Token handling (browser only)                                             */
/* -------------------------------------------------------------------------- */

export const tokenStore = {
  get: () =>
    typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? `Anfrage fehlgeschlagen (${res.status})`);
    throw new ApiError(message, res.status);
  }

  return res.status === 204 ? (undefined as T) : res.json();
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Called from a Server Component. `revalidate: 60` means the catalogue is
 * refreshed at most once a minute instead of hitting the DB on every request.
 */
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new ApiError('Katalog konnte nicht geladen werden', res.status);
  }
  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new ApiError('Torte nicht gefunden', res.status);
  return res.json();
}

/**
 * Site settings (brand name, phone, social links). Cached like the catalogue
 * and flushed on demand when an admin saves changes.
 */
export async function getSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${BASE}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    // Backend down — callers fall back to the defaults in app.config.
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Admin API (requires a JWT)                                                */
/* -------------------------------------------------------------------------- */

/**
 * Asks Next.js to drop its cached catalogue after a change. Failures are
 * swallowed: the write already succeeded, and the cache expires on its own
 * within a minute anyway.
 */
async function revalidateCatalog() {
  const token = tokenStore.get();
  if (!token) return;

  await fetch('/api/revalidate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => undefined);
}

export const adminApi = {
  login: (username: string, password: string) =>
    request<{ access_token: string; user: { id: string; username: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ username, password }) },
    ),

  listProducts: () => request<Product[]>('/products/admin/all'),

  /**
   * Uploads an image and returns its public URL.
   * Content-Type is deliberately not set — the browser must add its own
   * multipart boundary, and overriding it breaks the upload.
   */
  uploadImage: async (file: File) => {
    const body = new FormData();
    body.append('file', file);

    const res = await fetch(`${BASE}/uploads`, {
      method: 'POST',
      headers: tokenStore.get()
        ? { Authorization: `Bearer ${tokenStore.get()}` }
        : undefined,
      body,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err?.message ?? 'Upload fehlgeschlagen', res.status);
    }

    return res.json() as Promise<{ url: string; filename: string }>;
  },

  createProduct: async (payload: ProductPayload) => {
    const product = await request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await revalidateCatalog();
    return product;
  },

  updateProduct: async (id: string, payload: Partial<ProductPayload>) => {
    const product = await request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await revalidateCatalog();
    return product;
  },

  getSettings: () => request<SiteSettings>('/settings'),

  updateSettings: async (payload: Partial<SiteSettings>) => {
    const settings = await request<SiteSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await revalidateCatalog();
    return settings;
  },

  deleteProduct: async (id: string) => {
    const result = await request<{ deleted: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
    await revalidateCatalog();
    return result;
  },
};
