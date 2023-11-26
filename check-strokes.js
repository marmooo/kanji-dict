import { TextLineStream } from "https://deno.land/std/streams/mod.ts";
import { basename } from "https://deno.land/std/path/mod.ts";
import { expandGlobSync } from "https://deno.land/std/fs/expand_glob.ts";
import { parse } from "npm:node-html-parser@6.1.11";
import { Kanji, JKAT } from "../kanji/src/mod.js";

// https://github.com/KanjiVG/kanjivg
// perfect quality
function kanjivg(codeDB) {
  const dict = {};
  for (const file of expandGlobSync("kanjivg/kanji/*.svg")) {
    const name = basename(file.path).split(".")[0];
    if (name.includes("-")) continue;
    const code = Number("0x" + name);
    const kanji = String.fromCharCode(code);
    if (kanji in codeDB.dict === false) continue;

    const svg = Deno.readTextFileSync(file.path);
    const doc = parse(svg);
    const node = doc.querySelector(`[id=kvg:StrokeNumbers_${name}]`);
    const strokes = node.querySelectorAll("*").length;
    dict[kanji] = strokes;
  }
  return dict;
}

// https://github.com/parsimonhi/animCJK
// perfect quality
function animCJK(codeDB) {
  const dict = {};
  for (const file of expandGlobSync("animCJK/svgsJa/*.svg")) {
    const code = basename(file.path).split(".")[0];
    const kanji = String.fromCharCode(code);
    if (kanji in codeDB.dict === false) continue;

    const svg = Deno.readTextFileSync(file.path);
    const doc = parse(svg);
    const nodes = doc.querySelectorAll(`clippath`);
    const strokes = nodes.map((node) => {
      const id = node.getAttribute("id");
      return Number(id.split("c")[1]);
    });
    dict[kanji] = Math.max(...strokes);
  }
  return dict;
}

// http://ja.linkdata.org/work/rdf1s3597i/Joyo_Kanji.html
// perfect quality
function joyoKanji(codeDB) {
  const dict = {};
  const text = Deno.readTextFileSync("Joyo_Kanji.txt");
  const lines = text.trim().split("\n").slice(10);
  for (const line of lines) {
    const arr = line.split("\t");
    const kanji = arr[1];
    const strokes = Number(arr[3]);
    if (kanji in codeDB.dict === false) continue;
    dict[kanji] = strokes;
  }
  return dict;
}

// https://mojikiban.ipa.go.jp/search/help/api
// good quality
function mojikiban(codeDB) {
  const dict = {};
  const json = Deno.readTextFileSync("mojikiban.json");
  const data = JSON.parse(json);
  for (const [_kanji, info] of Object.entries(data)) {
    const results = info[1]["results"];
    if (!results) continue;
    const newResults = results.filter((result) => {
      const compat = result["UCS"]["対応する互換漢字"];
      if (compat) {
        const code = Number("0x" + compat.slice(2));
        const compatKanji = String.fromCodePoint(code);
        const compatResult = structuredClone(result);
        if (compatKanji in data) {
          data[compatKanji][1]["results"].push(compatResult);
        } else {
          data[compatKanji] = [compatKanji, { results: [compatResult] }];
        }
        return false;
      } else {
        if (result["入管正字コード"] != "") {
          return true;
        } else {
          return false;
        }
      }
    });
    info[1]["results"] = newResults;
  }
  for (const [kanji, info] of Object.entries(data)) {
    if (kanji in codeDB.dict === false) continue;
    const results = info[1]["results"];
    if (!results) continue;
    for (const result of results) {
      const strokes = Number(result["総画数"]);
      dict[kanji] = strokes;
    }
  }
  return dict;
}


// https://github.com/cjkvi/cjkvi-ids
// middle quality
async function cjkvi(codeDB) {
  const dict = {};
  const file = await Deno.open("cjkvi-ids/ucs-strokes.txt");
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    const [_codeStr, kanji, strokesStr] = line.split("\t");
    if (kanji in codeDB.dict === false) continue;

    const strokes = Number(strokesStr.split(",")[0]);
    dict[kanji] = strokes;
  }
  return dict;
}

// https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
// middle quality
async function unihanIRGSources(codeDB) {
  const dict = {};
  const file = await Deno.open("Unihan/Unihan_IRGSources.txt");
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    if (line.startsWith("#")) continue;
    const [codeStr, func, strokesStr] = line.split("\t");
    if (func != "kTotalStrokes") continue;
    const code = Number("0x" + codeStr.slice(2));
    const kanji = String.fromCodePoint(code);
    if (kanji in codeDB.dict === false) continue;
    const strokes = Number(strokesStr);
    dict[kanji] = strokes;
  }
  return dict;
}

// https://www.unicode.org/Public/UCD/latest/ucdxml/ucd.unihan.flat.zip
// poor quality
async function unihanXML(codeDB) {
  const dict = {};
  const file = await Deno.open("ucd.unihan.flat.xml");
  const lineStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  for await (const line of lineStream) {
    const doc = parse(line);
    const char = doc.querySelector("char");
    if (!char) continue;
    const code = Number("0x" + char.getAttribute("cp"));
    const kanji = String.fromCharCode(code);
    if (kanji in codeDB.dict === false) continue;

    const strokes = Number(char.getAttribute("kTotalStrokes"));
    dict[kanji] = strokes;
  }
  return dict;
}

function checkDiff(name, dict1, dict2, showDetails=false) {
  let count = 0;
  for (const [k1, v1] of Object.entries(dict1)) {
    if (k1 in dict2) {
      const v2 = dict2[k1];
      if (v1 != v2) {
        if (showDetails) {
          console.log(`${k1}: ${v1}, ${v2}`);
        }
        count += 1;
      }
    } else {
      if (showDetails) {
        console.log(`${k1}: ${v1}, -1`);
      }
      count += 1;
    }
  }
  console.log(`diff ${name}: ${count}`);
}

const codeDB = new Kanji(JKAT.slice(0, 10));
const num = Object.keys(codeDB.dict).length;
console.log(`check ${num} kanjis:`);
const kanjivgStrokes = kanjivg(codeDB);
const animCJKStrokes = animCJK(codeDB);
const joyoKanjiStrokes = joyoKanji(codeDB);
const mojikibanStrokes = mojikiban(codeDB);
const cjkviStrokes = await cjkvi(codeDB);
const unihanIRGSourcesStrokes = await unihanIRGSources(codeDB);
const unihanStrokes = await unihanXML(codeDB);
checkDiff("animCJK", kanjivgStrokes, animCJKStrokes);
checkDiff("joyoKanji", kanjivgStrokes, joyoKanjiStrokes);
checkDiff("mojikiban", kanjivgStrokes, mojikibanStrokes, true);
checkDiff("cjkvi", kanjivgStrokes, cjkviStrokes);
checkDiff("unihanIRGSources", kanjivgStrokes, unihanIRGSourcesStrokes);
checkDiff("unihanXML", kanjivgStrokes, unihanStrokes);
