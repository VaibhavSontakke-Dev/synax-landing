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
  aspect: string;
};

const AEROSPACE: Card = {
  id: "aerospace",
  label: "Aerospace & Defense",
  detail: "Quality gates and AS9100D control",
  glyph: AerospaceIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-[3/4]",
};

const PRECISION: Card = {
  id: "precision",
  label: "Precision Manufacturing",
  detail: "Machine loading and traceability",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[3/4]",
};

const IT_SERVICES: Card = {
  id: "it",
  label: "IT Services",
  detail: "Delivery, people and billing",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[3/4]",
};

const TEAM_CHAT: Card = {
  id: "team-chat",
  label: "Team Chat",
  detail: "Real-time collaboration",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[2/1]",
};

const AUDIO_VIDEO: Card = {
  id: "audio-video",
  label: "Audio / Video Call",
  detail: "Seamless communication",
  glyph: ItIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[2/1]",
};

const MEETINGS: Card = {
  id: "meetings",
  label: "Public & Private Meetings",
  detail: "Organized discussions",
  glyph: ItIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-[2/1]",
};

const DWM: Card = {
  id: "dwm",
  label: "DWM (Daily Work Management)",
  detail: "Daily task tracking",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[2/1]",
};

const ATTENDANCE: Card = {
  id: "attendance",
  label: "Attendance Management",
  detail: "Track team presence",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[2/1]",
};

const SUPPORT_TICKETS: Card = {
  id: "support-tickets",
  label: "Ticket Support System",
  detail: "Issue resolution",
  glyph: AerospaceIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-[2/1]",
};

const OPERATOR_PANEL: Card = {
  id: "operator-panel",
  label: "Operator Panel & Login",
  detail: "Secure access control",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[2/1]",
};

const JOB_SCHEDULING: Card = {
  id: "job-scheduling",
  label: "Job Scheduling Calendar",
  detail: "Production planning",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[2/1]",
};

const EXECUTION_REPORTS: Card = {
  id: "execution-reports",
  label: "Execution Reports",
  detail: "Performance analytics",
  glyph: AerospaceIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-[2/1]",
};

const STOCK_OUT: Card = {
  id: "stock-out",
  label: "Stock Out Management",
  detail: "Inventory control",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[2/1]",
};

const VENDOR_PO: Card = {
  id: "vendor-po",
  label: "Vendor PO & Internal PO",
  detail: "Purchase order management",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[2/1]",
};

const MACHINE_LOADING: Card = {
  id: "machine-loading",
  label: "Machine Loading Plan Board",
  detail: "Production scheduling",
  glyph: AerospaceIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-[2/1]",
};

const VIDEO_CALLS: Card = {
  id: "video-calls",
  label: "Video Calls",
  detail: "Face-to-face communication",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[2/1]",
};

const VISITOR_MANAGEMENT: Card = {
  id: "visitor-management",
  label: "Company Visitor Management",
  detail: "Guest access tracking",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[2/1]",
};

const JOB_SCHEDULE_LIST: Card = {
  id: "job-schedule-list",
  label: "Job Schedule List",
  detail: "Schedule overview",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[2/1]",
};

const MATERIAL_ENTRY_AUDIT: Card = {
  id: "material-entry-audit",
  label: "Material Entry Audit",
  detail: "Material verification",
  glyph: AerospaceIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-[2/1]",
};

const MATERIAL_HISTORY: Card = {
  id: "material-history",
  label: "Material History",
  detail: "Material tracking",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[2/1]",
};

const BILL_OF_MATERIALS: Card = {
  id: "bill-of-materials",
  label: "Bill of Materials",
  detail: "BOM management",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[2/1]",
};

const NCR_CAPA: Card = {
  id: "ncr-capa",
  label: "NCR / CAPA",
  detail: "Quality management",
  glyph: AerospaceIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-[2/1]",
};

const FAIR_MANAGER: Card = {
  id: "fair-manager",
  label: "FAIR Manager",
  detail: "Failure analysis",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[2/1]",
};

const CALIBRATION_DASHBOARD: Card = {
  id: "calibration-dashboard",
  label: "Calibration Dashboard",
  detail: "Equipment calibration",
  glyph: PrecisionIcon,
  surface:
    "border-erp-accent/40 bg-gradient-to-br from-erp-accent/30 to-erp-navy-2",
  chip: "bg-erp-accent text-white",
  aspect: "aspect-[2/1]",
};

const GENEALOGY_TRACE: Card = {
  id: "genealogy-trace",
  label: "Genealogy Trace",
  detail: "Product traceability",
  glyph: AerospaceIcon,
  surface: "border-erp-brand/35 bg-gradient-to-br from-erp-brand/30 to-erp-navy-2",
  chip: "bg-erp-brand text-white",
  aspect: "aspect-[2/1]",
};

