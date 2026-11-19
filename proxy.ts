import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16 "proxy" (the successor of middleware): runs before every page request.
 *  - On a first visit to "/" it reads the browser's Accept-Language and sends French/German visitors to /fr or /de.
 *  - It remembers the visitor's choice in a NEXT_LOCALE cookie, and keeps English URLs prefix-free by rewriting
 *    "/products" to "/en/products" behind the scenes.
 *  - It adds `Link: <...>; rel="alternate"; hreflang="..."` headers so search engines find the other language versions.
 */
export default createMiddleware(routing);

export const config = {
  // Every page, but not API routes, Next.js internals, or files with an extension (images, audio, video, icons, ...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
