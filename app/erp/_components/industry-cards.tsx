import { Container } from "./ui";
import { Reveal } from "./reveal";

export type IndustryCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  learnMoreHref: string;
};

const INDUSTRY_CARDS: IndustryCard[] = [
  {
    id: "manufacturing-management",
    title: "Manufacturing Management",
    description:
      "Connect your entire production lifecycle and automate quote-to-cash with a single, adaptable platform built to support multi-modal discrete and process manufacturing.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    learnMoreHref: "/cloud-erp-software/manufacturing-management/#solutions",
  },
  {
    id: "defense-aerospace-management",
    title: "Defense & Aerospace Management",
    description:
      "Support complex manufacturing, project tracking, supply chain operations, and compliance with an ERP built for the rigorous demands of defense and aerospace industries.",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    learnMoreHref: "#industry-aerospace",
  },
  {
    id: "it-services-management",
    title: "IT Services Management",
    description:
      "Manage projects, resources, service delivery, and business operations with an ERP designed for IT service providers to streamline workflows and improve operational efficiency.",
    imageUrl:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    learnMoreHref: "#industry-it",
  }
];

function IndustryCard({ card }: { card: IndustryCard }) {
  const external = card.learnMoreHref.startsWith("http") || card.learnMoreHref.startsWith("/");
  
  return (
    <div className="group industry-card relative flex-1 min-w-0 h-[420px] overflow-hidden rounded-[16px] isolate transition-all duration-300 ease-erp focus-within:shadow-erp-md hover:shadow-erp-md hover:-translate-y-1">
      <a
        href={card.learnMoreHref}
        {...(card.learnMoreHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="absolute inset-0 z-10"
        aria-label={`Learn more about ${card.title}`}
      />
      
      <img
        src={card.imageUrl}
        alt={card.title}
        className="block w-full h-full object-cover transition-transform duration-500 ease-erp group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
        loading="lazy"
      />
      
      {/* Gradient overlay */}
      <div className="industry-overlay absolute inset-0 z-1 bg-gradient-to-t from-erp-navy/75 via-erp-navy/5 to-transparent transition-all duration-500 ease-erp group-hover:bg-gradient-to-t group-hover:from-erp-navy/95 group-hover:via-erp-navy/35 group-hover:to-transparent group-focus-within:bg-gradient-to-t group-focus-within:from-erp-navy/95 group-focus-within:via-erp-navy/35 group-focus-within:to-transparent" />
      
      {/* Card content */}
      <div className="industry-card-content absolute inset-0 z-2 flex flex-col justify-end p-6 text-white">
        <span className="block mb-0 text-[1.5rem] font-bold leading-[1.2] transition-margin duration-400 ease-erp group-hover:mb-3 group-focus-within:mb-3">
          {card.title}
        </span>
        
        {/* Hidden content that slides up */}
        <div className="industry-hidden-content block max-h-0 opacity-0 overflow-hidden translate-y-[18px] transition-all duration-500 ease-erp group-hover:max-h-[300px] group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:max-h-[300px] group-focus-within:opacity-100 group-focus-within:translate-y-0">
          <p className="my-3 text-[0.9375rem] leading-relaxed text-white/95">
            {card.description}
          </p>
          <div className="industry-cta-button inline-flex items-center gap-2 text-[#CDFF33] hover:text-white transition-colors font-semibold text-[0.9375rem]">
            Learn More →
          </div>
        </div>
      </div>
    </div>
  );
}

export function IndustryCards() {
  return (
    <section className="bg-erp-surface py-16 sm:py-20 lg:py-28">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[1.625rem] font-medium leading-[1.15] text-erp-ink sm:text-[1.75rem] lg:text-[1.875rem]">
              All-in-one Cloud ERP software
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[length:var(--erp-lead)] leading-relaxed text-erp-body text-pretty">
              Best-in-class business and industry-specific solutions that can be easily tailored to meet the needs of your growing company
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[27px]">
            {INDUSTRY_CARDS.map((card, index) => (
              <div key={card.id} className="h-full">
                <IndustryCard card={card} />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}