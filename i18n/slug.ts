/**
 * Turns an English name into a stable message key: "Gate entry, GRN & store inward" -> "gate-entry-grn-store-inward".
 *
 * Some words are used on several pages (module names, FAQ questions). They are translated once in messages/*.json, under a key
 * made with this function, and each page looks the translation up with `t(slug(name))`. The data files keep the English
 * name as the identity; the displayed words come from the message files.
 */
export const slug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
