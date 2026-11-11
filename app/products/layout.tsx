import { ErpShell } from "../erp/_components/erp-shell";

/** /products and /products/<slug> share the Synax page frame (design system, header, footer, modals). */
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <ErpShell>{children}</ErpShell>;
}
