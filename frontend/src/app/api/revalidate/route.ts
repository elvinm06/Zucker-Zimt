import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { appConfig } from '@/config/app.config';

/**
 * Clears the cached catalogue after an admin change.
 *
 * Without this, a new cake would only appear once the 60s ISR window in
 * `getProducts` expired. The admin panel — which now runs as a separate app
 * on its own origin — calls this after every create/update/delete.
 *
 * Authorisation is delegated to the backend: the caller's token is forwarded
 * to /auth/me, so only a signed-in admin can flush the cache.
 */
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN ?? 'http://localhost:3002';

function corsHeaders(origin: string | null) {
  // Echo the origin only when it is the configured admin panel.
  const allowed = origin === ADMIN_ORIGIN ? origin : ADMIN_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin')),
  });
}

export async function POST(request: Request) {
  const headers = corsHeaders(request.headers.get('origin'));
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return NextResponse.json({ revalidated: false }, { status: 401, headers });
  }

  const verify = await fetch(`${appConfig.api.baseUrl}/auth/me`, {
    headers: { Authorization: authorization },
    cache: 'no-store',
  }).catch(() => null);

  if (!verify?.ok) {
    return NextResponse.json({ revalidated: false }, { status: 401, headers });
  }

  // Home page (catalogue) and every product detail page.
  revalidatePath('/');
  revalidatePath('/torte/[id]', 'page');

  return NextResponse.json({ revalidated: true }, { headers });
}
