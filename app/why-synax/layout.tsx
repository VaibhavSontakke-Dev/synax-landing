import { ErpShell } from "../erp/_components/erp-shell";

/** /why-synax shares the Synax page frame (design system, header, footer, modals). */
export default function WhySynaxLayout({ children }: { children: React.ReactNode }) {
  return <ErpShell>{children}</ErpShell>;
}
