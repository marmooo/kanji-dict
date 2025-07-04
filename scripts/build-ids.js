import { TextLineStream } from "@std/streams";

const dict = {};
const file = await Deno.open("ids/ids_lv0.txt");
const lineStream = file.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());
for await (const line of lineStream) {
  const arr = line.split("\t");
  const kanji = arr[0];
  for (let i = 1; i <= arr.length - 1; i++) {
    const str = arr[i].replace(/[0-9a-zA-Z(){}\-|\[\].:?#\u2FF0-\u2FFB]/gu, "");
    const list = str.split(";");
    for (let j = 0; j < list.length; j++) {
      const ids = (list[j] === "") ? kanji : list[j];
      if (kanji in dict) {
        dict[kanji].add(ids);
      } else {
        dict[kanji] = new Set([ids]);
      }
    }
  }
}
const lines = [];
for (const [kanji, idsSet] of Object.entries(dict)) {
  lines.push(`${kanji},${Array.from(idsSet).join(" ")}`);
}
Deno.writeTextFileSync("data/ids.csv", lines.join("\n"));
