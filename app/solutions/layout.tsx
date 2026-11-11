import { ErpShell } from "../erp/_components/erp-shell";

/** /solutions/<slug> pages share the Synax page frame (design system, header, footer, modals). */
export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <ErpShell>{children}</ErpShell>;
}
