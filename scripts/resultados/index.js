import { PROPERTIES } from "./data.js";
import {
  parseQueryFromUrl,
  createInitialFilterState,
  clampPriceRange,
  applyFilters,
  applySort,
  updateUrlFromQuery,
} from "./filters.js";
import { renderResults, renderPriceLabels, hydrateSearchForm } from "./render.js";

const ui = {
  searchForm: document.getElementById("search-form"),
  searchDestino: document.getElementById("search-destino"),
  searchDatas: document.getElementById("search-datas"),
  searchAdultos: document.getElementById("search-adultos"),
  searchCriancas: document.getElementById("search-criancas"),
  openDatePicker: document.getElementById("open-date-picker"),
  openDestinoModal: document.getElementById("open-destino-modal"),
  modalDestino: document.getElementById("modal-destino"),
  closeDestinoModal: document.getElementById("close-destino-modal"),
  inputBuscaDestino: document.getElementById("input-busca-destino"),
  listaDestinos: document.getElementById("lista-destinos"),
  toggleSearchPanel: document.getElementById("toggle-search-panel"),
  toggleFilterPanel: document.getElementById("toggle-filter-panel"),
  filtersPanel: document.getElementById("filters-panel"),
  priceMin: document.getElementById("price-min"),
  priceMax: document.getElementById("price-max"),
  priceMinLabel: document.getElementById("price-min-label"),
  priceMaxLabel: document.getElementById("price-max-label"),
  sortSelect: document.getElementById("sort-select"),
  resultsCount: document.getElementById("results-count"),
  resultsList: document.getElementById("results-list"),
  emptyState: document.getElementById("empty-state"),
  clearFilters: document.getElementById("btn-limpar-filtros"),
  filterAvailable: document.getElementById("filter-available"),
  filterRefundable: document.getElementById("filter-refundable"),
  amenityChecks: Array.from(document.querySelectorAll(".amenities-grid input[type='checkbox']")),
  mealChecks: Array.from(document.querySelectorAll("input[data-filter='meal']")),
  paymentRadios: Array.from(document.querySelectorAll("input[name='pagamento']")),
};

const query = parseQueryFromUrl();
const state = createInitialFilterState(ui);
let datePicker = null;

function parseDateRangeText(value) {
  if (!value) return { checkin: "", checkout: "" };
  const normalized = value.replace(" to ", " a ");
  const parts = normalized.split(" a ").map((part) => part.trim()).filter(Boolean);
  return {
    checkin: parts[0] || "",
    checkout: parts[1] || "",
  };
}

function formatRangeLabel() {
  if (query.checkin && query.checkout) {
    return `${query.checkin} a ${query.checkout}`;
  }
  return query.checkin || "";
}

function readSearchFormIntoQuery() {
  query.destino = ui.searchDestino?.value?.trim() || "";
  query.adultos = Math.max(1, Number(ui.searchAdultos?.value || 1));
  query.criancas = Math.max(0, Number(ui.searchCriancas?.value || 0));

  const parsed = parseDateRangeText(ui.searchDatas?.value || "");
  query.checkin = parsed.checkin;
  query.checkout = parsed.checkout;

  if (ui.searchAdultos) ui.searchAdultos.value = String(query.adultos);
  if (ui.searchCriancas) ui.searchCriancas.value = String(query.criancas);
}

function render() {
  clampPriceRange(ui, state);
  renderPriceLabels(ui, state.minPrice, state.maxPrice);

  const filtered = applyFilters(PROPERTIES, state, query);
  const ordered = applySort(filtered, state.sort);
  renderResults(ui, ordered, query);
}

function resetFilters() {
  state.minPrice = 0;
  state.maxPrice = 1000;
  state.selectedAmenities.clear();
  state.selectedMeals.clear();
  state.payment = "all";
  state.onlyAvailable = false;
  state.onlyRefundable = false;
  state.sort = "recommended";

  if (ui.priceMin) ui.priceMin.value = "0";
  if (ui.priceMax) ui.priceMax.value = "1000";

  ui.amenityChecks.forEach((check) => {
    check.checked = false;
  });

  ui.mealChecks.forEach((check) => {
    check.checked = false;
  });

  ui.paymentRadios.forEach((radio) => {
    radio.checked = radio.value === "all";
  });

  if (ui.filterAvailable) ui.filterAvailable.checked = false;
  if (ui.filterRefundable) ui.filterRefundable.checked = false;
  if (ui.sortSelect) ui.sortSelect.value = "recommended";

  render();
}

