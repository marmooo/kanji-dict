import { expandGlob } from "@std/fs";
import { TextLineStream } from "@std/streams";

// function hasIVS(str) {
//   return /[\u{E0100}-\u{E01EF}]/u.test(str);
// }

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

    for (let i = 0; i < b.length; i++) {
      if (a === b[i]) continue;
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

const dict = new Map();
for await (const file of expandGlob("cjkvi-variants/*.txt")) {
  await parse(dict, file.path);
}
Deno.writeTextFileSync("data/variants.csv", dump(dict));
