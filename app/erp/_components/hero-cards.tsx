import { AerospaceIcon, ItIcon, PrecisionIcon } from "./icons";

/**
 * Hero card marquee.
 *
 * The reference does not play a one-shot entrance — its cards rise
 * continuously, cycling through artwork, with each column offset so the group
 * staggers. This reproduces that with three layers of motion:
 *
 *   1. each column drifts upward forever,
 *   2. the two columns run at different speeds and phases (parallax), so the
 *      pair never reads as one mechanical conveyor,
 *   3. each card bobs gently on its own cycle.
 *
 * Both columns carry all three industries in a different rotation, so the same
 * card is never showing in both columns at once.
 *
 * Each column repeats its cards twice and the track travels exactly -50%, which
 * is why spacing is `mb-*` on the cards rather than `gap` on the column — N
 * duplicated items have 2N-1 gaps, so -50% would drift off a card boundary and
 * the seam would show.
 *
 * Motion is pure CSS: no JavaScript, pauses on hover and keyboard focus, and
 * stops entirely under prefers-reduced-motion.
 */

type Card = {
  id: string;
  label: string;
  detail: string;
  glyph: React.ComponentType<{ className?: string }>;
  surface: string;
  chip: string;
  /** Mixed heights give the column a rhythm instead of a stack of squares. */
  aspect: string;
};

const AEROSPACE: Card = {
  id: "aerospace",
  label: "Aerospace & Defense",
  detail: "Quality gates and AS9100D control",
  glyph: AerospaceIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-square",
};

const PRECISION: Card = {
  id: "precision",
  label: "Precision Manufacturing",
  detail: "Machine loading and traceability",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[5/6]",
};

const IT_SERVICES: Card = {
  id: "it",
  label: "IT Services",
  detail: "Delivery, people and billing",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-square",
};

const COLUMN_A = [AEROSPACE, PRECISION, IT_SERVICES];
const COLUMN_B = [IT_SERVICES, AEROSPACE, PRECISION];

function HeroCard({
  card,
  floatDelay,
  duplicate,
}: {
  card: Card;
  floatDelay: number;
  duplicate?: boolean;
}) {
  const Glyph = card.glyph;

  return (
    <article
      aria-hidden={duplicate || undefined}
      style={{ animationDelay: `${floatDelay}ms` }}
      className={`erp-marquee-card mb-3 flex flex-col justify-between overflow-hidden rounded-[1.25rem] border p-4 shadow-erp-lg backdrop-blur-sm transition-[scale,border-color] duration-500 ease-erp hover:scale-[1.03] sm:mb-4 sm:p-5 lg:mb-5 ${card.aspect} ${card.surface}`}
    >
      <span
        className={`inline-flex size-10 shrink-0 items-center justify-center rounded-erp-md sm:size-11 ${card.chip}`}
      >
        <Glyph className="size-5 sm:size-6" />
      </span>

      <div>
        <p className="text-[0.8125rem] leading-snug font-semibold text-balance text-white sm:text-[0.875rem]">
          {card.label}
        </p>
        <p className="mt-1 text-[0.6875rem] leading-snug text-slate-300 sm:text-[0.75rem]">
          {card.detail}
        </p>
      </div>
    </article>
  );
}

function Column({
  cards,
  duration,
  offset,
}: {
  cards: Card[];
  duration: string;
  offset: string;
}) {
  return (
    <div
      className="erp-marquee"
      style={{ animationDuration: duration, animationDelay: offset }}
    >
      {/* Rendered twice so the -50% travel loops without a seam. Kept flat
          rather than wrapped, so no margin collapses through a wrapper and
          shifts the halfway point. The duplicate keeps its original's float
          delay, so a card bobs identically either side of the loop point. */}
      {cards.map((card, index) => (
        <HeroCard key={card.id} card={card} floatDelay={index * 1300} />
      ))}
      {cards.map((card, index) => (
        <HeroCard
          key={`${card.id}-loop`}
          card={card}
          floatDelay={index * 1300}
          duplicate
        />
      ))}
    </div>
  );
}

export function HeroCards() {
  return (
    /* The mask class also carries the hover/focus pause — see WCAG 2.2.2. */
    <div className="erp-marquee-mask relative mx-auto h-[21rem] w-full max-w-[26rem] overflow-hidden sm:h-[26rem] lg:h-[30rem] lg:max-w-none">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
        <Column cards={COLUMN_A} duration="22s" offset="0s" />
        {/* Slower and out of phase — the mismatch is what makes it feel alive. */}
        <Column cards={COLUMN_B} duration="98s" offset="-11s" />
      </div>
    </div>
  );
}
