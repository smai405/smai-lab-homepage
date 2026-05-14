const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const viewSections = document.querySelectorAll("[data-view]");
const viewLinks = document.querySelectorAll('a[href^="#"]');
const publicationFilters = document.querySelectorAll("[data-publication-filter]");
const publicationGroups = document.querySelectorAll("[data-publication-group]");
const viewNames = new Set(Array.from(viewSections, (section) => section.getAttribute("data-view")));

toggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});

const getViewFromHash = () => {
  const view = window.location.hash.replace("#", "") || "home";

  return viewNames.has(view) ? view : "home";
};

const renderView = (activeView) => {
  viewSections.forEach((section) => {
    section.hidden = section.getAttribute("data-view") !== activeView;
  });

  viewLinks.forEach((link) => {
    const linkView = link.getAttribute("href")?.replace("#", "");
    const isCurrentNavLink = linkView === activeView && Boolean(link.closest("[data-nav]"));

    link.classList.toggle("is-active", isCurrentNavLink);
  });

  window.scrollTo({ top: 0, behavior: "auto" });
};

viewLinks.forEach((link) => {
  const view = link.getAttribute("href")?.replace("#", "");

  if (!viewNames.has(view)) {
    return;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();

    if (window.location.hash === `#${view}`) {
      renderView(view);
      return;
    }

    history.pushState(null, "", `#${view}`);
    renderView(view);
  });
});

window.addEventListener("popstate", () => {
  renderView(getViewFromHash());
});

window.addEventListener("hashchange", () => {
  renderView(getViewFromHash());
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

renderView(getViewFromHash());
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

publicationFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.getAttribute("data-publication-filter");

    publicationFilters.forEach((filter) => {
      const isSelected = filter === button;

      filter.classList.toggle("is-active", isSelected);
      filter.setAttribute("aria-pressed", String(isSelected));
    });

    publicationGroups.forEach((group) => {
      const category = group.getAttribute("data-publication-group");
      group.hidden = selected !== "all" && selected !== category;
    });
  });
});
