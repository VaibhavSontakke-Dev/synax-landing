import { ErpShell } from "../../erp/_components/erp-shell";

/** /privacy and /terms share the Synax page frame (design system, header, footer, modals). */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <ErpShell>{children}</ErpShell>;
}
