import type { IconName } from "../_data/content";

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Industry glyphs. Larger, more illustrative than the module icons. */
export function AerospaceIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 2.5c1.9 2.3 2.9 5 2.9 8.1v2.3l4.4 2.9v2.4l-4.6-1.5-.5 3.4 1.8 1.5v1l-4-1.2-4 1.2v-1l1.8-1.5-.5-3.4-4.6 1.5v-2.4l4.4-2.9v-2.3c0-3.1 1-5.8 2.9-8.1Z" />
      <circle cx="12" cy="9" r="1.1" />
    </svg>
  );
}

export function PrecisionIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 2v3.2M12 18.8V22M22 12h-3.2M5.2 12H2M19.07 4.93l-2.26 2.26M7.19 16.81l-2.26 2.26M19.07 19.07l-2.26-2.26M7.19 7.19 4.93 4.93" />
    </svg>
  );
}

export function ItIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <path d="M8.5 20.5h7M12 16.5v4M9 8.7 7 10.9l2 2.2M15 8.7l2 2.2-2 2.2M13.2 8.2l-2.4 5.6" />
    </svg>
  );
}

const MODULE_ICONS: Record<IconName, React.ReactNode> = {
  layers: (
    <>
      <path d="m12 2.8 8.5 4.4-8.5 4.4-8.5-4.4L12 2.8Z" />
      <path d="m3.5 12 8.5 4.4 8.5-4.4M3.5 16.6l8.5 4.4 8.5-4.4" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 3.5v15a2 2 0 0 0 2 2h15" />
      <path d="M7.5 15.5v2M11.5 11v6.5M15.5 13.5v4M19.5 7.5v10" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 20.2a6.2 6.2 0 0 1 12.4 0" />
      <path d="M16.2 5.2a3.2 3.2 0 0 1 0 5.9M18 14.6a6.2 6.2 0 0 1 3.2 5.6" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 12.6a7.6 7.6 0 0 1-10.9 6.9L4 20.8l1.4-5.3A7.6 7.6 0 1 1 20.5 12.6Z" />
      <path d="M9 11.5h6M9 14.8h3.6" />
    </>
  ),
  machine: (
    <>
      <rect x="2.6" y="9.5" width="12.4" height="11" rx="1.6" />
      <path d="M15 13.2h3.2a2.8 2.8 0 0 1 2.8 2.8v4.5M6.4 9.5V5.2a2 2 0 0 1 2-2h2.6" />
      <path d="M6.6 14h4.2M6.6 17h2.4" />
    </>
  ),
  box: (
    <>
      <path d="M20.8 7.9v8.2a1.8 1.8 0 0 1-.95 1.6l-7 3.8a1.8 1.8 0 0 1-1.7 0l-7-3.8a1.8 1.8 0 0 1-.95-1.6V7.9a1.8 1.8 0 0 1 .95-1.6l7-3.8a1.8 1.8 0 0 1 1.7 0l7 3.8a1.8 1.8 0 0 1 .95 1.6Z" />
      <path d="m3.4 7 8.6 4.7L20.6 7M12 21.3v-9.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.6 4.4 5.9v5.4c0 4.6 3.1 8.8 7.6 10.1 4.5-1.3 7.6-5.5 7.6-10.1V5.9L12 2.6Z" />
      <path d="m8.9 11.9 2.2 2.2 4-4.3" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9.3" r="5.8" />
      <path d="m9.5 9.2 1.9 1.9 3.3-3.6" />
      <path d="m8.4 14.5-1.2 6.3 4.8-2.4 4.8 2.4-1.2-6.3" />
    </>
  ),
  route: (
    <>
      <circle cx="5.6" cy="5.6" r="2.4" />
      <circle cx="18.4" cy="18.4" r="2.4" />
      <path d="M8 5.6h5.6a3.6 3.6 0 0 1 0 7.2h-3.2a3.6 3.6 0 0 0 0 7.2H16" />
    </>
  ),
  lock: (
    <>
      <rect x="4.2" y="10.2" width="15.6" height="11" rx="2" />
      <path d="M7.9 10.2V7a4.1 4.1 0 0 1 8.2 0v3.2M12 14.6v2.4" />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 17.5a9 9 0 1 1 17 0" />
      <path d="m12 13.8 4.1-4.1" />
      <circle cx="12" cy="15.4" r="1.6" />
    </>
  ),
  device: (
    <>
      <rect x="6.6" y="2.6" width="10.8" height="18.8" rx="2.2" />
      <path d="M10.6 5.6h2.8M11 18.4h2" />
    </>
  ),
  bolt: (
    <>
      <path d="M13.2 2.6 4.8 13.4h6L10.8 21.4l8.4-10.8h-6l.2-8Z" />
    </>
  ),
  plug: (
    <>
      <path d="M9 2.8v5.4M15 2.8v5.4" />
      <path d="M6.4 8.2h11.2v3.1a5.6 5.6 0 0 1-11.2 0V8.2Z" />
      <path d="M12 16.9v4.3" />
    </>
  ),
};

export function ModuleIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg {...base} className={className}>
      {MODULE_ICONS[name]}
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6.5 9.5 5.5 5 5.5-5" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m4.8 12.4 4.6 4.6L19.2 7" />
    </svg>
  );
}
