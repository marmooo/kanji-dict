function normalizeFile(fileName) {
  const text = Deno.readTextFileSync(fileName);
  Deno.writeTextFileSync(fileName, text.normalize("NFKC"));
}

// Normalize radical chars, which tends to create unintended bugs.
normalizeFile("data/radicals1.csv");
normalizeFile("data/components.csv");
normalizeFile("scripts/radical-html.js");
normalizeFile("misc/check-radical.js");
normalizeFile("src/index.html");
