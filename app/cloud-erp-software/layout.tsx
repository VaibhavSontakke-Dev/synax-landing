import { ErpShell } from "../erp/_components/erp-shell";

/** Legacy /cloud-erp-software/* URLs keep working and share the Synax page frame. */
export default function CloudErpLayout({ children }: { children: React.ReactNode }) {
  return <ErpShell>{children}</ErpShell>;
}
