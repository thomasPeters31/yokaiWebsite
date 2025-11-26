(() => {
  const drawer = document.querySelector("[data-drawer]");
  const drawerToggle = document.querySelector("[data-drawer-toggle]");
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");
  const body = document.body;

  // Drawer backdrop
  const backdrop = document.createElement("div");
  backdrop.className = "drawer-backdrop";
  document.body.appendChild(backdrop);

  const toggleDrawer = (force) => {
    if (!drawer) return;
    const shouldOpen = typeof force === "boolean" ? force : !drawer.classList.contains("open");
    drawer.classList.toggle("open", shouldOpen);
    backdrop.classList.toggle("show", shouldOpen);
    document.body.style.overflow = shouldOpen ? "hidden" : "";
  };

  drawerToggle?.addEventListener("click", () => toggleDrawer());
  backdrop.addEventListener("click", () => toggleDrawer(false));
  drawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggleDrawer(false)));

  // Theme handling
  const applyTheme = (mode) => {
    body.classList.remove("theme-light", "theme-dark");
    if (mode === "light") body.classList.add("theme-light");
    if (mode === "dark") body.classList.add("theme-dark");
    localStorage.setItem("theme", mode);
  };

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
  } else {
    applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  themeButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const next = body.classList.contains("theme-dark") ? "light" : "dark";
      applyTheme(next);
    })
  );

  // Reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
