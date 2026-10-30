"use client";

import { useState } from "react";
import { Container } from "./ui";
import { Reveal } from "./reveal";

type Feature = {
  id: string;
  label: string;
  title: string;
  description: string;
  imageUrl: string;
};

const FEATURES: Feature[] = [
  {
    id: "modern-ui",
    label: "Modern User Interface",
    title: "Modern User Interface",
    description:
      "An intuitive, responsive interface designed for both developers and business users, with clean layouts, consistent patterns, and seamless navigation across all devices.",
    imageUrl: "/images/modern-ui.png",
  },
  {
    id: "ai-ml",
    label: "AI & Machine Learning",
    title: "AI & Machine Learning",
    description:
      "Built-in AI capabilities that automate routine tasks, provide predictive insights, and enhance decision-making through machine learning algorithms integrated directly into workflows.",
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "low-code",
    label: "Low-Code/No-Code Customization",
    title: "Low-Code/No-Code Customization",
    description:
      "Powerful visual tools that allow business users to customize workflows, create reports, and build applications without writing code, while developers can extend functionality with full code access.",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mobile",
    label: "Mobile Accessibility",
    title: "Mobile Accessibility",
    description:
      "Fully responsive design that works seamlessly on mobile devices, with dedicated mobile apps for critical business functions and offline capabilities for field operations.",
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "security",
    label: "Enterprise Security",
    title: "Enterprise Security",
    description:
      "Enterprise-grade security features including role-based access control, data encryption, audit trails, and compliance frameworks to protect sensitive business data and ensure regulatory compliance.",
    imageUrl:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export function PurposeBuilt() {
  const [activeFeature, setActiveFeature] = useState<string>("modern-ui");

  return (
    <section className="relative overflow-hidden bg-erp-surface py-7 sm:py-9 lg:py-10">
      {/* Subtle square grid texture */}
      <div className="pointer-events-none absolute inset-0 erp-grid-light" aria-hidden />

      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[1.5rem] font-medium leading-[1.15] text-erp-ink sm:text-[1.625rem] lg:text-[1.75rem]">
              Purpose-Built for Developers and Business Users
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-5 grid grid-cols-1 items-stretch gap-5 sm:mt-6 lg:mt-7 lg:grid-cols-2 lg:gap-8">
            {/* Left Column - Feature List */}
            <div className="flex flex-col justify-between space-y-1 sm:space-y-1.5">
              {FEATURES.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                  className={`w-full text-left rounded-erp-md px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all duration-300 ease-erp border border-transparent ${
                    activeFeature === feature.id
                      ? "border-erp-brand bg-erp-brand/8 text-erp-brand"
                      : "text-erp-body hover:border-erp-line hover:bg-erp-surface-2 hover:text-erp-ink"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-2 rounded-full transition-all duration-300 ease-erp ${
                        activeFeature === feature.id
                          ? "bg-erp-brand"
                          : "bg-erp-line"
                      }`}
                    />
                    <span className="text-xs sm:text-[0.875rem] font-semibold">
                      {feature.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column - Content Panel */}
            <div className="grid">
              {FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  className={`col-start-1 row-start-1 flex flex-col transition-all duration-500 ease-erp ${
                    activeFeature === feature.id
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="erp-card-surface flex h-full flex-col justify-between overflow-hidden rounded-erp-xl border border-erp-line p-4 shadow-erp-sm sm:p-5 lg:p-6">
                    <div className="mb-3">
                      <h3 className="text-[1.125rem] font-medium leading-snug text-erp-ink sm:text-[1.25rem]">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-erp-body sm:text-[0.875rem]">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Image at bottom of panel */}
                    <div className="relative h-32 overflow-hidden rounded-erp-md border border-erp-line/70 sm:h-36 lg:h-40">
                      <img
                        src={feature.imageUrl}
                        alt={`Visual representation of ${feature.title}`}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
