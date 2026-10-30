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
  const activeContent = FEATURES.find((f) => f.id === activeFeature) || FEATURES[0];

  return (
    <section className="bg-erp-surface-2 py-16 sm:py-20 lg:py-28">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[1.625rem] font-medium leading-[1.15] text-erp-ink sm:text-[1.75rem] lg:text-[1.875rem]">
              Purpose-Built for Developers and Business Users
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column - Feature List */}
            <div className="space-y-1">
              {FEATURES.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                  className={`w-full text-left rounded-erp-md p-4 transition-all duration-300 ease-erp border border-transparent ${
                    activeFeature === feature.id
                      ? "border-erp-brand bg-erp-brand/5 text-erp-brand"
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
                    <span className="text-[0.9375rem] font-semibold">
                      {feature.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column - Content Panel */}
            {/* Grid-stacked rather than absolutely positioned, so the column
                grows to the tallest panel instead of letting it spill out. */}
            <div className="grid">
              {FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  className={`col-start-1 row-start-1 transition-all duration-500 ease-erp ${
                    activeFeature === feature.id
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="erp-card-surface flex h-full flex-col overflow-hidden rounded-erp-xl border border-erp-line shadow-erp-sm">
                    <div className="p-6 sm:p-8 lg:p-10 flex-1">
                      <h3 className="text-[1.125rem] font-medium leading-snug text-erp-ink sm:text-[1.25rem] lg:text-[1.375rem]">
                        {feature.title}
                      </h3>
                      <p className="mt-4 text-[length:var(--erp-lead)] leading-relaxed text-erp-body">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Image at bottom of panel */}
                    <div className="relative h-48 overflow-hidden border-t border-erp-line sm:h-56">
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
