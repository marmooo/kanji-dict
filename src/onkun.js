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

const summaries = document.getElementById("list").querySelectorAll("summary");
for (const summary of summaries) {
  const index = summary.textContent;
  const details = summary.parentNode;
  const div = summary.nextElementSibling;
  details.addEventListener("toggle", async () => {
    if (details.open && !div.style.fontFamily) {
      const font = new FontFace(
        `jigmo_${index}`,
        `url(fonts/${index}.woff2)`,
      );
      document.fonts.add(await font.load());
      div.style.fontFamily = `jigmo_${index},sans-serif`;
    }
  });
}

loadConfig();
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
