// One-off data prep: builds clean, deduped, length-bucketed JSON dictionaries
// that both the frontend and backend read at runtime. Each language gets two
// pools: `guesses` (broad — anything acceptable as an input) and `answers`
// (a curated common-word subset — what actually gets picked as the goal, so
// players don't get stuck guessing against obscure dictionary entries).
// Run with: node scripts/build-wordbanks.js
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import englishWordListPath from "word-list";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "shared", "wordbanks");
const LENGTHS = [3, 4, 5];
const COMMON_WORDS_DIR = path.join(
  __dirname,
  "..",
  "node_modules",
  "most-common-words-by-language",
  "build",
  "resources",
);

// Arabic diacritics (tashkeel/tanwin), superscript alef, and tatweel.
const DIACRITICS_RE = /[ً-ْٰـ]/g;
// Only accept lines made purely of Arabic letters (after diacritics are stripped).
const ARABIC_LETTERS_RE = /^[ء-ي]+$/;

function bucketByLength(words) {
  const byLength = Object.fromEntries(LENGTHS.map((n) => [n, new Set()]));
  for (const word of words) {
    if (byLength[word.length]) byLength[word.length].add(word);
  }
  return Object.fromEntries(
    LENGTHS.map((n) => [String(n), [...byLength[n]].sort()]),
  );
}

function buildArabicGuesses() {
  const raw = readFileSync(
    path.join(__dirname, "..", "src", "assets", "arabic_words_5_letters.txt"),
    "utf8",
  );
  const words = raw
    .split(/\r?\n/)
    .map((line) => line.trim().replace(DIACRITICS_RE, ""))
    .filter((w) => w && ARABIC_LETTERS_RE.test(w));
  return bucketByLength(words);
}

function buildEnglishGuesses() {
  const raw = readFileSync(englishWordListPath, "utf8");
  const words = raw
    .split("\n")
    .map((line) => line.trim().toLowerCase())
    .filter((w) => w && /^[a-z]+$/.test(w));
  return bucketByLength(words);
}

function buildAnswers(guesses, commonWords, { stripArabicAl = false } = {}) {
  const guessSets = Object.fromEntries(
    LENGTHS.map((n) => [n, new Set(guesses[String(n)])]),
  );
  const seenByLength = Object.fromEntries(LENGTHS.map((n) => [n, new Set()]));

  for (const raw of commonWords) {
    let word = raw;
    if (stripArabicAl) word = word.replace(DIACRITICS_RE, "");
    if (stripArabicAl && word.startsWith("ال") && word.length > 2) {
      word = word.slice(2);
    }
    const len = word.length;
    if (!guessSets[len]) continue;
    if (guessSets[len].has(word)) seenByLength[len].add(word);
  }

  return Object.fromEntries(
    LENGTHS.map((n) => [String(n), [...seenByLength[n]].sort()]),
  );
}

function readCommonWords(language) {
  return readFileSync(path.join(COMMON_WORDS_DIR, `${language}.txt`), "utf8")
    .split("\n")
    .map((w) => w.trim())
    .filter(Boolean);
}

const arabicGuesses = buildArabicGuesses();
const englishGuesses = buildEnglishGuesses();

const arabic = {
  guesses: arabicGuesses,
  answers: buildAnswers(arabicGuesses, readCommonWords("arabic"), {
    stripArabicAl: true,
  }),
};
const english = {
  guesses: englishGuesses,
  answers: buildAnswers(
    englishGuesses,
    readCommonWords("english").map((w) => w.toLowerCase()),
  ),
};

writeFileSync(path.join(OUT_DIR, "arabic.json"), JSON.stringify(arabic));
writeFileSync(path.join(OUT_DIR, "english.json"), JSON.stringify(english));

for (const [lang, bank] of [["arabic", arabic], ["english", english]]) {
  const guessCounts = LENGTHS.map((n) => `${n}:${bank.guesses[n].length}`).join(", ");
  const answerCounts = LENGTHS.map((n) => `${n}:${bank.answers[n].length}`).join(", ");
  console.log(`${lang} guesses -> ${guessCounts}`);
  console.log(`${lang} answers -> ${answerCounts}`);
}
