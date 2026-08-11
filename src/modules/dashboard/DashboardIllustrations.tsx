/**
 * Decorative inline SVGs for the dashboard. They are `aria-hidden` on purpose —
 * every one of them sits beside text that already carries the meaning.
 */

export function CareIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* soft backdrop */}
      <ellipse
        cx="168"
        cy="108"
        rx="142"
        ry="82"
        className="fill-primary opacity-10"
      />
      <circle
        cx="52"
        cy="46"
        r="26"
        className="fill-none stroke-(--color-primary) opacity-25"
        strokeWidth="2"
      />

      {/* patient record card */}
      <g transform="rotate(-6 100 100)">
        <rect
          x="42"
          y="40"
          width="118"
          height="126"
          rx="14"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        <circle cx="70" cy="70" r="13" className="fill-primary opacity-30" />
        <rect
          x="91"
          y="63"
          width="52"
          height="7"
          rx="3.5"
          className="fill-foreground opacity-25"
        />
        <rect
          x="91"
          y="76"
          width="32"
          height="6"
          rx="3"
          className="fill-foreground opacity-15"
        />
        <rect
          x="60"
          y="102"
          width="84"
          height="7"
          rx="3.5"
          className="fill-foreground opacity-12"
        />
        <rect
          x="60"
          y="119"
          width="64"
          height="7"
          rx="3.5"
          className="fill-foreground opacity-12"
        />
        <rect
          x="60"
          y="136"
          width="76"
          height="7"
          rx="3.5"
          className="fill-foreground opacity-12"
        />
      </g>

      {/* vitals card with a pulse trace */}
      <g transform="rotate(4 216 132)">
        <rect
          x="152"
          y="96"
          width="132"
          height="72"
          rx="14"
          className="fill-card stroke-border"
          strokeWidth="1.5"
        />
        <path
          d="M164 138 h26 l10-22 12 40 11-26 8 8h41"
          className="fill-none stroke-(--color-primary-dark)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* care badge */}
      <g transform="translate(246 56)">
        <circle r="27" className="fill-primary" />
        <path
          d="M0 8 C-9 1 -11-6 -5.5-9.5 C-2.4-11.4 0-9.4 0-7 C0-9.4 2.4-11.4 5.5-9.5 C11-6 9 1 0 8 Z"
          className="fill-white"
        />
      </g>

      {/* floating accents */}
      <g
        className="stroke-(--color-primary-dark) opacity-40"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M296 96 h10 M301 91 v10" />
        <path d="M22 128 h8 M26 124 v8" />
      </g>
      <circle cx="188" cy="34" r="4" className="fill-primary" />
      <circle cx="300" cy="176" r="5" className="fill-primary opacity-50" />
    </svg>
  );
}

export function EmptyStateIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 112"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="80"
        cy="96"
        rx="56"
        ry="9"
        className="fill-foreground opacity-6"
      />
      <rect
        x="42"
        y="16"
        width="76"
        height="74"
        rx="10"
        className="fill-card stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="64"
        y="9"
        width="32"
        height="14"
        rx="5"
        className="fill-muted stroke-border"
        strokeWidth="1.5"
      />
      <g className="fill-foreground opacity-12">
        <rect x="56" y="40" width="48" height="6" rx="3" />
        <rect x="56" y="54" width="34" height="6" rx="3" />
        <rect x="56" y="68" width="42" height="6" rx="3" />
      </g>
      <circle
        cx="116"
        cy="72"
        r="17"
        className="fill-card stroke-(--color-primary)"
        strokeWidth="2.5"
      />
      <path
        d="M128 84 l10 10"
        className="stroke-(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
