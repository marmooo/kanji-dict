function getIndex(filePath) {
  const svg = Deno.readTextFileSync(filePath);
  const matches = [...svg.matchAll(/<glyph[^\/>]*\/>/g)];
  const encoder = new TextEncoder("utf-8");
  const arr = matches.map((match, i) => {
    if (i > 0) {
      const from = matches[i - 1].index;
      const to = match.index;
      return encoder.encode(svg.slice(from, to)).length;
    } else {
      return encoder.encode(svg.slice(0, match.index)).length;
    }
  });
  const from = matches.at(-1).index;
  const to = from + matches.at(-1)[0].length;
  const last = encoder.encode(svg.slice(from, to)).length;
  arr.push(last);
  const blob = new Uint8Array(new Uint16Array(arr).buffer);
  Deno.writeFileSync(`${filePath}.idx`, blob);
  console.log(filePath, Math.max(...arr));
}

getIndex("src/glyph/URO1.svg");
getIndex("src/glyph/URO2.svg");
getIndex("src/glyph/URO3.svg");
getIndex("src/glyph/URO4.svg");
getIndex("src/glyph/CI.svg");
getIndex("src/glyph/CIS.svg");
getIndex("src/glyph/ExtA.svg");
getIndex("src/glyph/ExtB1.svg");
getIndex("src/glyph/ExtB2.svg");
getIndex("src/glyph/ExtB3.svg");
getIndex("src/glyph/ExtB4.svg");
getIndex("src/glyph/ExtB5.svg");
getIndex("src/glyph/ExtB6.svg");
getIndex("src/glyph/ExtB7.svg");
getIndex("src/glyph/ExtC.svg");
getIndex("src/glyph/ExtD.svg");
getIndex("src/glyph/ExtE.svg");
getIndex("src/glyph/ExtF.svg");
getIndex("src/glyph/ExtG.svg");
getIndex("src/glyph/ExtH.svg");
getIndex("src/glyph/ExtI.svg");
