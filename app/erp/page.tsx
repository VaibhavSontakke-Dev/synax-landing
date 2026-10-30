import { BusinessGoals } from "./_components/business-goals";
import { Customers } from "./_components/customers";
import { CustomerStories } from "./_components/customer-stories";
import { Contactus } from "./_components/contactus";
import { Hero } from "./_components/hero";
import { IndustryCards } from "./_components/industry-cards";
import { Industries } from "./_components/industries";
import { Integrations } from "./_components/integrations";
import { Modules } from "./_components/modules";
import { WhyChoose2 } from "./_components/whyChoose2";
import { PurposeBuilt } from "./_components/purpose-built";
import { Rollout } from "./_components/rollout";
import { DashboardShowcase } from "./_components/dashboard-showcase";
import { Showcase } from "./_components/showcase";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";
import { Technology } from "./_components/technology";
import { Testimonials } from "./_components/testimonials";
import { WhyChoose } from "./_components/why-choose";
import { Workflow } from "./_components/workflow";

/**
 * Synax ERP marketing homepage.
 *
 * Self-contained: every link and CTA is an in-page anchor, so nothing leaves
 * this route. Only the header, the benefit tabs and the demo form ship
 * JavaScript; the rest are server components, and the page prerenders whole.
 *
 * Section tones alternate dark / light / tint deliberately — that rhythm is
 * what separates the sections, so check it before reordering them.
 */
export default function ErpLandingPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <IndustryCards />
        <WhyChoose />
        <Industries />
        {/* <CustomerStories /> */}
        <PurposeBuilt />
        {/* <BusinessGoals /> */}
        {/* <WhyChoose2 /> */}
         <Modules />


         {/* tanmay  */}
         <Technology />
        <Showcase />
        <DashboardShowcase />
        <Workflow />
        <Customers />
        <Testimonials />
        <Integrations />
        {/* <Rollout /> */}
        <Contactus />
        
        </main>
        <SiteFooter />
        
    </>
  );
}
