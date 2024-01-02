function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function loadFonts() {
  const unicodeList = document.getElementById("unicodeList");
  unicodeList.style.fontFamily = "jigmo,sans-serif";
  const arr = Array.from(unicodeList.textContent.replaceAll(/\s/g, ""));
  const splitRange = [0, 64, 128, 256, 512, 1024, 2048, Infinity];

  const promises = [];
  for (let i = 1; i <= splitRange.length; i++) {
    const from = splitRange[i - 1];
    const to = Math.min(arr.length, splitRange[i]);
    const fromHex = arr[from].codePointAt(0).toString(16).toUpperCase();
    const toHex = arr[to - 1].codePointAt(0).toString(16).toUpperCase();
    const unicodeRange = `U+${fromHex}-${toHex}`;
    const font = new FontFace("jigmo", `url(font.${i}.woff2)`, {
      unicodeRange,
    });
    promises.push(font.load());
    document.fonts.add(font);
    if (to == arr.length) break;
  }
  return promises;
}

loadConfig();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
const unicodeDetails = document.getElementById("unicodeDetails");
if (unicodeDetails && !unicodeDetails.open) {
  unicodeDetails.addEventListener("click", loadFonts, { once: true });
}
