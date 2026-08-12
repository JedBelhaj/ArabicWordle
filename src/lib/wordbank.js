import arabicBank from "../../shared/wordbanks/arabic.json";
import englishBank from "../../shared/wordbanks/english.json";

const ARABIC_CANONICAL_ORDER = [
  "ء", "آ", "أ", "ؤ", "إ", "ئ", "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ",
  "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م",
  "ن", "ه", "و", "ى", "ي", "ة",
];

function buildAlphabet(bank, canonicalOrder) {
  const used = new Set();
  for (const words of Object.values(bank)) {
    for (const word of words) {
      for (const ch of word) used.add(ch);
    }
  }
  const ordered = canonicalOrder.filter((ch) => used.has(ch));
  const leftover = [...used].filter((ch) => !canonicalOrder.includes(ch)).sort();
  return [...ordered, ...leftover];
}

const BANKS = { arabic: arabicBank, english: englishBank };

const SETS = Object.fromEntries(
  Object.entries(BANKS).map(([lang, bank]) => [
    lang,
    Object.fromEntries(
      Object.entries(bank).map(([len, words]) => [len, new Set(words)]),
    ),
  ]),
);

export const LANGUAGES = {
  arabic: {
    label: "العربية",
    dir: "rtl",
    alphabet: buildAlphabet(arabicBank, ARABIC_CANONICAL_ORDER),
  },
  english: {
    label: "English",
    dir: "ltr",
    alphabet: "abcdefghijklmnopqrstuvwxyz".split(""),
  },
};

export const WORD_LENGTHS = [3, 4, 5];

export function normalize(language, word) {
  return language === "english" ? word.toLowerCase() : word;
}

export function getRandomWord(language, length) {
  const words = BANKS[language]?.[String(length)];
  if (!words || words.length === 0) return null;
  return words[Math.floor(Math.random() * words.length)];
}

export function isValidWord(language, length, word) {
  const words = SETS[language]?.[String(length)];
  if (!words) return false;
  return words.has(normalize(language, word));
}
