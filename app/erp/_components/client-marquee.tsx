import { Reveal } from "./reveal";

const LOGO_SEQUENCE = [
  {
    name: "Senwell Exports",
    src: "https://senwellexports.com/static/media/SenwellLogo.524bb520c09926753630.png",
    alt: "Senwell Exports",
    imgClass:
      "h-9 sm:h-11 md:h-12 lg:h-[48px] max-w-[125px] sm:max-w-[145px] md:max-w-[160px]",
  },
  {
    name: "Stacwell",
    src: "https://stacwell.com/_next/image?url=%2FstacwellLogo.webp&w=256&q=75",
    alt: "Stacwell",
    imgClass:
      "h-8 sm:h-10 md:h-11 lg:h-[44px] max-w-[135px] sm:max-w-[160px] md:max-w-[175px]",
  },
  {
    name: "Stacem",
    src: "https://www.stacem.com/wp-content/themes/themeb17/img/logo-stacem.svg",
    alt: "Stacem",
    imgClass:
      "h-7 sm:h-9 md:h-10 lg:h-[40px] max-w-[135px] sm:max-w-[160px] md:max-w-[175px]",
  },
];

// Repeat sequence 4 times per track so there are plenty of logos to fill any screen seamlessly
const MARQUEE_ITEMS = [
  ...LOGO_SEQUENCE,
  ...LOGO_SEQUENCE,
  ...LOGO_SEQUENCE,
  ...LOGO_SEQUENCE,
];

export function ClientMarquee() {
  return (
    <section
      id="customers"
      className="relative scroll-mt-20 overflow-hidden border-y border-slate-100 bg-white py-14 sm:py-18 lg:py-24"
    >
      <style>{`
        @keyframes clientMarqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        .animate-client-marquee {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          animation: clientMarqueeScroll 25s linear infinite;
          will-change: transform;
        }
        .client-marquee-container:hover .animate-client-marquee {
          animation-play-state: paused;
        }
        .client-marquee-mask {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 7%,
            black 93%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 7%,
            black 93%,
            transparent 100%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-client-marquee {
            animation: none;
          }
        }
      `}</style>

      {/* ── Heading Block ── */}
      <Reveal>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-[#0a1128] sm:text-2xl md:text-3xl lg:text-[2.25rem] lg:leading-tight">
            TRUSTED BY {" "}
            <span className="inline-block rounded-md bg-[#0b6cff] px-2.5 py-1 text-white shadow-sm sm:px-3.5 sm:py-1.5 sm:rounded-lg">
              BUSINESSES ACROSS INDIA
            </span>
          </h2>
        </div>
      </Reveal>

      {/* ── Continuous Horizontal Infinite Logo Marquee ── */}
      <div className="client-marquee-container relative mt-10 w-full overflow-hidden sm:mt-12 lg:mt-16">
        <div className="client-marquee-mask relative flex w-full overflow-hidden">
          {/* Track 1 */}
          <div className="animate-client-marquee" aria-label="Client logos">
            {MARQUEE_ITEMS.map((item, index) => (
              <div
                key={`track1-${index}-${item.name}`}
                className="flex h-20 w-[145px] shrink-0 items-center justify-center border-r border-slate-200/70 px-4 sm:h-24 sm:w-[190px] sm:px-6 md:w-[220px] lg:h-28 lg:w-[260px] lg:px-8"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`w-auto object-contain transition-transform duration-300 hover:scale-105 ${item.imgClass}`}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Track 2 (Identical duplicate for 100% seamless infinite loop) */}
          <div className="animate-client-marquee" aria-hidden="true">
            {MARQUEE_ITEMS.map((item, index) => (
              <div
                key={`track2-${index}-${item.name}`}
                className="flex h-20 w-[145px] shrink-0 items-center justify-center border-r border-slate-200/70 px-4 sm:h-24 sm:w-[190px] sm:px-6 md:w-[220px] lg:h-28 lg:w-[260px] lg:px-8"
              >
                <img
                  src={item.src}
                  alt=""
                  className={`w-auto object-contain transition-transform duration-300 hover:scale-105 ${item.imgClass}`}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
