'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { useAdminLang } from './AdminLangProvider';

const MAX_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES = 5;

/**
 * Multi-image drop zone. Uploads each picked file immediately and reports the
 * resulting URL list upward — the parent form only ever handles strings.
 * The first entry is the cover, so order matters.
 */
export default function ImageUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const { t } = useAdminLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_IMAGES - value.length;

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);

    const files = Array.from(fileList);
    if (files.length > remaining) {
      setError(t.imagesLimit(MAX_IMAGES));
      files.length = remaining;
    }

    const accepted = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError(t.imageInvalid);
        return false;
      }
      if (file.size > MAX_BYTES) {
        setError(t.imageTooLarge);
        return false;
      }
      return true;
    });
    if (!accepted.length) return;

    setUploading(true);
    try {
      // Sequential rather than parallel: uploads stay ordered, and a slow
      // connection is not flooded with five concurrent requests.
      const urls: string[] = [];
      for (const file of accepted) {
        const { url } = await adminApi.uploadImage(file);
        urls.push(url);
      }
      onChange([...value, ...urls].slice(0, MAX_IMAGES));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.imageFailed);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const removeAt = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  /** Promotes an image to position 0, which makes it the catalogue cover. */
  const makeCover = (index: number) => {
    const next = [...value];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{t.fieldImages}</span>
        <span className="text-xs text-muted">
          {value.length} / {MAX_IMAGES}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <AnimatePresence mode="popLayout">
            {value.map((url, index) => (
              <motion.div
                key={url}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative aspect-square overflow-hidden rounded-xl border bg-cream-200 ${
                  index === 0 ? 'border-accent ring-2 ring-accent/30' : 'border-cream-300'
                }`}
              >
                <Image src={url} alt="" fill sizes="140px" className="object-cover" />

                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-cream-50">
                    {t.cover}
                  </span>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-chocolate-900/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(index)}
                      className="rounded-full bg-cream-50/95 px-2.5 py-1 text-[10px] font-medium text-primary"
                    >
                      {t.makeCover}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded-full bg-red-50/95 px-2.5 py-1 text-[10px] font-medium text-red-700"
                  >
                    {t.imageRemove}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {remaining > 0 && (
        <motion.button
          layout
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          disabled={uploading}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors duration-300 ${
            value.length === 0 ? 'aspect-[4/3]' : 'py-8'
          } ${
            dragging
              ? 'border-accent bg-caramel-300/15'
              : 'border-cream-300 bg-cream-100/60 hover:border-accent/60 hover:bg-cream-200/60'
          }`}
        >
          {uploading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-2xl"
              >
                🍥
              </motion.span>
              <span className="text-sm text-muted">{t.imageUploading}</span>
            </>
          ) : (
            <>
              <span className="text-3xl">🖼️</span>
              <span className="text-sm font-medium text-primary">
                {t.imageDrop}
              </span>
              <span className="text-xs text-muted">
                {t.imageHint} · {t.imagesRemaining(remaining)}
              </span>
            </>
          )}
        </motion.button>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
