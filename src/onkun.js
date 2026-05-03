function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark"
    ? "light"
    : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
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

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
