import { bundle } from "jsr:@deno/emit";

const url = new URL(import.meta.resolve(Deno.args[0]));
const { code } = await bundle(url);
console.log(code);
