/* ===============================
   CARROSSEL INFINITO 
================================ */
(function () {
  const carousel = document.querySelector(".carousel");
  const wrapper = document.querySelector(".team-section .wrapper");
  if (!carousel || !wrapper) return;

  const leftBtn = wrapper.querySelector("#left");
  const rightBtn = wrapper.querySelector("#right");

  let baseCards = [];
  let step = 0;
  let cloneCount = 1;
  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let isAdjusting = false;
  let ticking = false;

  const getStep = () => {
    const card = carousel.querySelector(".cartao:not([data-clone='true'])") || carousel.querySelector(".cartao");
    if (!card) return 0;

    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(carousel).columnGap || getComputedStyle(carousel).gap || "0") || 0;
    return cardWidth + gap;
  };

  const adjustWithoutAnimation = (target) => {
    isAdjusting = true;
    carousel.classList.add("no-transition");
    carousel.scrollLeft = target;
    carousel.classList.remove("no-transition");
    isAdjusting = false;
  };

  const cleanupClones = () => {
    carousel.querySelectorAll(".cartao[data-clone='true']").forEach((node) => node.remove());
  };

  const setup = () => {
    cleanupClones();

    baseCards = Array.from(carousel.querySelectorAll(".cartao"));
    if (!baseCards.length) return;

    step = getStep();
    if (!step) return;

    cloneCount = Math.max(1, Math.round(carousel.clientWidth / step));

    const headClones = baseCards.slice(-cloneCount).map((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("data-clone", "true");
      clone.setAttribute("aria-hidden", "true");
      return clone;
    });

    const tailClones = baseCards.slice(0, cloneCount).map((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("data-clone", "true");
      clone.setAttribute("aria-hidden", "true");
      return clone;
    });

    headClones.reverse().forEach((clone) => {
      carousel.insertBefore(clone, carousel.firstChild);
    });

    tailClones.forEach((clone) => {
      carousel.appendChild(clone);
    });

    adjustWithoutAnimation(cloneCount * step);
  };

  const normalizeInfinitePosition = () => {
    if (isAdjusting || !step || !baseCards.length) return;

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const minThreshold = step * 0.5;
    const maxThreshold = maxScroll - step * 0.5;

    if (carousel.scrollLeft <= minThreshold) {
      adjustWithoutAnimation(carousel.scrollLeft + baseCards.length * step);
      return;
    }

    if (carousel.scrollLeft >= maxThreshold) {
      adjustWithoutAnimation(carousel.scrollLeft - baseCards.length * step);
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      normalizeInfinitePosition();
      ticking = false;
    });
  };

  const moveByStep = (direction) => {
    if (!step) return;
    carousel.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  };

  leftBtn?.addEventListener("click", () => moveByStep(-1));
  rightBtn?.addEventListener("click", () => moveByStep(1));

  const pointerDown = (event) => {
    isPointerDown = true;
    carousel.classList.add("dragging");
    startX = event.pageX || event.clientX || 0;
    startScrollLeft = carousel.scrollLeft;
  };

  const pointerMove = (event) => {
    if (!isPointerDown) return;
    const x = event.pageX || event.clientX || 0;
    carousel.scrollLeft = startScrollLeft - (x - startX);
  };

  const pointerUp = () => {
    isPointerDown = false;
    carousel.classList.remove("dragging");
  };

  carousel.addEventListener("mousedown", pointerDown);
  carousel.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup", pointerUp);
  carousel.addEventListener("mouseleave", pointerUp);
  carousel.addEventListener("scroll", onScroll);

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 180);
  });

  setup();
})();
