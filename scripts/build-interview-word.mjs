import { readFileSync, writeFileSync } from "node:fs";

const inputPath = new URL("../INTERVIEW_PREP.md", import.meta.url);
const outputPath = new URL("../HR1_INTERVIEW_PREP.rtf", import.meta.url);
const textOutputPath = new URL("../HR1_INTERVIEW_PREP_COPY.txt", import.meta.url);
const attOutputPath = new URL("../ATT_AI_IMMERSIVE_COACH_INTERVIEW_PACKET.rtf", import.meta.url);
const attTextOutputPath = new URL("../ATT_AI_IMMERSIVE_COACH_INTERVIEW_PACKET.txt", import.meta.url);
const markdown = readFileSync(inputPath, "utf8");

function rtfEscape(value) {
  let result = "";
  for (const character of value) {
    if (character === "\\" || character === "{" || character === "}") {
      result += `\\${character}`;
      continue;
    }
    const codePoint = character.codePointAt(0);
    if (codePoint >= 32 && codePoint <= 126) {
      result += character;
      continue;
    }
    if (codePoint <= 0xffff) {
      result += `\\u${codePoint > 32767 ? codePoint - 65536 : codePoint}?`;
      continue;
    }
    const adjusted = codePoint - 0x10000;
    const high = 0xd800 + (adjusted >> 10);
    const low = 0xdc00 + (adjusted & 0x3ff);
    result += `\\u${high - 65536}?\\u${low - 65536}?`;
  }
  return result;
}

function cleanInline(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s?/, "");
}

const body = [];
let inCode = false;
let inTable = false;

for (const rawLine of markdown.split(/\r?\n/)) {
  if (rawLine.startsWith("```")) {
    inCode = !inCode;
    body.push("\\pard\\sa80\\par");
    continue;
  }
  if (inCode) {
    body.push(`\\pard\\li360\\sa20\\f1\\fs18 ${rtfEscape(rawLine || " ")}\\par`);
    continue;
  }
  const heading = rawLine.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    const level = heading[1].length;
    const size = level === 1 ? 34 : level === 2 ? 27 : 23;
    const before = level === 1 ? 240 : 180;
    body.push(`\\pard\\sb${before}\\sa100\\b\\f0\\fs${size} ${rtfEscape(cleanInline(heading[2]))}\\b0\\par`);
    inTable = false;
    continue;
  }
  if (/^\|.*\|$/.test(rawLine)) {
    if (/^\|?\s*:?-{3,}/.test(rawLine)) continue;
    const cells = rawLine.split("|").slice(1, -1).map((cell) => cleanInline(cell.trim()));
    const row = cells.join("    |    ");
    body.push(`\\pard\\li180\\sa45\\f0\\fs18 ${rtfEscape(row)}\\par`);
    inTable = true;
    continue;
  }
  if (inTable && rawLine.trim() === "") {
    body.push("\\pard\\sa80\\par");
    inTable = false;
    continue;
  }
  const bullet = rawLine.match(/^\s*-\s+(.+)$/);
  if (bullet) {
    body.push(`\\pard\\li540\\fi-240\\sa55\\f0\\fs21 \\u8226?\\tab ${rtfEscape(cleanInline(bullet[1]))}\\par`);
    continue;
  }
  const numbered = rawLine.match(/^\s*(\d+)\.\s+(.+)$/);
  if (numbered) {
    body.push(`\\pard\\li540\\fi-300\\sa55\\f0\\fs21 ${numbered[1]}.\\tab ${rtfEscape(cleanInline(numbered[2]))}\\par`);
    continue;
  }
  if (rawLine.trim() === "") {
    body.push("\\pard\\sa70\\par");
    continue;
  }
  body.push(`\\pard\\sa80\\sl276\\slmult1\\f0\\fs21 ${rtfEscape(cleanInline(rawLine))}\\par`);
}

const document = [
  "{\\rtf1\\ansi\\deff0",
  "{\\fonttbl{\\f0 Calibri;}{\\f1 Consolas;}}",
  "\\viewkind4\\uc1\\paperw12240\\paperh15840\\margl1080\\margr1080\\margt900\\margb900",
  ...body,
  "}",
].join("\n");

writeFileSync(outputPath, document, "utf8");
writeFileSync(textOutputPath, markdown, "utf8");
writeFileSync(attOutputPath, document, "utf8");
writeFileSync(attTextOutputPath, markdown, "utf8");
console.log("Built HR1 and AT&T interview packets in Word-compatible RTF and plain text");
