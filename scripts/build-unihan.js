import { TextLineStream } from "@std/streams";

function unicodeToChar(unicodeStr) {
  const hex = unicodeStr.slice(2).split("<")[0];
  return String.fromCodePoint(parseInt(hex, 16));
}

const dict = {};
const keys = [
  "kSemanticVariant", // Unihan_Variants.txt
  "kSimplifiedVariant",
  "kSpecializedSemanticVariant",
  "kSpoofingVariant",
  "kTraditionalVariant",
  "kZVariant",
  "kCompatibilityVariant", // Unihan_IRGSources.txt
  "kDefinition", // Unihan_Readings.txt
  "kJapanese",
  "kJapaneseOn",
  "kJapaneseKun",
  "kMandarin",
  "kCantonese", 
  "kHangul",
  "kKorean",
  "kVietnamese",
  // "kFanqie",
  // "kHanyuPinlu",
  // "kHanyuPinyin",
  // "kSMSZD2003Readings",
  // "kTang",
  // "kTGHZ2013",
  // "kXHC1983",
  // "kZhuang",
];
const filePaths = [
  "data/Unihan/Unihan_Variants.txt",
  "data/Unihan/Unihan_IRGSources.txt",
];
for (const filePath of filePaths) {
  const file = await Deno.open(filePath);
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    if (!line.startsWith("U")) continue;
    const [fromCode, type, toCodes] = line.split("\t");
    const index = keys.indexOf(type);
    if (index === -1) continue;
    const fromKanji = unicodeToChar(fromCode);
    const toKanjis = toCodes
      .split(" ").map((toCode) => unicodeToChar(toCode))
      .join("").replace(new RegExp(fromKanji, "g"), "");
    if (fromKanji in dict === false) {
      const dataArray = new Array(keys.length);
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = "";
      }
      dict[fromKanji] = dataArray;
    }
    dict[fromKanji][index] += toKanjis;
  }
}

const file = await Deno.open("data/Unihan/Unihan_Readings.txt");
const lineStream = file.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());
for await (const line of lineStream) {
  if (!line.startsWith("U")) continue;
  const [fromCode, type, readings] = line.split("\t");
  const index = keys.indexOf(type);
    if (index === -1) continue;
  const fromKanji = unicodeToChar(fromCode);
  if (fromKanji in dict === false) {
    const dataArray = new Array(keys.length);
    for (let i = 0; i < dataArray.length; i++) {
      dataArray[i] = "";
    }
    dict[fromKanji] = dataArray;
  }
  dict[fromKanji][index] = readings;
}

const lines = [];
for (const [kanji, dataArray] of Object.entries(dict)) {
  lines.push(`${kanji}\t${dataArray.join("\t")}`);
}
Deno.writeTextFileSync("data/unihan.tsv", lines.join("\n"));
