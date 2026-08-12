// One-off data prep: turns the raw Arabic word list + the `word-list` npm
// package into clean, deduped, length-bucketed JSON dictionaries that both
// the frontend and backend read at runtime. Run with: node scripts/build-wordbanks.js
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import englishWordListPath from "word-list";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "shared", "wordbanks");
const LENGTHS = [3, 4, 5];

// Arabic diacritics (tashkeel/tanwin), superscript alef, and tatweel.
const DIACRITICS_RE = /[ً-ْٰـ]/g;
// Only accept lines made purely of Arabic letters (after diacritics are stripped).
const ARABIC_LETTERS_RE = /^[ء-ي]+$/;

function buildArabicWordbank() {
  const raw = readFileSync(
    path.join(__dirname, "..", "src", "assets", "arabic_words_5_letters.txt"),
    "utf8",
  );
  const byLength = Object.fromEntries(LENGTHS.map((n) => [n, new Set()]));

  for (const line of raw.split(/\r?\n/)) {
    const stripped = line.trim().replace(DIACRITICS_RE, "");
    if (!stripped || !ARABIC_LETTERS_RE.test(stripped)) continue;
    if (byLength[stripped.length]) byLength[stripped.length].add(stripped);
  }

  return Object.fromEntries(
    LENGTHS.map((n) => [String(n), [...byLength[n]].sort()]),
  );
}

function buildEnglishWordbank() {
  const raw = readFileSync(englishWordListPath, "utf8");
  const byLength = Object.fromEntries(LENGTHS.map((n) => [n, new Set()]));

  for (const line of raw.split("\n")) {
    const word = line.trim().toLowerCase();
    if (!word || !/^[a-z]+$/.test(word)) continue;
    if (byLength[word.length]) byLength[word.length].add(word);
  }

  return Object.fromEntries(
    LENGTHS.map((n) => [String(n), [...byLength[n]].sort()]),
  );
}

const arabic = buildArabicWordbank();
const english = buildEnglishWordbank();

writeFileSync(
  path.join(OUT_DIR, "arabic.json"),
  JSON.stringify(arabic),
);
writeFileSync(
  path.join(OUT_DIR, "english.json"),
  JSON.stringify(english),
);

for (const [lang, bank] of [["arabic", arabic], ["english", english]]) {
  const counts = LENGTHS.map((n) => `${n}:${bank[n].length}`).join(", ");
  console.log(`${lang} -> ${counts}`);
}
