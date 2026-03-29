(function () {
  const STORAGE_KEY = "tharindu-portfolio-theme";

  function getStoredTheme() {
    return window.localStorage.getItem(STORAGE_KEY);
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const label = button.querySelector(".theme-toggle-label");
      if (label) {
        label.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
      }
      button.setAttribute("aria-pressed", String(theme === "dark"));
    });
  }

  function setTheme(theme) {
    window.localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }

  function toggleTheme() {
    const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", toggleTheme);
    });
  }

  window.PortfolioTheme = {
    initTheme,
    setTheme,
    getPreferredTheme
  };

  initTheme();
})();
