// Checks that messages/en.json, fr.json and de.json have exactly the same keys and the same {placeholders} and <tags>.
// usage: node tools/check-messages.mjs     (exit code 1 when something differs; run it before every release)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "messages");
const langs = ["en", "fr", "de"];
const files = Object.fromEntries(langs.map((l) => [l, JSON.parse(fs.readFileSync(path.join(dir, `${l}.json`), "utf8"))]));

const flat = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === "object" ? flat(v, `${prefix}${k}.`) : [[`${prefix}${k}`, String(v)]]));
const maps = Object.fromEntries(langs.map((l) => [l, new Map(flat(files[l]))]));

// {name}, {count, plural, ...} -> "name", "count"; <b>, <link> -> tag names
const placeholders = (s) => [...new Set([...s.matchAll(/\{\s*([a-zA-Z0-9_]+)/g)].map((m) => `{${m[1]}}`))].sort().join(" ");
const tags = (s) => [...new Set([...s.matchAll(/<\/?([a-zA-Z0-9]+)>/g)].map((m) => `<${m[1]}>`))].sort().join(" ");

let problems = 0;
const report = (msg) => {
  problems++;
  console.log("  -", msg);
};
const all = new Set(langs.flatMap((l) => [...maps[l].keys()]));
for (const key of [...all].sort()) {
  for (const l of langs) if (!maps[l].has(key)) report(`${l}: missing key ${key}`);
  const en = maps.en.get(key);
  if (en === undefined) continue;
  // In ICU message format a straight apostrophe next to { } < > starts a quoted (literal) section, so "l'<b>IA</b>" shows the tags as text.
  // Use the typographic apostrophe (’) in front of a tag or placeholder, or double the straight one.
  for (const l of langs) {
    const text = maps[l].get(key);
    if (typeof text === "string" && /'[<>{}]|[<>{}]'/.test(text.replace(/''/g, ""))) report(`${l}: straight apostrophe next to a tag or placeholder in ${key} (use ’ or '')`);
  }
  for (const l of ["fr", "de"]) {
    const v = maps[l].get(key);
    if (v === undefined) continue;
    if (v.trim() === "") report(`${l}: empty ${key}`);
    if (placeholders(v) !== placeholders(en)) report(`${l}: placeholders differ in ${key} (en "${placeholders(en)}" vs "${placeholders(v)}")`);
    if (tags(v) !== tags(en)) report(`${l}: tags differ in ${key} (en "${tags(en)}" vs "${tags(v)}")`);
  }
}
console.log(`${all.size} keys checked in ${langs.join(", ")}: ${problems === 0 ? "all consistent" : problems + " problem(s)"}`);
process.exit(problems === 0 ? 0 : 1);
