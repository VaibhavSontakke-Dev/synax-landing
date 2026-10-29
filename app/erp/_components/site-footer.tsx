import { SynaxLogo } from "./logo";
import { Container } from "./ui";

/**
 * Page-scoped footer. Every destination is an anchor on this page — the Synax
 * site publishes no postal address, phone number or email, so enquiries go to
 * the on-page demo form rather than to invented contact details.
 */
const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Why Synax", href: "#platform-benefits" },
      { label: "Connected workflows", href: "#workflows" },
      { label: "Quality gates", href: "#quality" },
      { label: "Technology", href: "#technology" },
      { label: "Product tour", href: "#showcase" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Aerospace & Defense", href: "#industry-aerospace" },
      { label: "Precision Manufacturing", href: "#industry-manufacturing" },
      { label: "IT Services", href: "#industry-it" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Module directory", href: "#modules" },
      { label: "Fits your stack", href: "#integrations" },
      { label: "Customers", href: "#customers" },
      { label: "Rollout blueprint", href: "#rollout" },
      { label: "Book a demo", href: "#demo" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-erp-line-dark bg-erp-navy-2 erp-on-dark">
      <Container>
        <div className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)] lg:gap-16 lg:py-16">
          <div className="max-w-sm">
            <SynaxLogo className="h-9 w-auto" tone="light" />
            <p className="mt-5 text-[0.875rem] leading-relaxed text-slate-400">
              An ERP for aerospace and defense precision manufacturing and IT
              services, with quality gates and AS9100D QMS controls attached at
              critical workflow checkpoints.
            </p>
            <a
              href="#demo"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-erp-md bg-erp-brand px-5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-erp-brand-mid"
            >
              Book a Demo
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="font-mono text-[0.625rem] font-semibold tracking-[0.16em] text-erp-sky uppercase">
                  {column.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[0.875rem] text-slate-400 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-erp-line-dark py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-slate-500">
            © 2026 Synax by Senwell. All rights reserved.
          </p>
          <p className="text-[0.8125rem] text-slate-500">
            Free for SMEs with fewer than 50 employees.
          </p>
        </div>
      </Container>
    </footer>
  );
}
