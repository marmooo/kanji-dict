import { basename } from "https://deno.land/std/path/mod.ts";
import { expandGlobSync } from "https://deno.land/std/fs/expand_glob.ts";
import { parse } from "node-html-parser";

function checkElementError() {
  const db = {};
  for (const file of expandGlobSync("kanjivg/*.svg")) {
    const name = basename(file.path).split(".")[0];
    if (name.includes("-")) continue;
    const code = Number("0x" + name);
    const kanji = String.fromCharCode(code);
    const svg = Deno.readTextFileSync(file.path);
    const doc = parse(svg.replaceAll(/kvg:/g, ""));
    const nodes = doc.querySelectorAll(`[radical]`);
    if (nodes.length == 0) continue;
    const targetNode = nodes.filter((node) => {
      switch (node.getAttribute("radical")) {
        case "general":
        case "tradit":
          return true;
        default:
          return false;
      }
    })[0];
    const original = targetNode.getAttribute("original") ?? "";
    const element = targetNode.getAttribute("element");
    const component = original ?? element;
    if (element in db) {
      if (db[element] != component) {
        console.log(
          `error: ${name}, ${kanji}, ${element}, ${db[element]}, ${component}`,
        );
        db[element];
      }
    } else {
      db[element] = component;
    }
  }
}

function initComponentDB() {
  const dict = {};
  const csv = Deno.readTextFileSync("kanjivg-components.csv");
  csv.trimEnd().split("\n").forEach((line) => {
    const [component, componentYomi, element, yomi, position] = line.split(",");
    const info = { component, componentYomi, element, yomi };
    if (element in dict === false) {
      dict[element] = {};
    }
    dict[element][position] = info;
  });
  return dict;
}

function fixRadical(original, element) {
  if (element == "月" && original == "肉") return "肉";
  return element;
}

function build() {
  const result = [];
  checkElementError();
  const db = initComponentDB();
  for (const file of expandGlobSync("kanjivg/*.svg")) {
    const name = basename(file.path).split(".")[0];
    if (name.includes("-")) continue;
    const code = Number("0x" + name);
    const kanji = String.fromCharCode(code);
    const svg = Deno.readTextFileSync(file.path);
    const doc = parse(svg.replaceAll(/kvg:/g, ""));
    const nodes = doc.querySelectorAll(`[radical]`);
    if (nodes.length == 0) continue;
    const targetNode = nodes.filter((node) => {
      switch (node.getAttribute("radical")) {
        case "general":
        case "tradit":
          return true;
        default:
          return false;
      }
    })[0];
    const original = targetNode.getAttribute("original") ?? "";
    const element = targetNode.getAttribute("element");
    const position = targetNode.getAttribute("position") ?? "";
    const radical = fixRadical(original, element);
    const candidate = db[radical];
    if (!candidate) {
      console.log(`error: ${name}, ${kanji}, ${element}`);
      continue;
    }
    const info = candidate[position] ?? candidate[""];
    result.push([kanji, ...Object.values(info)]);
  }
  Deno.writeTextFileSync("kanjivg-radicals.csv", result.join("\n"));
}

build();
