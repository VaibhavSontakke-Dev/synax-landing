import { ErpShell } from "./erp/_components/erp-shell";
import Landingpage from "./erp/_components/landingpage";

/** The landing page lives at the site root (/erp redirects here, see next.config.ts). */
export default function Home() {
  return (
    <ErpShell>
      <Landingpage />
    </ErpShell>
  );
}
