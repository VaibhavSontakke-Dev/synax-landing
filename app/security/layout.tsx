import { ErpShell } from "../erp/_components/erp-shell";

/** /security shares the Synax page frame (design system, header, footer, modals). */
export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <ErpShell>{children}</ErpShell>;
}
