function getIndex(filePath) {
  const tsv = Deno.readTextFileSync(filePath) + "\n";
  const matches = [...tsv.matchAll(/\n/g)];
  const encoder = new TextEncoder("utf-8");
  const tmp = matches.map((match, i) => {
    if (i > 0) {
      const from = matches[i - 1].index;
      const to = match.index;
      return encoder.encode(tsv.slice(from, to)).length;
    } else {
      return encoder.encode(tsv.slice(0, match.index + 1)).length;
    }
  });
  const arr = [0].concat(tmp);
  const blob = new Uint8Array(new Uint16Array(arr).buffer);
  Deno.writeFileSync(`${filePath}.idx`, blob);
  console.log(filePath, Math.max(...arr));
}

getIndex("src/glyph/URO1.tsv");
getIndex("src/glyph/URO2.tsv");
getIndex("src/glyph/URO3.tsv");
getIndex("src/glyph/URO4.tsv");
getIndex("src/glyph/CI.tsv");
getIndex("src/glyph/CIS.tsv");
getIndex("src/glyph/ExtA.tsv");
getIndex("src/glyph/ExtB1.tsv");
getIndex("src/glyph/ExtB2.tsv");
getIndex("src/glyph/ExtB3.tsv");
getIndex("src/glyph/ExtB4.tsv");
getIndex("src/glyph/ExtB5.tsv");
getIndex("src/glyph/ExtB6.tsv");
getIndex("src/glyph/ExtB7.tsv");
getIndex("src/glyph/ExtC.tsv");
getIndex("src/glyph/ExtD.tsv");
getIndex("src/glyph/ExtE.tsv");
getIndex("src/glyph/ExtF.tsv");
getIndex("src/glyph/ExtG.tsv");
getIndex("src/glyph/ExtH.tsv");
getIndex("src/glyph/ExtI.tsv");
getIndex("src/glyph/ExtJ.tsv");
