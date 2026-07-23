import { config } from './config';
import type { Product, ProductPayload } from '@/types/product';
import type { SiteSettings } from '@/types/settings';

const BASE = config.apiUrl;
const TOKEN_KEY = 'bakery_admin_token';

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

/**
 * Tells the storefront to drop its cached catalogue. It runs on a different
 * origin now, so this is a cross-origin call; failures are ignored because
 * the write itself already succeeded and the cache expires within a minute.
 */
async function revalidateSite() {
  const token = tokenStore.get();
  if (!token) return;

  await fetch(`${config.siteUrl}/api/revalidate`, {
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

  // Public endpoint, but it also returns hidden products — enough for editing.
  getProduct: (id: string) => request<Product>(`/products/${id}`),

  /**
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
    await revalidateSite();
    return product;
  },

  updateProduct: async (id: string, payload: Partial<ProductPayload>) => {
    const product = await request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await revalidateSite();
    return product;
  },

  deleteProduct: async (id: string) => {
    const result = await request<{ deleted: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
    await revalidateSite();
    return result;
  },

  getSettings: () => request<SiteSettings>('/settings'),

  updateSettings: async (payload: Partial<SiteSettings>) => {
    const settings = await request<SiteSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await revalidateSite();
    return settings;
  },
};
