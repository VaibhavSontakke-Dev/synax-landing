"use client";

import { useRef, useState } from "react";

import { CheckIcon } from "./icons";
import { Reveal } from "./reveal";
import { Container } from "./ui";

/**
 * Closing CTA and demo request.
 *
 * Every "Book a Demo" on the page scrolls here, so this section has to be the
 * place the journey actually ends. Fields mirror the real Synax enquiry form
 * (name, company, work email, phone, requirement).
 *
 * TODO(synax): the submit handler validates and nothing more — wire
 * `submitRequest` to your contact endpoint or CRM. Until that is done the
 * confirmation copy deliberately says the request has not been delivered.
 */

type Field = "name" | "company" | "email" | "requirement";

const FIELDS: {
  id: Field;
  label: string;
  type: string;
  autoComplete: string;
  textarea?: boolean;
}[] = [
  { id: "name", label: "Full name", type: "text", autoComplete: "name" },
  { id: "company", label: "Company", type: "text", autoComplete: "organization" },
  { id: "email", label: "Work email", type: "email", autoComplete: "email" },
  {
    id: "requirement",
    label: "What are you trying to solve?",
    type: "text",
    autoComplete: "off",
    textarea: true,
  },
];

const PROOF = [
  "Free for SMEs with fewer than 50 employees",
  "Phased rollout — start with one stack",
  "Tenant-isolated workspace from day one",
];

export function DemoCta() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const next: Partial<Record<Field, string>> = {};

    for (const field of FIELDS) {
      const value = String(data.get(field.id) ?? "").trim();
      if (!value) {
        next[field.id] = "This field is required.";
      } else if (field.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        next[field.id] = "Enter a valid work email address.";
      }
    }

    setErrors(next);

    const firstInvalid = FIELDS.find((field) => next[field.id]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#demo-${firstInvalid.id}`)?.focus();
      return;
    }

    setSubmitted(true);
  }

  return (
    <section
      id="demo"
      className="relative scroll-mt-20 overflow-hidden bg-erp-navy py-20 erp-on-dark lg:py-28"
    >
      <div className="absolute inset-0 erp-grid-dark" aria-hidden />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full opacity-35 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, #0b6cff 0%, rgba(0,178,169,0.5) 45%, transparent 72%)",
        }}
        aria-hidden
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Reveal>
            <div className="max-w-lg">
              <h2 className="text-[length:var(--erp-h2)] leading-[1.15] font-medium tracking-normal text-balance text-white">
                See How Synax Fits Your Business
              </h2>
              <p className="mt-5 text-[length:var(--erp-lead)] leading-relaxed text-pretty text-slate-300">
                Explore how Synax ERP can support your industry&apos;s workflows
                and operational goals.
              </p>

              <ul className="mt-8 space-y-3">
                {PROOF.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-erp-sky" />
                    <span className="text-[0.9375rem] text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-erp-xl border border-erp-line-dark bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
              {submitted ? (
                <div
                  role="status"
                  className="animate-erp-rise py-6 text-center"
                >
                  <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-erp-accent/15 text-erp-accent">
                    <CheckIcon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    Request captured
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-slate-400">
                    Your details are filled in and validated. This form is not
                    connected to a delivery endpoint yet, so nothing has been
                    sent.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-5 text-[0.875rem] font-semibold text-erp-sky underline-offset-4 hover:underline"
                  >
                    Edit the request
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={submitRequest} noValidate>
                  <h3 className="text-lg font-semibold text-white">
                    Book a demo
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] text-slate-400">
                    Tell us what you need and we will match you to the right
                    team.
                  </p>

                  <div className="mt-6 space-y-4">
                    {FIELDS.map((field) => {
                      const error = errors[field.id];
                      const describedBy = error ? `demo-${field.id}-error` : undefined;
                      const shared = {
                        id: `demo-${field.id}`,
                        name: field.id,
                        autoComplete: field.autoComplete,
                        "aria-invalid": error ? true : undefined,
                        "aria-describedby": describedBy,
                        className: `w-full rounded-erp-md border bg-erp-navy/60 px-3.5 py-2.5 text-[0.9375rem] text-white placeholder:text-slate-500 transition-colors duration-200 ${
                          error
                            ? "border-red-400/70"
                            : "border-erp-line-dark hover:border-erp-sky/40 focus:border-erp-sky"
                        }`,
                      };

                      return (
                        <div key={field.id}>
                          <label
                            htmlFor={`demo-${field.id}`}
                            className="mb-1.5 block text-[0.8125rem] font-medium text-slate-300"
                          >
                            {field.label}
                          </label>

                          {field.textarea ? (
                            <textarea {...shared} rows={3} />
                          ) : (
                            <input {...shared} type={field.type} />
                          )}

                          {error ? (
                            <p
                              id={describedBy}
                              className="mt-1.5 text-[0.75rem] text-red-300"
                            >
                              {error}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-erp-md bg-erp-brand px-6 text-[0.9375rem] font-semibold text-white shadow-erp-brand transition-all duration-300 ease-erp hover:bg-erp-brand-mid hover:shadow-[0_14px_32px_rgba(11,108,255,0.38)]"
                  >
                    Request a demo
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
