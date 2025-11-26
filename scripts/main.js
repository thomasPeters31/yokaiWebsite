/**
 * Global UX helpers:
 * - Drawer: open/close side navigation with backdrop + scroll lock
 * - Reveal: fade/slide elements into view as they enter the viewport
 */
(() => {
  const drawer = document.querySelector("[data-drawer]");
  const drawerToggle = document.querySelector("[data-drawer-toggle]");

  // Drawer backdrop layer
  const backdrop = document.createElement("div");
  backdrop.className = "drawer-backdrop";
  document.body.appendChild(backdrop);

  // Toggle drawer open/closed; force can be true/false to explicitly set state
  const toggleDrawer = (force) => {
    if (!drawer) return;
    const shouldOpen = typeof force === "boolean" ? force : !drawer.classList.contains("open");
    drawer.classList.toggle("open", shouldOpen);
    backdrop.classList.toggle("show", shouldOpen);
    document.body.style.overflow = shouldOpen ? "hidden" : "";
  };

  // Drawer interactions: button, backdrop, and in-drawer links
  drawerToggle?.addEventListener("click", () => toggleDrawer());
  backdrop.addEventListener("click", () => toggleDrawer(false));
  drawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggleDrawer(false)));

  // Reveal on scroll: add .visible when elements cross the threshold
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
