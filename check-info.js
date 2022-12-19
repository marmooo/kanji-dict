const info = JSON.parse(Deno.readTextFileSync("kanji-info.json"));
console.log(JSON.stringify(info["漢"], null, " "));
