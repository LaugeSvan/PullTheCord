async function loadComponent(selector, path) {
  const el = document.querySelector(selector);
  if (el) {
    const res = await fetch(path);
    el.innerHTML = await res.text();
  }
}

function setupSectionHighlighting() {
  const sections = document.querySelectorAll("main section");
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.sidebar a[href*="#${id}"]`);
      if (link) {
        if (entry.isIntersecting) {
          sidebarLinks.forEach(a => a.classList.remove("active"));
          link.classList.add("active");
        }
      }
    });
  }, { rootMargin: "-50% 0px -50% 0px" });

  sections.forEach(section => observer.observe(section));
}

function setupSidebarCollapsibles() {
  document.querySelectorAll(".sidebar h2").forEach(header => {
    header.addEventListener("click", () => {
      header.classList.toggle("open");
      const list = header.nextElementSibling;
      if (list) list.classList.toggle("collapsed");
    });
  });
}

function generateTOC() {
  const tocList = document.getElementById("toc-list");
  if (!tocList) return;

  const headers = document.querySelectorAll("main h2");
  headers.forEach(h => {
    const id = h.id || h.textContent.toLowerCase().replace(/\s+/g, "-");
    h.id = id;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + id;
    a.textContent = h.textContent;
    li.appendChild(a);
    tocList.appendChild(li);
  });
}

/* ---------- DARK MODE ---------- */
function setupTheme() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) document.documentElement.setAttribute("data-theme", storedTheme);

  const updateButton = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    toggle.textContent = isDark ? "☀️" : "🌙";
  };

  updateButton();

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateButton();
  });
}

/* ---------- INITIALIZE ---------- */
window.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("header", "/components/header.html"),
    loadComponent(".sidebar", "/components/sidebar.html")
  ]);

  setupSidebarCollapsibles();
  generateTOC();
  setupSectionHighlighting();
  setupTheme();
});