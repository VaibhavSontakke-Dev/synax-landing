"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Play, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionTag } from "./section-tag";
import { PRODUCT_ROUTES } from "../_data/products";
import { TourPlayer, VideoTour } from "./tour-player";
import { TOURS } from "../_data/tours";

/**
 * Demo-request and product-tour modals, shared by every page.
 *
 * They used to live inside the landing page component, so no other route could open them. Any
 * component under <DemoProvider> calls `useDemo()` to open one. The form posts to /api/demo-request
 * (honeypot field `website` is hidden from users and assistive tech).
 */

const DEFAULT_PRODUCT = "Full Synax Unified Enterprise Suite";
const PRODUCT_OPTIONS = [
  ...PRODUCT_ROUTES.map((r) => r.name),
  "Aerospace & Defence",
  "Security & Trust Review",
  DEFAULT_PRODUCT,
];

interface DemoApi {
  openDemo: (product?: string) => void;
  openTour: (title?: string) => void;
  /** True while either modal is open (the mobile sticky CTA hides itself then). */
  modalOpen: boolean;
}

const DemoContext = createContext<DemoApi | null>(null);

export function useDemo(): DemoApi {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}

interface FormState {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  product: string;
  floorSize: string;
  message: string;
  /** The visitor ticked the privacy-notice box (DPDP Act, 2023: notice and consent before we collect personal data). */
  consent: boolean;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  product: DEFAULT_PRODUCT,
  floorSize: "50 - 250 Employees (1-3 Plants)",
  message: "",
  consent: false,
};

const FIELD =
  "w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-line focus:ring-1 focus:ring-brand-line bg-slate-50/50";

