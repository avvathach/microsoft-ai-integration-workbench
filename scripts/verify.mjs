import { readFileSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] || ".";
const html = readFileSync(join(base, "index.html"), "utf8");
const script = readFileSync(join(base, "app.js"), "utf8");
const styles = readFileSync(join(base, "styles.css"), "utf8");
const combined = `${html}\n${script}\n${styles}`;

const required = [
  "Microsoft AI Applications Integration Workbench",
  "SIS Data Reconciliation",
  "System of record remains authoritative",
  "AI never independently changes institutional records",
  "See how it works technically",
  'id="business"',
  'id="sources"',
  'id="technical"',
  'id="review"',
  'id="audit"',
];

const forbidden = [
  /Microsoft-ready MVP/i,
  /Graph write/i,
  /Houston City College.*(?:migrat|transition).*(?:PeopleSoft|Banner)/i,
  new RegExp(`[${String.fromCodePoint(0x2013)}${String.fromCodePoint(0x2014)}]`),
];

const missing = required.filter((value) => !combined.includes(value));
const violations = forbidden.filter((pattern) => pattern.test(combined));

if (missing.length || violations.length) {
  if (missing.length) console.error(`Missing required content: ${missing.join(", ")}`);
  if (violations.length) console.error(`Found prohibited language: ${violations.join(", ")}`);
  process.exit(1);
}

console.log(`Verified ${base === "." ? "source" : base} content and positioning.`);
