"use client";

import { useState } from "react";
import { Container, Button, Section } from "./ui";
import { Reveal } from "./reveal";

type TabContent = {
  id: string;
  label: string;
  question: string;
  description: string;
  cta: string;
  ctaLink: string;
  imageUrl: string;
};

const TABS: TabContent[] = [
  {
    id: "ai",
    label: "AI & ML Automation",
    question: "Ready to eliminate repetitive work?",
    description:
      "Automate routine workflows, uncover meaningful business insights, and make smarter decisions with AI-powered capabilities that help your team save time and improve productivity.",
    cta: "Discover AI Capabilities",
    ctaLink:
      "https://www.acumatica.com/cloud-erp-software/artificial-intelligence/",
    imageUrl:
      "https://www.acumatica.com/media/2026/02/ai-powered-automation.png?width=850&fit=cover&format=auto",
  },
  {
    id: "usability",
    label: "Effortless Experience",
    question: "Looking for a simpler way to manage your business?",
    description:
      "Simplify everyday operations with an intuitive Cloud ERP platform that's easy to navigate, requires minimal training, and empowers your team to work efficiently from any device.",
    cta: "Explore the Experience",
    ctaLink: "/cloud-erp-software/tour/",
    imageUrl:
      "https://www.acumatica.com/media/2026/02/unmatched-usability.png?width=850&fit=cover&format=auto",
  },
  {
    id: "security",
    label: "Enterprise Security",
    question: "Is your business data protected?",
    description:
      "Protect critical business information with robust security controls, role-based access, data encryption, and reliable safeguards designed to support your growing business.",
    cta: "Discover Our Security",
    ctaLink: "https://www.acumatica.com/cloud-erp-software/security",
    imageUrl:
      "https://www.acumatica.com/media/2026/02/secure-and-reliable.png?width=850&fit=cover&format=auto",
  },
  {
    id: "trust",
    label: "Customer Confidence",
    question: "Looking for an ERP partner you can trust?",
    description:
      "Choose a Cloud ERP solution recognized for its usability, transparent pricing, and customer-focused approach, helping businesses operate confidently and grow sustainably.",
    cta: "Explore Customer Success",
    ctaLink: "https://www.acumatica.com/awards-user-reviews/",
    imageUrl:
      "https://www.acumatica.com/media/2026/02/trusted-by-customers.png?width=850&fit=cover&format=auto",
  },
  {
    id: "cloud",
    label: "Cloud-First Platform",
    question: "Ready to work without limitations?",
    description:
      "Connect your teams, access business information from anywhere, and adapt as your organization evolves with a modern cloud platform built to support flexibility and long-term growth.",
    cta: "Explore the Cloud Platform",
    ctaLink: "https://www.acumatica.com/cloud-erp-software/cloud-platform/",
    imageUrl:
      "https://www.acumatica.com/media/2026/02/true-cloud-platform.png?width=850&fit=cover&format=auto",
  },
];

export function WhyChoose() {
  const [activeTab, setActiveTab] = useState<string>("usability");

  return (
    <Section id="platform-benefits" tone="tint" className="!py-8 sm:!py-10 lg:!py-11">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[1.5rem] font-medium leading-[1.15] text-erp-ink sm:text-[1.625rem] lg:text-[1.75rem]">
              Why choose Synax Cloud Enterprise Resource Planning (ERP)?
            </h2>
          </div>
        </Reveal>

        {/* Tab Navigation */}
        <Reveal delay={100}>
          <div
            className="mt-5 flex flex-nowrap justify-start gap-0 overflow-x-auto pb-1.5 sm:mt-6 sm:justify-center sm:overflow-visible lg:gap-1"
            role="tablist"
            aria-label="Why choose Acumatica features"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap px-3.5 py-2 text-xs font-semibold transition-all duration-300 ease-erp sm:px-4 sm:py-2.5 sm:text-[0.875rem] ${
                  activeTab === tab.id
                    ? "text-erp-brand bg-erp-brand/8 rounded-erp-md"
                    : "text-erp-body hover:text-erp-ink"
                }`}
              >
                {tab.label}
                {/* Active tab indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full transition-all duration-300 ease-erp bg-gradient-to-r from-erp-brand to-erp-accent ${
                    activeTab === tab.id
                      ? "opacity-100 shadow-[0_0_12px_rgba(11,108,255,0.4)]"
                      : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Content Panel */}
        <div className="mt-5 grid sm:mt-6">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              className={`col-start-1 row-start-1 transition-all duration-500 ease-erp ${
                activeTab === tab.id
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
            >
              <div className="erp-card-surface overflow-hidden rounded-erp-xl border border-erp-line p-5 shadow-erp-sm sm:p-6 lg:p-7">
                <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
                  {/* Left Column - Text Content */}
                  <div>
                    <h3 className="text-[1.125rem] font-medium leading-snug text-erp-ink sm:text-[1.25rem]">
                      {tab.question}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-erp-body sm:mt-2.5 sm:text-[0.875rem]">
                      {tab.description}
                    </p>
                    <div className="mt-4 sm:mt-5">
                      <Button
                        href={tab.ctaLink}
                        size="md"
                        withArrow
                        className="inline-flex"
                      >
                        {tab.cta}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column - Controlled Image Aspect */}
                  <div className="relative h-44 overflow-hidden rounded-erp-lg sm:h-52 lg:h-60">
                    <img
                      src={tab.imageUrl}
                      alt={`Visual representation of ${tab.label}`}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
