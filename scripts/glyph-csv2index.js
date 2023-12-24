function getIndex(filePath) {
  const csv = Deno.readTextFileSync(filePath) + "\n";
  const matches = [...csv.matchAll(/\n/g)];
  const encoder = new TextEncoder("utf-8");
  const tmp = matches.map((match, i) => {
    if (i > 0) {
      const from = matches[i - 1].index;
      const to = match.index;
      return encoder.encode(csv.slice(from, to)).length;
    } else {
      return encoder.encode(csv.slice(0, match.index)).length;
    }
  });
  const arr = [0].concat(tmp);
  const blob = new Uint8Array(new Uint16Array(arr).buffer);
  Deno.writeFileSync(`${filePath}.idx`, blob);
  console.log(filePath, Math.max(...arr));
}

getIndex("src/glyph/URO1.csv");
getIndex("src/glyph/URO2.csv");
getIndex("src/glyph/URO3.csv");
getIndex("src/glyph/URO4.csv");
getIndex("src/glyph/CI.csv");
getIndex("src/glyph/CIS.csv");
getIndex("src/glyph/ExtA.csv");
getIndex("src/glyph/ExtB1.csv");
getIndex("src/glyph/ExtB2.csv");
getIndex("src/glyph/ExtB3.csv");
getIndex("src/glyph/ExtB4.csv");
getIndex("src/glyph/ExtB5.csv");
getIndex("src/glyph/ExtB6.csv");
getIndex("src/glyph/ExtB7.csv");
getIndex("src/glyph/ExtC.csv");
getIndex("src/glyph/ExtD.csv");
getIndex("src/glyph/ExtE.csv");
getIndex("src/glyph/ExtF.csv");
getIndex("src/glyph/ExtG.csv");
getIndex("src/glyph/ExtH.csv");
getIndex("src/glyph/ExtI.csv");
