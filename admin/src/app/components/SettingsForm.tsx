'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import type { SiteSettings } from '@/types/settings';
import { useAdminLang } from './AdminLangProvider';

const EMPTY: SiteSettings = {
  name: '',
  tagline: '',
  whatsapp: '',
  telegram: '',
  instagram: '',
  phone: '',
  address: '',
  hours: '',
};

export default function SettingsForm() {
  const { t } = useAdminLang();
  const [form, setForm] = useState<SiteSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SiteSettings, string>>
  >({});

  const load = useCallback(async () => {
    try {
      const settings = await adminApi.getSettings();
      setForm({
        name: settings.name ?? '',
        tagline: settings.tagline ?? '',
        whatsapp: settings.whatsapp ?? '',
        telegram: settings.telegram ?? '',
        instagram: settings.instagram ?? '',
        phone: settings.phone ?? '',
        address: settings.address ?? '',
        hours: settings.hours ?? '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Checked in the browser so the message is in the panel's language —
   * the backend enforces the same rules but answers in German only.
   */
  function validate() {
    const errors: Partial<Record<keyof SiteSettings, string>> = {};
    if (form.whatsapp && !/^[0-9]+$/.test(form.whatsapp)) {
      errors.whatsapp = t.settingsWhatsappError;
    }
    if (form.telegram && !/^[A-Za-z0-9_]+$/.test(form.telegram)) {
      errors.telegram = t.settingsTelegramError;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    if (!validate()) return;
    setSaving(true);
    try {
      await adminApi.updateSettings(form);
      setSaved(true);
      // The confirmation is transient; it should not linger on screen.
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  const field = (
    key: keyof SiteSettings,
    label: string,
    props: { placeholder?: string; hint?: string; wide?: boolean } = {},
  ) => (
    <label className={`space-y-1.5 ${props.wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-sm text-muted">{label}</span>
      <input
        className={`input-field ${
          fieldErrors[key] ? 'border-red-300 focus:ring-red-200' : ''
        }`}
        value={form[key]}
        placeholder={props.placeholder}
        onChange={(e) => {
          setForm({ ...form, [key]: e.target.value });
          // Drop the stale message as soon as the field is edited.
          setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
          setError(null);
        }}
      />
      {fieldErrors[key] ? (
        <span className="block text-xs text-red-700">{fieldErrors[key]}</span>
      ) : (
        props.hint && (
          <span className="block text-xs text-muted/80">{props.hint}</span>
        )
      )}
    </label>
  );

  if (loading) {
    return <div className="card p-7 text-muted">{t.loading}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 p-7">
      <div>
        <h2 className="text-xl font-semibold text-primary">
          {t.settingsTitle}
        </h2>
        <p className="mt-1 text-sm text-muted">{t.settingsHint}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {field('name', t.settingsName, { placeholder: 'Zucker & Zimt' })}
        {field('phone', t.settingsPhone, { placeholder: '+49 151 1234 5678' })}
        {field('tagline', t.settingsTagline, { wide: true })}
        {field('whatsapp', t.settingsWhatsapp, {
          placeholder: '4915112345678',
          hint: t.settingsWhatsappHint,
        })}
        {field('telegram', t.settingsTelegram, {
          placeholder: 'zuckerundzimt',
          hint: t.settingsTelegramHint,
        })}
        {field('instagram', t.settingsInstagram, {
          placeholder: 'https://instagram.com/…',
          wide: true,
        })}
        {field('address', t.settingsAddress, { wide: true })}
        {field('hours', t.settingsHours, {
          placeholder: 'Mo–Sa, 09:00 – 19:00 Uhr',
          wide: true,
        })}
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <motion.button
          type="submit"
          className="btn-primary"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? t.saving : t.settingsSave}
        </motion.button>

        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-green-700"
          >
            ✓ {t.settingsSaved}
          </motion.span>
        )}
      </div>
    </form>
  );
}
