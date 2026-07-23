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
  const [customAllergen, setCustomAllergen] = useState('');
  // Price is kept as raw text so the field can be empty and accept a comma or
  // dot; it is parsed to a number only on submit. Binding a number directly
  // forces a "0" that can't be cleared and rejects the comma separator.
  const [priceInput, setPriceInput] = useState('');

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
    // Show the existing price with the locale's decimal separator.
    setPriceInput(
      editing ? String(editing.price).replace('.', lang === 'de' ? ',' : '.') : '',
    );
  }, [editing, lang]);

  const toggle = (field: 'ingredients' | 'allergens', value: string) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));

  const rename = (
    field: 'ingredients' | 'allergens',
    item: string,
    next: string,
  ) =>
    setForm((prev) => ({
      ...prev,
      // Renaming onto an existing entry would create a duplicate, so the old
      // one is dropped instead.
      [field]: prev[field].includes(next)
        ? prev[field].filter((v) => v !== item)
        : prev[field].map((v) => (v === item ? next : v)),
    }));

  function addCustomIngredient() {
    const value = customIngredient.trim();
    if (!value || form.ingredients.includes(value)) return;
    setForm((prev) => ({ ...prev, ingredients: [...prev.ingredients, value] }));
    setCustomIngredient('');
  }

  function addCustomAllergen() {
    const value = customAllergen.trim();
    if (!value || form.allergens.includes(value)) return;
    setForm((prev) => ({ ...prev, allergens: [...prev.allergens, value] }));
    setCustomAllergen('');
  }

  // Accept both "48,5" and "48.5"; empty or a lone separator is not a price.
  const parsedPrice = Number(priceInput.replace(',', '.'));
  const priceValid = priceInput.trim() !== '' && Number.isFinite(parsedPrice);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!priceValid) return;
    await onSubmit({ ...form, price: parsedPrice });
  }

  const customIngredients = form.ingredients.filter(
    (item) => !COMMON_INGREDIENTS.includes(item),
  );

  // Free-text entries live in the same array as the predefined keys; anything
  // that is not a known key is a custom allergen.
  const customAllergens = form.allergens.filter(
    (item) => !ALLERGENS.some(({ key }) => key === item),
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
            type="text"
            inputMode="decimal"
            value={priceInput}
            onChange={(e) => {
              const v = e.target.value;
              // Allow only digits and a single comma/dot separator.
              if (/^[0-9]*[.,]?[0-9]*$/.test(v)) setPriceInput(v);
            }}
            placeholder={lang === 'de' ? '0,00' : '0.00'}
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

        <EditableChips
          items={customIngredients}
          onRename={(item, next) => rename('ingredients', item, next)}
          onRemove={(item) => toggle('ingredients', item)}
        />
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

        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder={t.ownAllergen}
            value={customAllergen}
            onChange={(e) => setCustomAllergen(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomAllergen();
              }
            }}
          />
          <button
            type="button"
            className="btn-ghost shrink-0 px-5 py-3"
            onClick={addCustomAllergen}
          >
            {t.add}
          </button>
        </div>

        <EditableChips
          items={customAllergens}
          onRename={(item, next) => rename('allergens', item, next)}
          onRemove={(item) => toggle('allergens', item)}
        />
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
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || !priceValid}
        >
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

/**
 * Custom (free-text) entries as chips: the text opens an inline input to
 * rename the entry, the ✕ removes it.
 */
function EditableChips({
  items,
  onRename,
  onRemove,
}: {
  items: string[];
  onRename: (item: string, next: string) => void;
  onRemove: (item: string) => void;
}) {
  const { t } = useAdminLang();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  function commit() {
    if (editing === null) return;
    const value = draft.trim();
    // An emptied chip is treated as a cancel, not a delete — the ✕ deletes.
    if (value && value !== editing) onRename(editing, value);
    setEditing(null);
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) =>
        editing === item ? (
          <input
            key={item}
            autoFocus
            onFocus={(e) => e.target.select()}
            className="w-40 rounded-full border border-accent bg-cream-50 px-3.5 py-1.5 text-sm text-chocolate-600 outline-none ring-4 ring-accent/15"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commit();
              }
              if (e.key === 'Escape') setEditing(null);
            }}
          />
        ) : (
          <span
            key={item}
            className="inline-flex items-stretch overflow-hidden rounded-full bg-caramel-gradient text-sm text-cream-50 shadow-soft"
          >
            <button
              type="button"
              title={t.edit}
              onClick={() => {
                setEditing(item);
                setDraft(item);
              }}
              className="py-1.5 pl-3.5 pr-1.5 transition hover:bg-white/15"
            >
              {item}
            </button>
            <button
              type="button"
              title={t.removeChip}
              onClick={() => onRemove(item)}
              className="py-1.5 pl-1.5 pr-3 transition hover:bg-white/15"
              aria-label={`${t.removeChip}: ${item}`}
            >
              ✕
            </button>
          </span>
        ),
      )}
    </div>
  );
}
