'use client';

import { useEffect, useState } from 'react';
import { ALLERGENS, COMMON_INGREDIENTS } from '@/lib/allergens';
import type { Product, ProductPayload } from '@/types/product';
import { useAdminLang } from './AdminLangProvider';
import ImageUpload from './ImageUpload';

const EMPTY: ProductPayload = {
  name: '',
  description: '',
  price: 0,
  images: [],
  ingredients: [],
  allergens: [],
  is_active: true,
};

export default function ProductForm({
  editing,
  onSubmit,
  onCancel,
  submitting,
}: {
  editing: Product | null;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}) {
  const { lang, t } = useAdminLang();
  const [form, setForm] = useState<ProductPayload>(EMPTY);
  const [customIngredient, setCustomIngredient] = useState('');

  // Fill the form when switching into edit mode, reset when leaving it.
  useEffect(() => {
    setForm(
      editing
        ? {
            name: editing.name,
            description: editing.description,
            price: editing.price,
            images: editing.images ?? [],
            ingredients: editing.ingredients ?? [],
            allergens: editing.allergens ?? [],
            is_active: editing.is_active,
          }
        : EMPTY,
    );
  }, [editing]);

  const toggle = (field: 'ingredients' | 'allergens', value: string) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));

  function addCustomIngredient() {
    const value = customIngredient.trim();
    if (!value || form.ingredients.includes(value)) return;
    setForm((prev) => ({ ...prev, ingredients: [...prev.ingredients, value] }));
    setCustomIngredient('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ ...form, price: Number(form.price) });
  }

  const customIngredients = form.ingredients.filter(
    (item) => !COMMON_INGREDIENTS.includes(item),
  );

  return (
    <form onSubmit={handleSubmit} className="card space-y-7 p-7">
      <div>
        <h2 className="text-xl font-semibold text-primary">
          {editing ? t.formEditTitle : t.formNewTitle}
        </h2>
        <p className="mt-1 text-sm text-muted">{t.formHint}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm text-muted">{t.fieldName}</span>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t.fieldNamePlaceholder}
            required
            minLength={2}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm text-muted">{t.fieldPrice}</span>
          <input
            className="input-field"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
        </label>

        <div className="sm:col-span-2">
          <ImageUpload
            value={form.images}
            onChange={(images) => setForm((prev) => ({ ...prev, images }))}
          />
        </div>

        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm text-muted">{t.fieldDescription}</span>
          <textarea
            className="input-field min-h-[110px] resize-y"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={t.fieldDescriptionPlaceholder}
          />
        </label>
      </div>

      {/* --- Ingredients --- */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-primary">
          {t.ingredients}
        </legend>

        <div className="flex flex-wrap gap-2">
          {COMMON_INGREDIENTS.map((item) => {
            const active = form.ingredients.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle('ingredients', item)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                  active
                    ? 'bg-chocolate-gradient text-cream-100 shadow-soft'
                    : 'bg-cream-200/70 text-chocolate-600 ring-1 ring-inset ring-cream-300 hover:bg-cream-300/70'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder={t.ownIngredient}
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomIngredient();
              }
            }}
          />
          <button
            type="button"
            className="btn-ghost shrink-0 px-5 py-3"
            onClick={addCustomIngredient}
          >
            {t.add}
          </button>
        </div>

        {customIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customIngredients.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggle('ingredients', item)}
                title={t.removeChip}
                className="rounded-full bg-caramel-gradient px-3.5 py-1.5 text-sm text-cream-50 shadow-soft"
              >
                {item} ✕
              </button>
            ))}
          </div>
        )}
      </fieldset>

      {/* --- Allergens --- */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-primary">
          {t.allergens}
        </legend>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map(({ key, label, labelEn, icon }) => {
            const active = form.allergens.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle('allergens', key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition ${
                  active
                    ? 'bg-caramel-500 text-cream-50 shadow-soft'
                    : 'bg-cream-200/70 text-chocolate-600 ring-1 ring-inset ring-cream-300 hover:bg-cream-300/70'
                }`}
              >
                <span aria-hidden>{icon}</span>
                {lang === 'en' ? labelEn : label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex items-center gap-3 rounded-2xl bg-cream-200/50 px-4 py-3">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          className="h-4 w-4 accent-[#452D19]"
        />
        <span className="text-sm text-muted">{t.visibleInCatalog}</span>
      </label>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? t.saving : editing ? t.update : t.create}
        </button>
        {editing && (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            {t.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
