"use client";

import { useState } from "react";
import { Container, Section } from "@/app/erp/_components/ui";
import { Reveal } from "@/app/erp/_components/reveal";
import { SiteHeader } from "@/app/erp/_components/site-header";
import { SiteFooter } from "@/app/erp/_components/site-footer";

function VideoModal({
  isOpen,
  onClose,
  videoUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <div
        className="relative w-full max-w-4xl mx-4 aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors"
          aria-label="Close video"
        >
          <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <iframe
          src={videoUrl}
          title="Manufacturing Management Software Video"
          className="w-full h-full rounded-erp-lg"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function StickyNav() {
  return (
    <nav className="sticky top-0 z-40 bg-[#004A80] border-b border-white/10">
      <Container>
        <div className="flex items-center justify-between py-4">
          <ul className="flex flex-wrap gap-6 sm:gap-8">
            <li>
              <a
                href="#solutions"
                className="text-xs sm:text-sm font-semibold uppercase text-white hover:text-[#CDFF33] transition-colors"
              >
                Solutions
              </a>
            </li>
            <li>
              <a
                href="#highlights"
                className="text-xs sm:text-sm font-semibold uppercase text-white hover:text-[#CDFF33] transition-colors"
              >
                Product highlights
              </a>
            </li>
            <li>
              <a
                href="#benefits"
                className="text-xs sm:text-sm font-semibold uppercase text-white hover:text-[#CDFF33] transition-colors"
              >
                Why Acumatica
              </a>
            </li>
            <li>
              <a
                href="#tour"
                className="text-xs sm:text-sm font-semibold uppercase text-white hover:text-[#CDFF33] transition-colors"
              >
                Product Tour
              </a>
            </li>
            <li>
              <a
                href="#resources"
                className="text-xs sm:text-sm font-semibold uppercase text-white hover:text-[#CDFF33] transition-colors"
              >
                Resources
              </a>
            </li>
          </ul>
          <a
            href="/request-a-demo/"
            className="text-xs sm:text-sm font-semibold uppercase text-[#CDFF33] hover:text-white transition-colors whitespace-nowrap ml-4"
          >
            Next Steps
          </a>
        </div>
      </Container>
    </nav>
  );
}

export default function ManufacturingManagementPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoUrl = "https://fast.wistia.net/embed/iframe/0dwhm7eeib";

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Section id="solutions" tone="dark">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal>
                <div className="max-w-lg">
                  <h1 className="text-[length:var(--erp-h2)] leading-[1.15] font-medium tracking-normal text-balance text-white">
                    Manufacturing Management Software
                  </h1>
                  <p className="mt-5 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-slate-300">
                    Connect your entire production lifecycle and automate quote-to-cash with a single, adaptable platform built to support multi-modal discrete and process manufacturing, with advanced sales capabilities powered by a rules-based product configurator, adaptable estimating app, and native commerce connectors.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a
                      href="https://www.acumatica.com/media/2026/01/mfg-mgmt-brochure.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-erp-md font-semibold whitespace-nowrap transition-all duration-300 ease-erp bg-erp-brand text-white shadow-erp-brand hover:bg-erp-brand-dark hover:shadow-[0_14px_32px_rgba(11,108,255,0.38)] h-12 px-6 text-[0.9375rem] sm:h-[3.25rem] sm:px-7 sm:text-base"
                    >
                      View edition brochure
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="relative group cursor-pointer">
                  <img
                    src="https://www.acumatica.com/media/2026/01/mfg-mgmt-video-cover.png"
                    alt="Manufacturing Management Software Video"
                    className="w-full h-auto rounded-erp-lg shadow-erp-lg transition-transform duration-300 ease-erp group-hover:scale-[1.02]"
                  />
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="absolute inset-0 flex items-center justify-center rounded-erp-lg bg-black/30 opacity-0 transition-opacity duration-300 ease-erp group-hover:opacity-100"
                    aria-label="Play video"
                  >
                    <div className="flex items-center justify-center size-16 rounded-full bg-white/90 transition-transform duration-300 ease-erp group-hover:scale-110">
                      <svg
                        className="size-6 text-erp-navy ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>

        <StickyNav />

        <Section id="highlights" tone="light">
          <Container>
            <div className="text-center">
              <h2 className="text-[length:var(--erp-h2)] leading-[1.15] font-medium tracking-normal text-balance text-erp-ink">
                Product highlights
              </h2>
              <p className="mt-4 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-erp-body">
                Coming soon
              </p>
            </div>
          </Container>
        </Section>

        <Section id="benefits" tone="dark">
          <Container>
            <div className="text-center">
              <h2 className="text-[length:var(--erp-h2)] leading-[1.15] font-medium tracking-normal text-balance text-white">
                Why Acumatica
              </h2>
              <p className="mt-4 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-slate-300">
                Coming soon
              </p>
            </div>
          </Container>
        </Section>

        <Section id="tour" tone="light">
          <Container>
            <div className="text-center">
              <h2 className="text-[length:var(--erp-h2)] leading-[1.15] font-medium tracking-normal text-balance text-erp-ink">
                Product Tour
              </h2>
              <p className="mt-4 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-erp-body">
                Coming soon
              </p>
            </div>
          </Container>
        </Section>

        <Section id="resources" tone="dark">
          <Container>
            <div className="text-center">
              <h2 className="text-[length:var(--erp-h2)] leading-[1.15] font-medium tracking-normal text-balance text-white">
                Resources
              </h2>
              <p className="mt-4 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-slate-300">
                Coming soon
              </p>
            </div>
          </Container>
        </Section>
      </main>

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoUrl={videoUrl} />
      <SiteFooter />
    </>
  );
}
