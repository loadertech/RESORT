/* ===============================
   MENU LATERAL
================================ */
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu-lateral");
const overlay = document.querySelector(".overlay");
const menuClose = document.querySelector(".menu-close");

function abrirMenu() {
  if (!menu || !overlay || !menuToggle) return;
  menu.classList.add("ativo");
  overlay.classList.add("ativo");
  menuToggle.setAttribute("aria-expanded", "true");
}

function fecharMenu() {
  if (!menu || !overlay || !menuToggle) return;
  menu.classList.remove("ativo");
  overlay.classList.remove("ativo");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  menu.classList.contains("ativo") ? fecharMenu() : abrirMenu();
});

overlay?.addEventListener("click", fecharMenu);
menuClose?.addEventListener("click", fecharMenu);

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
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
   SISTEMA DE RESERVAS (DATAS E HÓSPEDES)
================================ */
let datasSelecionadas = "";
let qtdAdultos = 2;
let qtdCriancas = 0;

const btnCalendario = document.getElementById("btn-calendario");
const inputDatas = document.getElementById("input-datas");
const modalHosp = document.getElementById("modal-hospedes");
const btnHospedes = document.getElementById("btn-hospedes");
let calendarioPicker = null;

if (inputDatas && typeof flatpickr !== "undefined") {
  calendarioPicker = flatpickr(inputDatas, {
    mode: "range",
    minDate: "today",
    dateFormat: "d/m/Y",
    onChange: function (_selectedDates, dateStr) {
      datasSelecionadas = dateStr;
      const p = document.querySelector("#btn-calendario p");
      if (p) p.innerText = dateStr || "Adicionar datas";
    },
  });
}

btnCalendario?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (calendarioPicker) calendarioPicker.open();
});

function changeQty(tipo, delta) {
  if (tipo === "adultos") {
    qtdAdultos = Math.max(1, qtdAdultos + delta);
    const adultosEl = document.getElementById("qty-adultos-modal");
    if (adultosEl) adultosEl.innerText = String(qtdAdultos);
  } else if (tipo === "criancas") {
    qtdCriancas = Math.max(0, qtdCriancas + delta);
    const criancasEl = document.getElementById("qty-criancas-modal");
    if (criancasEl) criancasEl.innerText = String(qtdCriancas);
  }

  const resumo = document.getElementById("hospedes-resumo");
  if (resumo) resumo.innerText = `${qtdAdultos} Adlt, ${qtdCriancas} Crinc`;
}

btnHospedes?.addEventListener("click", (e) => {
  e.stopPropagation();
  modalHosp?.classList.add("show");
  modalHosp?.setAttribute("aria-hidden", "false");
});

function fecharModaisReserva() {
  modalHosp?.classList.remove("show");
  modalHosp?.setAttribute("aria-hidden", "true");

  const modalDestino = document.getElementById("modal-destino");
  modalDestino?.classList.remove("show");
  modalDestino?.setAttribute("aria-hidden", "true");
}

window.addEventListener("click", (e) => {
  const modalDestino = document.getElementById("modal-destino");
  if (e.target === modalHosp || e.target === modalDestino) {
    fecharModaisReserva();
  }
});

window.changeQty = changeQty;
window.fecharModaisReserva = fecharModaisReserva;

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharMenu();
  }
});
