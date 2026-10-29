import { Container, SectionHeading, TextLink } from "./ui";
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
      "Streamline production, quality control, and operational efficiency for manufacturing.",
    imageUrl:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    learnMoreHref: "#manufacturing-management",
  },
  {
    id: "professional-services-management",
    title: "Professional Services Management",
    description:
      "Manage projects, resources, billing, and client relationships for service-based businesses.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    learnMoreHref: "#professional-services-management",
  },
];

function IndustryCard({ card }: { card: IndustryCard }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-erp-lg bg-white shadow-erp-sm transition-all duration-300 ease-erp hover:shadow-erp-md erp-card">
      <div className="relative h-48 overflow-hidden md:h-56">
        <img
          src={card.imageUrl}
          alt={card.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-erp group-hover:scale-105"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-erp-navy/80 via-erp-navy/20 to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="text-[0.9375rem] font-semibold leading-snug text-erp-ink">
          {card.title}
        </h3>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-erp-body">
          {card.description}
        </p>
        <div className="mt-4">
          <TextLink href={card.learnMoreHref} tone="light">
            Learn More →
          </TextLink>
        </div>
      </div>
    </div>
  );
}

export function IndustryCards() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="All-in-one Cloud ERP software"
            title={
              <span className="inline-block rounded-erp-sm bg-erp-brand px-3 py-1 text-white">
                All-in-one Cloud ERP software
              </span>
            }
            lead="Best-in-class business and industry-specific solutions that can be easily tailored to meet the needs of your growing company"
            align="center"
            className="mb-12 sm:mb-16"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {INDUSTRY_CARDS.map((card, index) => (
            <Reveal key={card.id} delay={index * 70} as="div">
              <IndustryCard card={card} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}