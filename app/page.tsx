import { ErpShell } from "./erp/_components/erp-shell";
import Landingpage from "./erp/_components/landingpage";

/** The root URL renders the same landing page and frame as /erp, so both look identical. */
export default function Home() {
  return (
    <ErpShell>
      <Landingpage />
    </ErpShell>
  );
}
