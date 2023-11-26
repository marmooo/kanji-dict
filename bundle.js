import { bundle } from "https://deno.land/x/emit/mod.ts";

const url = new URL(import.meta.resolve(Deno.args[0]));
const { code } = await bundle(url);
console.log(code);
