export function parseQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return {
    destino: params.get("destino") || "Cabo Ledo, Angola",
    checkin: params.get("checkin") || "",
    checkout: params.get("checkout") || "",
    adultos: Number(params.get("adultos") || 2),
    criancas: Number(params.get("criancas") || 0),
  };
}

export function createInitialFilterState(ui) {
  return {
    minPrice: Number(ui.priceMin?.value || 0),
    maxPrice: Number(ui.priceMax?.value || 1000),
    selectedAmenities: new Set(),
    selectedMeals: new Set(),
    payment: "all",
    onlyAvailable: false,
    onlyRefundable: false,
    sort: "recommended",
  };
}

export function clampPriceRange(ui, state) {
  if (!ui.priceMin || !ui.priceMax) return;

  let min = Number(ui.priceMin.value);
  let max = Number(ui.priceMax.value);

  if (min > max) {
    if (document.activeElement === ui.priceMin) {
      max = min;
      ui.priceMax.value = String(max);
    } else {
      min = max;
      ui.priceMin.value = String(min);
    }
  }

  state.minPrice = min;
  state.maxPrice = max;
}

export function applyFilters(list, state, query) {
  return list.filter((item) => {
    if (item.price < state.minPrice || item.price > state.maxPrice) return false;

    if (state.onlyAvailable && !item.available) return false;
    if (state.onlyRefundable && !item.refundable) return false;

    if (state.payment === "pay-now" && item.payLater) return false;
    if (state.payment === "pay-later" && !item.payLater) return false;

    for (const amenity of state.selectedAmenities) {
      if (!item.amenities.includes(amenity)) return false;
    }

    for (const meal of state.selectedMeals) {
      if (!item.mealPlans.includes(meal)) return false;
    }

    if (query.destino && query.destino !== "Explorar destinos...") {
      const terms = query.destino
        .toLowerCase()
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

      if (terms.length) {
        const haystack = `${item.location} ${item.name}`.toLowerCase();
        const ok = terms.some((term) => haystack.includes(term));
        if (!ok) return false;
      }
    }

    return true;
  });
}

export function applySort(list, sort) {
  const sorted = [...list];

  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      sorted.sort((a, b) => b.recommendedScore - a.recommendedScore);
      break;
  }

  return sorted;
}

export function updateUrlFromQuery(query) {
  const params = new URLSearchParams();
  params.set("destino", query.destino || "");
  params.set("checkin", query.checkin || "");
  params.set("checkout", query.checkout || "");
  params.set("adultos", String(query.adultos || 2));
  params.set("criancas", String(query.criancas || 0));

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}
