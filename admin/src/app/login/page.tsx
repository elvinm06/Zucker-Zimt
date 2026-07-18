'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LogoMark from '../components/LogoMark';
import { adminApi, tokenStore } from '@/lib/api';
import { useAdminLang } from '../components/AdminLangProvider';
import LangSwitch from '../components/LangSwitch';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useAdminLang();
  const [brandName, setBrandName] = useState('Bakery');

  // GET /settings is public, so the brand name shows before signing in.
  useEffect(() => {
    adminApi
      .getSettings()
      .then((settings) => settings.name && setBrandName(settings.name))
      .catch(() => undefined);
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { access_token } = await adminApi.login(username, password);
      tokenStore.set(access_token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loginFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-cream-gradient px-5">
      <motion.div
        aria-hidden
        className="blob -left-24 top-0 h-96 w-96 bg-caramel-300/30"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="blob -right-20 bottom-0 h-96 w-96 bg-chocolate-300/25"
        animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute right-5 top-5 z-10">
        <LangSwitch />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="card relative w-full max-w-md space-y-6 p-9"
      >
        <div className="text-center">
          <motion.span
            initial={{ scale: 0.7, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
            className="mx-auto mb-5 block h-16 w-16 text-chocolate-500"
          >
            <LogoMark className="h-full w-full" />
          </motion.span>
          <h1 className="text-2xl font-semibold text-primary">
            {brandName}
          </h1>
          <p className="mt-2 text-sm text-muted">{t.loginSubtitle}</p>
        </div>

        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-sm text-muted">{t.username}</span>
            <input
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm text-muted">{t.password}</span>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {loading ? t.signingIn : t.signIn}
        </motion.button>
      </motion.form>
    </main>
  );
}
