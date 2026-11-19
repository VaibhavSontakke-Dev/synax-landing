import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for next/link and next/navigation. Use these instead of the Next.js ones for anything that
 * points at one of our own pages: `<Link href="/products">` becomes `/fr/products` when the visitor is on the French site,
 * and `usePathname()` returns the path WITHOUT the language prefix (so "is this link active?" checks keep working).
 * `notFound` still comes from next/navigation.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