/** Error codes the API route returns (app/api/demo-request/route.ts); each has a message under DemoForm.errors. */
const API_ERRORS = new Set(["invalid_request", "too_many_requests", "name_company", "invalid_email", "consent_required", "delivery_failed"]);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("DemoForm");
  const tTour = useTranslations("TourModal");
  const locale = useLocale();
  const [demoOpen, setDemoOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourTitle, setTourTitle] = useState("Synax Platform Overview");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  /** The option value stays English (it goes to the sales team's CRM); only the label is translated. */
  const optionLabel = (name: string) =>
    name === DEFAULT_PRODUCT ? t("options.suite") : name === "Aerospace & Defence" ? t("options.aerospace") : name === "Security & Trust Review" ? t("options.securityReview") : name;

  const openDemo = useCallback((product = DEFAULT_PRODUCT) => {
    setForm((prev) => ({
      ...prev,
      product: PRODUCT_OPTIONS.includes(product) ? product : DEFAULT_PRODUCT,
      consent: false,
    }));
    setSubmitted(false);
    setError("");
    setDemoOpen(true);
  }, []);

  const openTour = useCallback((title = "Synax Platform Overview") => {
    setTourTitle(title);
    setTourOpen(true);
  }, []);

  // Escape closes whichever modal is open.
  useEffect(() => {
    if (!demoOpen && !tourOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDemoOpen(false);
      setTourOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [demoOpen, tourOpen]);

  const api = useMemo<DemoApi>(
    () => ({ openDemo, openTour, modalOpen: demoOpen || tourOpen }),
    [openDemo, openTour, demoOpen, tourOpen],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const website = new FormData(e.currentTarget).get("website");
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `locale` tells the sales team which language the visitor was reading, so they can answer in it.
        body: JSON.stringify({ ...form, website, locale }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { code?: string } | null;
        throw new Error(data?.code ?? "generic");
      }
      setSubmitted(true);
    } catch (err) {
      const code = err instanceof Error && API_ERRORS.has(err.message) ? err.message : "generic";
      setError(t(`errors.${code}`));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DemoContext.Provider value={api}>
      {children}

      {demoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDemoOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            className="synax-thin-scroll relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-surface p-5 shadow-2xl sm:px-7 sm:py-6"
          >
            <button
              type="button"
              onClick={() => setDemoOpen(false)}
              className="absolute top-5 right-5 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label={t("closeModal")}
            >
              <X className="size-5" />
            </button>

            {submitted ? (
              <div className="space-y-4 py-8 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 id="demo-modal-title" className="text-2xl font-bold text-slate-900">
                  {t("successTitle")}
                </h3>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600" role="status">
                  {t.rich("successBody", {
                    name: form.fullName,
                    email: form.email,
                    product: optionLabel(form.product),
                    b: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setDemoOpen(false)}
                    className="cursor-pointer rounded-xl bg-brand-solid px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-solid-hover"
                  >
                    {t("returnToPlatform")}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 pr-8">
                  <SectionTag lines="start">{t("eyebrow")}</SectionTag>
                  <h3 id="demo-modal-title" className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                    {t("title")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {t("lead")}
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-3 text-left">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="demo-fullName" className="mb-1 block text-xs font-semibold text-slate-700">
                        {t("fullName")} *
                      </label>
                      <input
                        id="demo-fullName"
                        autoFocus
                        autoComplete="name"
                        type="text"
                        required
                        name="fullName"
                        value={form.fullName}
                        onChange={onChange}
                        placeholder={t("fullNamePlaceholder")}
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label htmlFor="demo-email" className="mb-1 block text-xs font-semibold text-slate-700">
                        {t("email")} *
                      </label>
                      <input
                        id="demo-email"
                        autoComplete="email"
                        type="email"
                        required
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder={t("emailPlaceholder")}
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="demo-company" className="mb-1 block text-xs font-semibold text-slate-700">
                        {t("company")} *
                      </label>
                      <input
                        id="demo-company"
                        autoComplete="organization"
                        type="text"
                        required
                        name="company"
                        value={form.company}
                        onChange={onChange}
                        placeholder={t("companyPlaceholder")}
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label htmlFor="demo-phone" className="mb-1 block text-xs font-semibold text-slate-700">
                        {t("phone")}
                      </label>
                      <input
                        id="demo-phone"
                        autoComplete="tel"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder={t("phonePlaceholder")}
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="demo-product" className="mb-1 block text-xs font-semibold text-slate-700">
                      {t("product")} *
                    </label>
                    <select
                      id="demo-product"
                      name="product"
                      value={form.product}
                      onChange={onChange}
                      className="w-full rounded-xl border border-slate-200 bg-surface px-3.5 py-2.5 text-xs focus:border-brand-line focus:outline-none"
                    >
                      {PRODUCT_OPTIONS.map((name) => (
                        <option key={name} value={name}>
                          {optionLabel(name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="demo-floorSize" className="mb-1 block text-xs font-semibold text-slate-700">
                      {t("scale")}
                    </label>
                    <select
                      id="demo-floorSize"
                      name="floorSize"
                      value={form.floorSize}
                      onChange={onChange}
                      className="w-full rounded-xl border border-slate-200 bg-surface px-3.5 py-2.5 text-xs focus:border-brand-line focus:outline-none"
                    >
                      <option value="1 - 50 Employees (1 Plant)">{t("sizes.s1")}</option>
                      <option value="50 - 250 Employees (1-3 Plants)">{t("sizes.s2")}</option>
                      <option value="250 - 1,000 Employees (Multi-facility)">{t("sizes.s3")}</option>
                      <option value="1,000+ Enterprise Tier">{t("sizes.s4")}</option>
                    </select>
                  </div>
                  </div>

                  <div>
                    <label htmlFor="demo-message" className="mb-1 block text-xs font-semibold text-slate-700">
                      {t("message")}
                    </label>
                    <textarea
                      id="demo-message"
                      rows={2}
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      placeholder={t("messagePlaceholder")}
                      className={FIELD}
                    />
                  </div>

                  {/* Honeypot: hidden from users and assistive tech; bots fill it. */}
                  <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="demo-website">Website</label>
                    <input id="demo-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                    <input
                      id="demo-consent"
                      name="consent"
                      type="checkbox"
                      required
                      checked={form.consent}
                      onChange={(e) => setForm((prev) => ({ ...prev, consent: e.target.checked }))}
                      className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-line"
                    />
                    <label htmlFor="demo-consent" className="text-xs leading-relaxed text-slate-600">
                      {t.rich("consent", {
                        link: (chunks) => (
                          <Link
                            href="/privacy"
                            target="_blank"
                            rel="noopener"
                            className="font-semibold text-brand underline hover:text-blue-800 dark:hover:text-accent"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </label>
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-1 w-full cursor-pointer rounded-xl bg-brand-solid py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-solid-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? t("sending") : t("submit")}
                  </button>
                  <p className="text-center text-xs text-slate-500">{t("note")}</p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {tourOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setTourOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-modal-title"
            className="keep-light-palette relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-orange-400/15 text-orange-300">
                  <Play className="size-4 fill-orange-300" />
                </div>
                <div>
                  <h3 id="tour-modal-title" className="text-sm font-bold tracking-wide text-white">
                    {tourTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400">{tTour("subtitle")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTourOpen(false)}
                className="cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label={tTour("close")}
              >
                <X className="size-5" />
              </button>
            </div>

            {TOURS[tourTitle]?.video ? (
              <VideoTour
                key={tourTitle}
                tour={TOURS[tourTitle]}
                onBook={() => {
                  setTourOpen(false);
                  openDemo(DEFAULT_PRODUCT);
                }}
              />
            ) : TOURS[tourTitle] ? (
              <TourPlayer
                key={tourTitle}
                tour={TOURS[tourTitle]}
                onBook={() => {
                  setTourOpen(false);
                  openDemo(DEFAULT_PRODUCT);
                }}
              />
            ) : (
              <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden bg-slate-950 p-6 text-center">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(#fdba74 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10 w-full max-w-xl space-y-4">
                  <h4 className="text-lg font-bold text-white sm:text-xl">{tourTitle}</h4>
                  <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-400">
                    {tTour("pending")}
                  </p>
                  <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setTourOpen(false);
                        openDemo(tourTitle.replace(" Tour", "").replace(" Demo Video", ""));
                      }}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-surface px-6 py-2.5 text-xs font-bold text-brand shadow-lg transition-colors hover:bg-slate-100 sm:w-auto"
                    >
                      <span>{tTour("bookLive")}</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTourOpen(false)}
                      className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 sm:w-auto"
                    >
                      {tTour("closeButton")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DemoContext.Provider>
  );
}
