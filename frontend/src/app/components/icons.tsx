import type { ComponentType, SVGProps } from 'react';

/**
 * Inline line icons on a 24×24 grid (Lucide-style geometry, 1.6 stroke).
 * They inherit `currentColor`, so each context sets the colour through
 * its text colour. No emoji anywhere in the UI — these scale crisply and
 * stay on-palette.
 */
export type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, className, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ----------------------------- Navigation -------------------------------- */

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);

export const ArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </Svg>
);

export const ArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </Svg>
);

export const ArrowUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </Svg>
);

export const ChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);

export const ChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);

export const Search = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

/* ------------------------------- Contact --------------------------------- */

export const Phone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

export const MapPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Svg>
);

export const MessageCircle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </Svg>
);

export const Instagram = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <path d="M17.5 6.5h.01" />
  </Svg>
);

/* -------------------------------- Values --------------------------------- */

export const ChefHat = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <path d="M6 17h12" />
  </Svg>
);

export const Leaf = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </Svg>
);

export const Cake = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
    <path d="M2 21h20" />
    <path d="M7 8v3" />
    <path d="M12 8v3" />
    <path d="M17 8v3" />
    <path d="M7 4h.01" />
    <path d="M12 4h.01" />
    <path d="M17 4h.01" />
  </Svg>
);

export const Sparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.94 15.5a2 2 0 0 0-1.44-1.44L2.37 12.48a.5.5 0 0 1 0-.96L8.5 9.94a2 2 0 0 0 1.44-1.44l1.58-6.13a.5.5 0 0 1 .96 0l1.58 6.13a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0Z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
  </Svg>
);

/* ------------------------------ Allergens -------------------------------- */

export const Wheat = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 22 16 8" />
    <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
    <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
    <path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    <path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
    <path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
  </Svg>
);

export const Milk = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 2h8" />
    <path d="M9 2v2.79a4 4 0 0 1-.67 2.22l-.66.98A4 4 0 0 0 7 10.21V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.79a4 4 0 0 0-.67-2.22l-.66-.98A4 4 0 0 1 15 4.79V2" />
    <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
  </Svg>
);

export const Egg = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z" />
  </Svg>
);

export const Nut = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4V2" />
    <path d="M5 10v4a7 7 0 0 0 5.28 6.79c.41.1.8.29 1.1.59L12 22l.62-.62c.3-.3.69-.49 1.1-.59A7 7 0 0 0 19 14v-4" />
    <path d="M12 4C8 4 4.5 6 4 8c-.24.97-.92 1.95-2 3 1.31-.08 1.97-.29 3-1 .54.92.98 1.36 2 2 1.45-.65 1.95-1.1 2.5-2 .6 1 1.15 1.43 2.5 2 1.31-.62 1.86-1.06 2.5-2 .63.98 1.16 1.42 2.5 2 1.21-.55 1.68-.97 2-2 1.03.92 1.68 1.16 3 1-1.3-1.04-1.76-2.03-2-3-.5-2-4-4-8-4Z" />
  </Svg>
);

export const Peanut = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.2 3.2a4.2 4.2 0 0 0-2.6 7.3c.9.8 1.3 1.6 1.2 2.7a4.6 4.6 0 1 0 6.3 6.3c-.1-1.1.3-1.9 1.2-2.7a4.2 4.2 0 0 0-2.6-7.3c-1 0-1.8-.3-2.4-1.1-.3-.4-.7-.5-1.1-.5Z" />
    <path d="M9 8h.01" />
    <path d="M14 16h.01" />
  </Svg>
);

export const Bean = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16.5 3.5c-3 0-5.5 2.5-6.5 6-.8 2.7-2.3 4.5-5.5 5.5A4.5 4.5 0 1 0 9 20.5c1-3.2 2.8-4.7 5.5-5.5 3.5-1 6-3.5 6-6.5a4.5 4.5 0 0 0-4-5Z" />
  </Svg>
);

export const Sesame = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c-2 2.5-2 5.5 0 8 2-2.5 2-5.5 0-8Z" />
    <path d="M6 13c-.5 3 1 5.5 4 7-.1-3.2-1.4-5.4-4-7Z" />
    <path d="M18 13c.5 3-1 5.5-4 7 .1-3.2 1.4-5.4 4-7Z" />
  </Svg>
);

export const Cocoa = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.5c-4 0-6.5 4-6.5 9.5s2.5 9.5 6.5 9.5 6.5-4 6.5-9.5S16 2.5 12 2.5Z" />
    <path d="M12 2.5v19" />
    <path d="M8 6c1.5 1 2.5 1 4 0s2.5-1 4 0" />
    <path d="M8 18c1.5-1 2.5-1 4 0s2.5 1 4 0" />
  </Svg>
);

export const Droplet = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </Svg>
);

export const Wine = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 22h8" />
    <path d="M7 10h10" />
    <path d="M12 15v7" />
    <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" />
  </Svg>
);

export const Alert = (p: IconProps) => (
  <Svg {...p}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </Svg>
);

const ALLERGEN_ICONS: Record<string, ComponentType<IconProps>> = {
  gluten: Wheat,
  lactose: Milk,
  egg: Egg,
  nuts: Nut,
  peanut: Peanut,
  soy: Bean,
  sesame: Sesame,
  cocoa: Cocoa,
  honey: Droplet,
  alcohol: Wine,
};

/** Line icon for an allergen key; unknown keys get a warning triangle. */
export function AllergenIcon({
  allergen,
  className,
}: {
  allergen: string;
  className?: string;
}) {
  const Icon = ALLERGEN_ICONS[allergen] ?? Alert;
  return <Icon className={className} />;
}