const DISPATCH_RELEASE: Card = {
  id: "dispatch-release",
  label: "Dispatch Release Controls",
  detail: "Release management",
  glyph: ItIcon,
  surface: "border-erp-sky/35 bg-gradient-to-br from-erp-sky/25 to-erp-navy-2",
  chip: "bg-erp-sky text-erp-navy",
  aspect: "aspect-[2/1]",
};

const COLUMN_A = [
  TEAM_CHAT,
  AUDIO_VIDEO,
  MEETINGS,
  DWM,
  ATTENDANCE,
  SUPPORT_TICKETS,
  VIDEO_CALLS,
];

const COLUMN_B = [
  MACHINE_LOADING,
  OPERATOR_PANEL,
  JOB_SCHEDULING,
  JOB_SCHEDULE_LIST,
  EXECUTION_REPORTS,
  MATERIAL_ENTRY_AUDIT,
  MATERIAL_HISTORY,
  STOCK_OUT,
  VENDOR_PO,
  BILL_OF_MATERIALS,
  NCR_CAPA,
  FAIR_MANAGER,
  CALIBRATION_DASHBOARD,
  GENEALOGY_TRACE,
  DISPATCH_RELEASE,
];

function HeroCard(
  {
    card,
    floatDelay,
    duplicate,
    isColumnB,
  }: {
    card: Card;
    floatDelay: number;
    duplicate?: boolean;
    isColumnB?: boolean;
  }
) {
  const Glyph = card.glyph;
  const isColumnA = !isColumnB;

  return (
    <article
      aria-hidden={duplicate || undefined}
      style={{ animationDelay: `${floatDelay}ms` }}
      className={`erp-marquee-card mb-2 flex flex-col justify-between overflow-hidden rounded-[1.25rem] border p-3 shadow-erp-lg backdrop-blur-sm transition-[scale,border-color] duration-500 ease-erp hover:scale-[1.03] sm:mb-3 sm:p-3 lg:mb-4 ${
        isColumnB ? "sm:p-1 lg:p-2 sm:rounded-md mb-1 sm:mb-2" : "sm:p-2 lg:p-3 sm:rounded-lg"
      } ${card.aspect} ${card.surface}`}
    >
      <span
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-erp-md sm:size-9 ${
          isColumnB ? "sm:size-6 lg:size-7" : "sm:size-8 lg:size-9"
        } ${card.chip}`}
      >
        <Glyph className={`size-4 sm:size-5 ${isColumnB ? "sm:size-3 lg:size-4" : "sm:size-4"}`} />
      </span>

      <div>
        <p
          className={`text-[0.75rem] leading-tight font-semibold text-balance text-white sm:text-[0.75rem] ${
            isColumnB ? "sm:text-[0.5rem] lg:text-[0.55rem]" : "sm:text-[0.65rem] lg:text-[0.7rem]"
          }`}
        >
          {card.label}
        </p>
        <p
          className={`mt-0.5 text-[0.6rem] leading-tight text-slate-300 sm:text-[0.6rem] ${
            isColumnB ? "sm:text-[0.4rem] lg:text-[0.45rem] mt-0" : "sm:text-[0.55rem] lg:text-[0.6rem]"
          }`}
        >
          {card.detail}
        </p>
      </div>
    </article>
  );
}

function Column(
  {
    cards,
    duration,
    offset,
    isColumnB,
  }: {
    cards: Card[];
    duration: string;
    offset: string;
    isColumnB?: boolean;
  }
) {
  return (
    <div
      className="erp-marquee"
      style={{ animationDuration: duration, animationDelay: offset }}
    >
      {cards.map((card, index) => (
        <HeroCard
          key={card.id}
          card={card}
          floatDelay={index * 1300}
          isColumnB={isColumnB}
        />
      ))}
      {cards.map((card, index) => (
        <HeroCard
          key={`${card.id}-loop`}
          card={card}
          floatDelay={index * 1300}
          duplicate
          isColumnB={isColumnB}
        />
      ))}
    </div>
  );
}

export function HeroCards() {
  return (
    <div className="erp-marquee-mask relative mx-auto h-[21rem] w-full max-w-[26rem] overflow-hidden sm:h-[26rem] lg:h-[30rem] lg:max-w-none">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        <Column cards={COLUMN_A} duration="22s" offset="0s" />
        <Column cards={COLUMN_B} duration="98s" offset="-11s" isColumnB />
      </div>
    </div>
  );
}