function openDestinoModal() {
  if (!ui.modalDestino) return;
  ui.modalDestino.classList.add("show");
  ui.modalDestino.setAttribute("aria-hidden", "false");
  ui.inputBuscaDestino?.focus();
}

function closeDestinoModal() {
  if (!ui.modalDestino) return;
  ui.modalDestino.classList.remove("show");
  ui.modalDestino.setAttribute("aria-hidden", "true");
}

function bindDestinationModal() {
  ui.openDestinoModal?.addEventListener("click", (event) => {
    event.preventDefault();
    openDestinoModal();
  });

  ui.searchDestino?.addEventListener("click", (event) => {
    event.preventDefault();
    openDestinoModal();
  });

  ui.closeDestinoModal?.addEventListener("click", closeDestinoModal);

  ui.modalDestino?.addEventListener("click", (event) => {
    if (event.target === ui.modalDestino) closeDestinoModal();
  });

  ui.listaDestinos?.addEventListener("click", (event) => {
    const target = event.target.closest("li[data-destino]");
    if (!target) return;

    const value = target.getAttribute("data-destino") || "";
    if (ui.searchDestino) ui.searchDestino.value = value;
    query.destino = value;
    closeDestinoModal();
    render();
  });

  ui.inputBuscaDestino?.addEventListener("input", () => {
    const term = (ui.inputBuscaDestino.value || "").toLowerCase();
    ui.listaDestinos?.querySelectorAll("li[data-destino]").forEach((item) => {
      const text = (item.textContent || "").toLowerCase();
      item.style.display = text.includes(term) ? "" : "none";
    });
  });
}

function bindDatePicker() {
  if (!ui.searchDatas || typeof flatpickr === "undefined") return;

  datePicker = flatpickr(ui.searchDatas, {
    mode: "range",
    dateFormat: "d/m/Y",
    minDate: "today",
    conjunction: " a ",
    defaultDate: [query.checkin, query.checkout].filter(Boolean),
    onChange: (_selectedDates, dateStr) => {
      const parsed = parseDateRangeText(dateStr);
      query.checkin = parsed.checkin;
      query.checkout = parsed.checkout;
    },
  });

  ui.searchDatas.value = formatRangeLabel();

  ui.openDatePicker?.addEventListener("click", (event) => {
    event.preventDefault();
    datePicker.open();
  });
}

function bindMobileToggles() {
  ui.toggleSearchPanel?.addEventListener("click", () => {
    ui.searchForm?.classList.toggle("is-open");
    ui.filtersPanel?.classList.remove("is-open");
  });

  ui.toggleFilterPanel?.addEventListener("click", () => {
    ui.filtersPanel?.classList.toggle("is-open");
    ui.searchForm?.classList.remove("is-open");
  });
}

function bindEvents() {
  ui.searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    readSearchFormIntoQuery();
    updateUrlFromQuery(query);
    render();
  });

  ui.priceMin?.addEventListener("input", render);
  ui.priceMax?.addEventListener("input", render);

  ui.sortSelect?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  ui.amenityChecks.forEach((check) => {
    check.addEventListener("change", () => {
      if (check.checked) {
        state.selectedAmenities.add(check.value);
      } else {
        state.selectedAmenities.delete(check.value);
      }
      render();
    });
  });

  ui.mealChecks.forEach((check) => {
    check.addEventListener("change", () => {
      if (check.checked) {
        state.selectedMeals.add(check.value);
      } else {
        state.selectedMeals.delete(check.value);
      }
      render();
    });
  });

  ui.paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      state.payment = radio.value;
      render();
    });
  });

  ui.filterAvailable?.addEventListener("change", (event) => {
    state.onlyAvailable = event.target.checked;
    render();
  });

  ui.filterRefundable?.addEventListener("change", (event) => {
    state.onlyRefundable = event.target.checked;
    render();
  });

  ui.clearFilters?.addEventListener("click", resetFilters);
}

hydrateSearchForm(ui, query);
ui.searchDatas && (ui.searchDatas.value = formatRangeLabel());
bindDatePicker();
bindDestinationModal();
bindMobileToggles();
bindEvents();
render();
