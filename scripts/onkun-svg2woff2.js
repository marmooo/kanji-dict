import { basename, dirname } from "@std/path";
import { expandGlob } from "@std/fs";
import { convert } from "fontconv";

const inPath = "./src/音訓/**/*.svg";
const files = expandGlob(inPath, { globstar: true });
for await (const file of files) {
  console.log(file.path);
  const dirName = dirname(file.path);
  const baseName = basename(file.path);
  const outPath = `${dirName}/${baseName.split(".")[0]}.woff2`;
  const svg = Deno.readTextFileSync(file.path);
  const woff2 = await convert(svg, ".woff2", { removeLigatures: true });
  Deno.writeFileSync(outPath, woff2);
}
