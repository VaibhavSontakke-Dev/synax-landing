import type { Metadata } from "next";
import { ErpShell } from "./_components/erp-shell";

export const metadata: Metadata = {
  title: "Synax ERP | Precision & Job-Work Manufacturing, IT Services, HRMS",
  description:
    "ERP for precision and job-work manufacturers, with IT services and projects, HRMS, staffing, shop-floor monitoring and AI in one connected workspace. Quality gates and AS9100D QMS controls at critical workflow checkpoints.",
  openGraph: {
    title: "Synax ERP — From the spindle to the GST invoice",
    description:
      "Connect operations, projects, production and resources in one workspace, with AI agents that propose and approvers who decide.",
    type: "website",
  },
};

/**
 * Route-scoped layout for /erp.
 *
 * Nests inside the root layout, so no <html> or <body> here. The frame (design-system scope, fonts,
 * header, footer, modals) is <ErpShell>, shared with /products, /solutions and the home route.
 */
export default function ErpLayout({ children }: LayoutProps<"/erp">) {
  return <ErpShell>{children}</ErpShell>;
}
