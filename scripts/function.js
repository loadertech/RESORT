/* ===============================
   MENU LATERAL
================================ */
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu-lateral");
const overlay = document.querySelector(".overlay");
const menuClose = document.querySelector(".menu-close");
const SESSION_STORAGE_KEY = "resortSession";

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

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || "null");
  } catch (_error) {
    return null;
  }
};

const clearSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

const applyTheme = (theme) => {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);

  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "dark_mode" : "light_mode";
  }
};

const closeAllUserMenus = () => {
  document.querySelectorAll(".auth-user-menu.open").forEach((menuElement) => {
    menuElement.classList.remove("open");
    const trigger = menuElement.querySelector(".auth-user-trigger");
    trigger?.setAttribute("aria-expanded", "false");
  });
};

const createAuthAvatar = (session) => {
  const wrapper = document.createElement("div");
  wrapper.className = "auth-user-menu";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "auth-user-trigger";
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", `Conta de ${session.fullName}`);

  const avatar = document.createElement("span");
  avatar.className = "auth-user-avatar";
  avatar.textContent = session.initials;

  const label = document.createElement("span");
  label.className = "auth-user-name";
  label.textContent = session.fullName;

  const dropdown = document.createElement("div");
  dropdown.className = "auth-user-dropdown";

  const meta = document.createElement("div");
  meta.className = "auth-user-meta";

  const title = document.createElement("strong");
  title.textContent = session.fullName;

  const subtitle = document.createElement("span");
  subtitle.textContent = session.email;

  const logoutButton = document.createElement("button");
  logoutButton.type = "button";
  logoutButton.className = "auth-logout-button";
  logoutButton.textContent = "Sair";
  logoutButton.addEventListener("click", () => {
    clearSession();
    window.location.reload();
  });

  meta.append(title, subtitle);
  dropdown.append(meta, logoutButton);
  trigger.append(avatar, label);
  wrapper.append(trigger, dropdown);

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = !wrapper.classList.contains("open");
    closeAllUserMenus();
    wrapper.classList.toggle("open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  return wrapper;
};

const createMobileAuthCard = (session) => {
  const wrapper = document.createElement("div");
  wrapper.className = "auth-mobile-card";

  const identity = document.createElement("div");
  identity.className = "auth-mobile-identity";

  const avatar = document.createElement("span");
  avatar.className = "auth-user-avatar";
  avatar.textContent = session.initials;

  const text = document.createElement("div");
  text.className = "auth-mobile-text";

  const title = document.createElement("strong");
  title.textContent = session.fullName;

  const subtitle = document.createElement("span");
  subtitle.textContent = session.email;

  const logoutButton = document.createElement("button");
  logoutButton.type = "button";
  logoutButton.className = "auth-logout-button auth-logout-mobile";
  logoutButton.textContent = "Sair";
  logoutButton.addEventListener("click", () => {
    clearSession();
    window.location.reload();
  });

  text.append(title, subtitle);
  identity.append(avatar, text);
  wrapper.append(identity, logoutButton);

  return wrapper;
};

const applyAuthState = () => {
  const session = readSession();
  if (!session?.fullName || !session?.initials) return;

  document
    .querySelectorAll("header nav .btn-login, header nav .btn-reservar")
    .forEach((loginLink) => {
      loginLink.replaceWith(createAuthAvatar(session));
    });

  document.querySelectorAll(".btn-login").forEach((loginLink) => {
    if (!loginLink.closest("header nav")) {
      loginLink.replaceWith(createAuthAvatar(session));
    }
  });

  document.querySelectorAll(".menu-lateral .btn-reservar").forEach((mobileLink) => {
    mobileLink.replaceWith(createMobileAuthCard(session));
  });
};

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

applyTheme(initialTheme);
applyAuthState();

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
  if (!e.target.closest(".auth-user-menu")) {
    closeAllUserMenus();
  }
});

window.changeQty = changeQty;
window.fecharModaisReserva = fecharModaisReserva;

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharMenu();
    closeAllUserMenus();
  }
});
