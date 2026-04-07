/* ===============================
   MENU LATERAL
================================ */
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu-lateral");
const overlay = document.querySelector(".overlay");
const menuClose = document.querySelector(".menu-close");

function abrirMenu() {
  menu.classList.add("ativo");
  overlay.classList.add("ativo");
  menuToggle.setAttribute("aria-expanded", "true");
}

function fecharMenu() {
  menu.classList.remove("ativo");
  overlay.classList.remove("ativo");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  menu.classList.contains("ativo") ? fecharMenu() : abrirMenu();
});

overlay.addEventListener("click", fecharMenu);
menuClose.addEventListener("click", fecharMenu);

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia?.(
  "(prefers-color-scheme: dark)",
)?.matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

const applyTheme = (theme) => {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);

  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "dark_mode" : "light_mode";
  }
};

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark")
      ? "light"
      : "dark";
    applyTheme(nextTheme);
  });
}

applyTheme(initialTheme);

/* ===============================
   CARROSSEL INFINITO
================================ */
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper span");

if (carousel) {
  const firstCard = carousel.querySelector(".cartao");
  const firstCardWidth = firstCard.offsetWidth;

  let isDragging = false;
  let startX;
  let startScrollLeft;

  let cardPerView = Math.max(
    1,
    Math.round(carousel.offsetWidth / firstCardWidth),
  );

  const cards = [...carousel.children];

  /* Clones para loop infinito */
  cards
    .slice(-cardPerView)
    .reverse()
    .forEach((card) => {
      carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });

  cards.slice(0, cardPerView).forEach((card) => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });

  carousel.scrollLeft = carousel.offsetWidth;

  /* Setas */
  arrowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      carousel.scrollLeft +=
        btn.id === "left" ? -firstCardWidth : firstCardWidth;
    });
  });

  /* Drag */
  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);

  /* Loop infinito invisível */
  const infiniteScroll = () => {
    if (carousel.scrollLeft <= 0) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }

    if (
      Math.ceil(carousel.scrollLeft) >=
      carousel.scrollWidth - carousel.offsetWidth
    ) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }
  };

  carousel.addEventListener("scroll", infiniteScroll);
}
