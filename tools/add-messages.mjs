// Merges new messages into messages/en.json, fr.json and de.json from one compact file of triples.
// usage: node tools/add-messages.mjs <file.mjs>
// The file must `export default { Namespace: { key: [english, french, german], nested: { key: [en, fr, de] } } }`.
// Existing keys are overwritten, so the script can be re-run safely. Key order inside each file is kept (new keys at the end).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "messages");
const langs = ["en", "fr", "de"];
const src = (await import(pathToFileURL(path.resolve(process.argv[2])).href)).default;
const set = (target, node, i) => {
  for (const [k, v] of Object.entries(node)) {
    if (Array.isArray(v)) {
      if (v.length !== 3 || v.some((s) => typeof s !== "string")) throw new Error(`${k}: needs [en, fr, de] strings`);
      target[k] = v[i];
    } else {
      target[k] = target[k] && typeof target[k] === "object" ? target[k] : {};
      set(target[k], v, i);
    }
  }
};
langs.forEach((l, i) => {
  const f = path.join(root, `${l}.json`);
  const json = JSON.parse(fs.readFileSync(f, "utf8"));
  set(json, src, i);
  fs.writeFileSync(f, JSON.stringify(json, null, 2) + "\n");
});
console.log("messages updated:", Object.keys(src).join(", "));
