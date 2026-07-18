/**
 * Brand mark: an open ring around a cake slice with two cream layers,
 * a swirl on top and two leaves.
 *
 * The cream gaps are cut with a mask instead of being painted in the
 * background colour, so they stay transparent on any surface. Shapes use
 * `currentColor`, so the mark inherits the surrounding text colour.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden className={className}>
      <defs>
        <mask id="zz-cake-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <rect width="200" height="200" fill="white" />
          {/* cream filling between the sponge layers */}
          <path d="M28 112 L176 128" stroke="black" strokeWidth="6" />
          <path d="M28 138 L176 154" stroke="black" strokeWidth="6" />
          {/* separation between swirl and cake */}
          <path d="M76 74 L126 74" stroke="black" strokeWidth="4" />
        </mask>
      </defs>

      {/* Open ring — the gap sits on the right. */}
      <path
        d="M167.5 61 A78 78 0 1 0 170.7 133"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.85"
      />

      <g fill="currentColor" mask="url(#zz-cake-cut)">
        {/* slice: peaked roof, rounded bottom */}
        <path d="M45.2 94.4 L84 72 L122 72 L155.5 98.2 A56 56 0 1 1 45.2 94.4 Z" />
        {/* swirl */}
        <path d="M82 76 Q82 51 102 49 Q122 51 122 76 Z" />
        <path d="M101 51 Q95 32 112 21 Q121 34 113 46 Q107 53 101 51 Z" />
      </g>

      {/* Leaves sit outside the mask — no filling lines should cross them. */}
      <g fill="currentColor">
        <path d="M127 67 Q133 47 155 43 Q148 63 127 67 Z" opacity="0.92" />
        <path d="M130 75 Q145 63 165 67 Q150 82 130 75 Z" opacity="0.78" />
      </g>
    </svg>
  );
}
