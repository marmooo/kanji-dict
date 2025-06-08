import { JISCode, JKAT, Kanji, UnicodeStrokes } from "@marmooo/kanji";

function initStrokes() {
  const arr = structuredClone(UnicodeStrokes);
  arr.forEach((list, i) => {
    arr[i] = list.filter((kanji) => {
      if (kanji in jkat.dict) return false;
      if (kanji in jisCode.dict) return false;
      return true;
    });
  });
  return arr;
}

const strokesThreshold = 35;
const jkat = new Kanji(JKAT);
const jisCode = new Kanji(JISCode);
const Strokes = initStrokes();

for (let i = 1; i < strokesThreshold; i++) {
  const dir = `src/画数/${i}画`;
  Deno.mkdirSync(dir, { recursive: true });
  const list = Strokes[i]
    .sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("\n");
  Deno.writeTextFileSync(dir + "/font.lst", list);
}
const dir = `src/画数/${strokesThreshold}画〜`;
Deno.mkdirSync(dir, { recursive: true });
const list = Strokes.slice(strokesThreshold).flat()
  .sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join("\n");
Deno.writeTextFileSync(dir + "/font.lst", list);
