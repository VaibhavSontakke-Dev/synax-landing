"use client";

import { useState, useEffect } from "react";
import { Container } from "./ui";
import { Reveal } from "./reveal";

type Story = {
  id: string;
  company: string;
  description: string;
  imageUrl: string;
  storyUrl: string;
};

const STORIES: Story[] = [
  {
    id: "venture-engineering",
    company: "Venture Engineering",
    description:
      "Venture Engineering streamlined their manufacturing operations and improved efficiency with our cloud ERP solution.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    storyUrl: "#venture-engineering",
  },
  {
    id: "eastman-music",
    company: "Eastman Music Company",
    description:
      "Eastman Music Company transformed their business processes and achieved significant cost savings.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    storyUrl: "#eastman-music",
  },
  {
    id: "spohn-associates",
    company: "Spohn Associates",
    description:
      "Spohn Associates enhanced their project management capabilities and improved team collaboration.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    storyUrl: "#spohn-associates",
  },
  {
    id: "saddleback-leather",
    company: "Saddleback Leather",
    description:
      "Saddleback Leather optimized their supply chain and inventory management with our platform.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    storyUrl: "#saddleback-leather",
  },
  {
    id: "wine-racks-america",
    company: "Wine Racks America",
    description:
      "Wine Racks America increased their operational efficiency and customer satisfaction.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    storyUrl: "#wine-racks-america",
  },
];

export function CustomerStories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? STORIES.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === STORIES.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleStories = () => {
    const prevIndex = currentIndex === 0 ? STORIES.length - 1 : currentIndex - 1;
    const nextIndex = currentIndex === STORIES.length - 1 ? 0 : currentIndex + 1;
    return [
      STORIES[prevIndex],
      STORIES[currentIndex],
      STORIES[nextIndex],
    ];
  };

  const visibleStories = getVisibleStories();

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[1.625rem] font-medium leading-[1.15] text-erp-ink sm:text-[1.75rem] lg:text-[1.875rem]">
              Customer Success Stories
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12">
            {/* Carousel Container */}
            <div className="relative">
              {/* Stories Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
                {visibleStories.map((story, idx) => {
                  const isCenter = idx === 1;
                  return (
                    <div
                      key={story.id}
                      className={`transition-all duration-500 ease-erp ${
                        isCenter ? "sm:scale-100" : "sm:scale-75 sm:opacity-50"
                      }`}
                    >
                      <a
                        href={story.storyUrl}
                        className="story-card group relative flex h-96 flex-col justify-end overflow-hidden rounded-erp-xl bg-erp-surface-2 shadow-erp-sm transition-all duration-300 ease-erp hover:shadow-erp-md"
                      >
                        <div
                          className="story-image absolute inset-0 transition-transform duration-500 ease-erp group-hover:scale-110"
                          style={{
                            backgroundImage: `url('${story.imageUrl}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-erp-navy/90 via-erp-navy/40 to-transparent" />

                        <div className="relative z-10 p-6 sm:p-8">
                          <h3 className="text-[1.25rem] font-semibold leading-snug text-white sm:text-[1.375rem]">
                            {story.company}
                          </h3>
                          <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/90">
                            {story.description}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-erp-brand-soft hover:text-white transition-colors">
                            View Story →
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-16 rounded-full bg-erp-brand p-2 text-white transition-all duration-300 ease-erp hover:bg-erp-brand-dark hover:shadow-erp-md focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-erp-brand sm:-translate-x-20 lg:-translate-x-24"
                type="button"
                aria-label="Previous story"
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-16 rounded-full bg-erp-brand p-2 text-white transition-all duration-300 ease-erp hover:bg-erp-brand-dark hover:shadow-erp-md focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-erp-brand sm:translate-x-20 lg:translate-x-24"
                type="button"
                aria-label="Next story"
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {STORIES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ease-erp ${
                    index === currentIndex
                      ? "bg-erp-brand w-4"
                      : "bg-erp-line hover:bg-erp-line-strong"
                  }`}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : "false"}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .story-image,
          .story-card {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
