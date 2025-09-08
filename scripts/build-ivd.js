import { TextLineStream } from "@std/streams";

const dict = new Map();
const file = await Deno.open("data/IVD_Sequences.txt");
const lineStream = file.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());
for await (const line of lineStream) {
  if (!line || line.startsWith("#")) continue;
  const [hex, ivsString] = line.split(";", 1)[0].split(" ");
  const ivs = ivsString.slice(-2);
  if (ivs === "00") continue;
  const code = parseInt(hex, 16);
  if (dict.has(code)) {
    dict.get(code).add(ivs);
  } else {
    dict.set(code, new Set([ivs]));
  }
}
let totalEntries = 0;
for (const set of dict.values()) {
  const count = set.size;
  totalEntries += count;
}
console.log(`Total IVS entries: ${totalEntries}`);
const csv = [...dict.entries()]
  .sort(([a], [b]) => a - b)
  .map(([code, set]) => [code.toString(16), ...Array.from(set)].join(","))
  .join("\n");
Deno.writeTextFileSync("data/ivd.csv", csv);

const ranges = {
  ExtA: [[0x3400, 0x4DBF]],
  URO1: [[0x4E00, 0x62FF]],
  URO2: [[0x6300, 0x77FF]],
  URO3: [[0x7800, 0x8CFF]],
  URO4: [[0x8D00, 0x9FFF]],
  ExtB: [[0x20000, 0x2A6DF]],
  other: [],
};
for (const [rangeName, rangeList] of Object.entries(ranges)) {
  if (rangeName === "other") {
    const allRanges = Object.values(ranges)
      .filter((r) => r.length > 0)
      .flatMap((r) => r);
    const otherFiltered = Array.from(dict.entries()).filter(([code]) =>
      !allRanges.some(([start, end]) => code >= start && code <= end)
    ).sort(([a], [b]) => a - b);
    if (0 < otherFiltered.length) {
      const csv = otherFiltered
        .map(([code, set]) => {
          const hex = code.toString(16).toUpperCase();
          return [hex, ...Array.from(set)].join(",");
        }).join("\n");
      Deno.writeTextFileSync(`src/ivd/${rangeName}.csv`, csv);
      let totalCount = 0;
      for (const [, ivsSet] of otherFiltered) {
        totalCount += ivsSet.size;
      }
      console.log(`Write src/ivd/${rangeName}.csv (${totalCount} entries)`);
    }
    continue;
  }
  const filtered = Array.from(dict.entries()).filter(([code]) =>
    rangeList.some(([start, end]) => code >= start && code <= end)
  ).sort(([a], [b]) => a - b);
  if (filtered.length > 0) {
    const csv = filtered.map(([code, set]) => {
      const hex = code.toString(16).toUpperCase();
      return [hex, ...Array.from(set)].join(",");
    }).join("\n");
    Deno.writeTextFileSync(`src/ivd/${rangeName}.csv`, csv);
    let totalCount = 0;
    for (const [, ivsSet] of filtered) {
      totalCount += ivsSet.size;
    }
    console.log(`Write src/ivd/${rangeName}.csv (${totalCount} entries)`);
  }
}
