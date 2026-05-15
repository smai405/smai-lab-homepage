const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const viewSections = document.querySelectorAll("[data-view]");
const viewLinks = document.querySelectorAll('a[href^="#"]');
const publicationFilters = document.querySelectorAll("[data-publication-filter]");
const publicationGroups = document.querySelectorAll("[data-publication-group]");
const peopleFilters = document.querySelectorAll("[data-people-filter]");
const peopleGroups = document.querySelectorAll("[data-people-group]");
const languageButtons = document.querySelectorAll("[data-lang-button]");
const translatedElements = document.querySelectorAll("[data-i18n]");
const profileModal = document.querySelector("[data-profile-modal]");
const profileOpenButtons = document.querySelectorAll("[data-profile-open]");
const profileCloseButtons = document.querySelectorAll("[data-profile-close]");
const viewNames = new Set(Array.from(viewSections, (section) => section.getAttribute("data-view")));
const supportedLanguages = new Set(["en", "ko"]);
let lastFocusedElement = null;

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

const setLanguage = (language) => {
  const selectedLanguage = supportedLanguages.has(language) ? language : "en";

  document.documentElement.lang = selectedLanguage;

  translatedElements.forEach((element) => {
    const translatedText = element.getAttribute(`data-${selectedLanguage}`);

    if (translatedText) {
      element.textContent = translatedText;
    }
  });

  languageButtons.forEach((button) => {
    const isSelected = button.getAttribute("data-lang-button") === selectedLanguage;

    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  try {
    localStorage.setItem("smai-language", selectedLanguage);
  } catch {
    // Language selection still works for the current page when storage is unavailable.
  }
};

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.getAttribute("data-lang-button"));
  });
});

let savedLanguage = "en";

try {
  savedLanguage = localStorage.getItem("smai-language") || "en";
} catch {
  savedLanguage = "en";
}

setLanguage(savedLanguage);
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

peopleFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.getAttribute("data-people-filter");

    peopleFilters.forEach((filter) => {
      const isSelected = filter === button;

      filter.classList.toggle("is-active", isSelected);
      filter.setAttribute("aria-pressed", String(isSelected));
    });

    peopleGroups.forEach((group) => {
      const category = group.getAttribute("data-people-group");
      group.hidden = selected !== "all" && selected !== category;
    });
  });
});

const openProfileModal = () => {
  if (!profileModal) {
    return;
  }

  lastFocusedElement = document.activeElement;
  profileModal.hidden = false;
  document.body.classList.add("has-profile-modal");
  profileModal.querySelector(".profile-close")?.focus();
};

const closeProfileModal = () => {
  if (!profileModal || profileModal.hidden) {
    return;
  }

  profileModal.hidden = true;
  document.body.classList.remove("has-profile-modal");

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
};

profileOpenButtons.forEach((button) => {
  button.addEventListener("click", openProfileModal);
});

profileCloseButtons.forEach((button) => {
  button.addEventListener("click", closeProfileModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProfileModal();
  }
});
