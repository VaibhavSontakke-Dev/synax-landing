import { notFound } from "next/navigation";

/**
 * Catches every address that no other page matches (`/nope`, `/fr/nope/deeper`) and shows the translated 404 page
 * (`../not-found.tsx`) inside the normal layout. Without it Next.js would show its plain built-in 404, in English, without the
 * site's header and footer.
 */
export default function CatchAll() {
  notFound();
}
