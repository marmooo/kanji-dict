function normalizeFile(fileName) {
  const text = Deno.readTextFileSync(fileName);
  const normalized = text.replace(/[\u2F00-\u2FDF]/g, (match) => {
    return match.normalize("NFKC");
  });
  Deno.writeTextFileSync(fileName, normalized);
}

// Normalize radical chars, which tends to create unintended bugs.
normalizeFile("data/radicals1.csv");
normalizeFile("data/components.csv");
normalizeFile("scripts/radical-html.js");
normalizeFile("scripts/radical-list.js");
normalizeFile("scripts/radical-ttf2svg.js");
normalizeFile("scripts/radical-svg2woff2.js");
normalizeFile("misc/check-radical.js");
normalizeFile("src/index.html");
