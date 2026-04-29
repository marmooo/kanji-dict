import { ttf2svgFont } from "@marmooo/ttf2svg";
// import { minify } from "@tdewolff/minify";

export async function minify(_mimeType, svg) {
  const command = new Deno.Command("minify", {
    args: ["--type", "svg"],
    stdin: "piped",
    stdout: "piped",
    stderr: "inherit",
  });
  const child = command.spawn();
  const writer = child.stdin.getWriter();
  await writer.write(new TextEncoder().encode(svg));
  await writer.close();
  const { code, stdout } = await child.output();
  if (code !== 0) {
    throw new Error("minify failed");
  }
  return new TextDecoder().decode(stdout);
}

function range(start, end) {
  const len = end - start;
  const list = new Array(len);
  for (let i = 0; i < len; i++) {
    list[i] = String.fromCodePoint(start + i);
  }
  return list;
}

const fonts = {
  jigmo1: Deno.readFileSync("fonts/Jigmo/Jigmo.ttf"),
  jigmo2: Deno.readFileSync("fonts/Jigmo/Jigmo2.ttf"),
  jigmo3: Deno.readFileSync("fonts/Jigmo/Jigmo3.ttf"),
};
const baseOptions = {
  removeNotdef: true,
  removeLigatures: true,
};
const blocks = [
  ["URO1", 0x4E00, 0x62FF, "jigmo1"],
  ["URO2", 0x6300, 0x77FF, "jigmo1"],
  ["URO3", 0x7800, 0x8CFF, "jigmo1"],
  ["URO4", 0x8D00, 0x9FFF, "jigmo1"],
  ["CI", 0xF900, 0xFAD9, "jigmo1"],
  ["CIS", 0x2F800, 0x2FA1D, "jigmo2"],
  ["ExtA", 0x3400, 0x4DBF, "jigmo1"],
  ["ExtB1", 0x20000, 0x215FF, "jigmo2"],
  ["ExtB2", 0x21600, 0x230FF, "jigmo2"],
  ["ExtB3", 0x23100, 0x245FF, "jigmo2"],
  ["ExtB4", 0x24600, 0x260FF, "jigmo2"],
  ["ExtB5", 0x26100, 0x275FF, "jigmo2"],
  ["ExtB6", 0x27600, 0x290FF, "jigmo2"],
  ["ExtB7", 0x29100, 0x2A6DF, "jigmo2"],
  ["ExtC", 0x2A700, 0x2B73F, "jigmo2"],
  ["ExtD", 0x2B740, 0x2B81D, "jigmo2"],
  ["ExtE", 0x2B820, 0x2CEAD, "jigmo2"],
  ["ExtF", 0x2CEB0, 0x2EBE0, "jigmo2"],
  ["ExtI", 0x2EBF0, 0x2EE5D, "jigmo2"],
  ["ExtG", 0x30000, 0x3134A, "jigmo3"],
  ["ExtH", 0x31350, 0x323AF, "jigmo3"],
  ["ExtJ", 0x323B0, 0x33479, "jigmo3"],
];
for (const [name, start, end, fontKey] of blocks) {
  const text = range(start, end + 1).join("");
  const svg = ttf2svgFont(fonts[fontKey], { ...baseOptions, text });
  const minified = await minify("image/svg+xml", svg);
  Deno.writeTextFileSync(`src/glyph/${name}.svg`, minified);
}
