const path = require("path");

const arabicBank = require(path.join(
  __dirname,
  "..",
  "..",
  "shared",
  "wordbanks",
  "arabic.json",
));
const englishBank = require(path.join(
  __dirname,
  "..",
  "..",
  "shared",
  "wordbanks",
  "english.json",
));

// { arabic: { guesses: {3,4,5}, answers: {3,4,5} }, english: { ... } }
const BANKS = { arabic: arabicBank, english: englishBank };

const GUESS_SETS = Object.fromEntries(
  Object.entries(BANKS).map(([lang, bank]) => [
    lang,
    Object.fromEntries(
      Object.entries(bank.guesses).map(([len, words]) => [len, new Set(words)]),
    ),
  ]),
);

const WORD_LENGTHS = [3, 4, 5];
const LANGUAGES = ["arabic", "english"];

function normalize(language, word) {
  return language === "english" ? String(word).toLowerCase() : word;
}

function getRandomWord(language, length) {
  const words = BANKS[language]?.answers?.[String(length)];
  if (!words || words.length === 0) return null;
  return words[Math.floor(Math.random() * words.length)];
}

function isValidWord(language, length, word) {
  const words = GUESS_SETS[language]?.[String(length)];
  if (!words) return false;
  return words.has(normalize(language, word));
}

module.exports = {
  WORD_LENGTHS,
  LANGUAGES,
  normalize,
  getRandomWord,
  isValidWord,
};
