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
  searchCheckin: document.getElementById("search-checkin"),
  searchCheckout: document.getElementById("search-checkout"),
  searchAdultos: document.getElementById("search-adultos"),
  searchCriancas: document.getElementById("search-criancas"),
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

function readSearchFormIntoQuery() {
  query.destino = ui.searchDestino?.value?.trim() || "";
  query.checkin = ui.searchCheckin?.value || "";
  query.checkout = ui.searchCheckout?.value || "";
  query.adultos = Math.max(1, Number(ui.searchAdultos?.value || 1));
  query.criancas = Math.max(0, Number(ui.searchCriancas?.value || 0));

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
bindEvents();
render();
