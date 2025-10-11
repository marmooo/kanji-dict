import { expandGlob } from "@std/fs";
import { TextLineStream } from "@std/streams";

// function hasIVS(str) {
//   return /[\u{E0100}-\u{E01EF}]/u.test(str);
// }

const kanjiRegexp = /[\u3400-\u9FFF\uF900-\uFAFF\u{20000}-\u{37FFF}]/gu;

async function parse(dict, filePath) {
  const file = await Deno.open(filePath);
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (let line of lineStream) {
    if (/[a-zA-Z#]/.test(line[0])) continue;
    // ⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻
    if (/[\u2FF0-\u2FFB]/.test(line)) continue;
    line = line.trimEnd();
    const str = Array.from(line);
    let a, b;
    if (str[1] === ",") {
      const arr = line.split(",");
      a = arr[0];
      b = arr[2];
      if (b === "�") continue;
    } else {
      const arr = line.split("\t");
      a = arr[0];
      b = arr.slice(1).filter((char) => char !== "" && !char.startsWith("#"))
        .join("");
      b = b.replace("�", "");
    }

    // remove IVS
    // if (hasIVS(a)) console.log(a);
    a = a.replace(/[\u{E0100}-\u{E01EF}]/gu, "");

    // // consider IVS
    // const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    // b = Array.from(segmenter.segment(b)).map((s) => s.segment);
    // TODO: support IVS
    // remove IVS
    b = b.replace(/[\u{E0100}-\u{E01EF}]/gu, "");
    b = [...b];

    if (!a.match(kanjiRegexp)) continue;
    for (let i = 0; i < b.length; i++) {
      if (a === b[i]) continue;
      if (!b[i].match(kanjiRegexp)) continue;
      const code = b[i].codePointAt(0);
      if (code < Number(0x3400)) continue;
      if (dict.has(a)) {
        dict.get(a).add(b[i]);
      } else {
        dict.set(a, new Set(b[i]));
      }
      if (dict.has(b[i])) {
        dict.get(b[i]).add(a);
      } else {
        dict.set(b[i], new Set(a));
      }
    }
  }
}

function dump(dict) {
  const arr = Array.from(dict).sort((a, b) => a[0].localeCompare(b[0]));
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i][0];
    const b = Array.from(arr[i][1]).join("");
    str += `${a},${b}\n`;
  }
  return str.trimEnd();
}

const filePaths = [
  // "cjkvi-simplified.txt",
  "cjkvi-variants.txt",
  // "duplicate-chars.txt",
  "dypytz-variants.txt",
  "hydzd-borrowed.txt",
  "hydzd-variants.txt",
  "hyogai-variants.txt",
  "jinmei-variants.txt",
  "jisx0212-variants.txt",
  "jisx0213-variants.txt",
  "joyo-variants.txt",
  "jp-borrowed.txt",
  "jp-old-style.txt",
  "koseki-variants.txt",
  "koseki-variants.txt",
  "koseki-variants.txt",
  // "non-cjk.txt",
  "non-cognates.txt",
  "numeric-variants.txt",
  "radical-variants.txt",
  "sawndip-variants.txt",
  "twedu-variants.txt",
  "ucs-scs.txt",
  "x0212-x0213-variants.txt",
];
const dict = new Map();
for (let i = 0; i < filePaths.length; i++) {
  const filePath = `cjkvi-variants/${filePaths[i]}`;
  await parse(dict, filePath);
}
Deno.writeTextFileSync("data/variants.csv", dump(dict));
