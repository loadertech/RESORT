(function () {
  "use strict";

  const formatCurrency = (value) => `${Number(value).toLocaleString("pt-PT")} Kz`;

  const params = new URLSearchParams(window.location.search);
  const query = {
    destino: params.get("destino") || "Cabo Ledo, Angola",
    checkin: params.get("checkin") || "",
    checkout: params.get("checkout") || "",
    adultos: Number(params.get("adultos") || 2),
    criancas: Number(params.get("criancas") || 0),
  };

  const properties = [
    {
      id: 1,
      name: "Baía Resort Premium",
      location: "Cabo Ledo",
      price: 620,
      rating: 9.2,
      reviews: 120,
      discount: 10,
      description: "Vista mar, ideal para casais e famílias.",
      image: "./imagens/imagens_gerentes/resorts/fabio-fistarol-qai_Clhyq0s-unsplash.jpg",
      breakfast: true,
      refundable: false,
      available: true,
      payLater: true,
      amenities: ["wifi", "pool", "parking", "restaurant", "vip"],
      mealPlans: ["breakfast"],
      recommendedScore: 94,
    },
    {
      id: 2,
      name: "Ocean View Lodge",
      location: "Ilha do Mussulo",
      price: 840,
      rating: 9.5,
      reviews: 74,
      discount: 23,
      description: "Suites com varanda e serviço premium.",
      image: "./imagens/imagens_seccoes/bilderboken-rlwE8f8anOc-unsplash.jpg",
      breakfast: true,
      refundable: true,
      available: true,
      payLater: false,
      amenities: ["wifi", "pool", "ac", "restaurant", "gym"],
      mealPlans: ["breakfast", "all-inclusive"],
      recommendedScore: 98,
    },
    {
      id: 3,
      name: "Mupas Beach & Spa",
      location: "Cabo Ledo",
      price: 710,
      rating: 8.9,
      reviews: 88,
      discount: 15,
      description: "Conforto moderno com acesso direto à praia.",
      image: "./imagens/imagens_seccoes/pexels-ketut-subiyanto-4907441.jpg",
      breakfast: true,
      refundable: true,
      available: true,
      payLater: true,
      amenities: ["wifi", "pool", "spa", "parking", "kitchen"],
      mealPlans: ["breakfast", "lunch-dinner"],
      recommendedScore: 92,
    },
    {
      id: 4,
      name: "Sunset Eco Villas",
      location: "Luanda",
      price: 540,
      rating: 8.4,
      reviews: 58,
      discount: 0,
      description: "Ambiente natural, ideal para descanso.",
      image: "./imagens/imagens_seccoes/webfactory-ltd-B0tAwAQUbzA-unsplash.jpg",
      breakfast: false,
      refundable: true,
      available: false,
      payLater: true,
      amenities: ["wifi", "parking", "kitchen"],
      mealPlans: [],
      recommendedScore: 83,
    },
    {
      id: 5,
      name: "Palm Horizon Hotel",
      location: "Cabo Ledo",
      price: 930,
      rating: 9.0,
      reviews: 63,
      discount: 10,
      description: "Perfeito para férias completas all-inclusive.",
      image: "./imagens/imagens_seccoes/isidore-decamon-FUQrshH4Grc-unsplash.jpg",
      breakfast: true,
      refundable: false,
      available: true,
      payLater: false,
      amenities: ["wifi", "pool", "restaurant", "gym", "ac"],
      mealPlans: ["all-inclusive"],
      recommendedScore: 91,
    },
    {
      id: 6,
      name: "Costa Azul Residence",
      location: "Mussulo",
      price: 470,
      rating: 8.8,
      reviews: 36,
      discount: 8,
      description: "Ótimo custo-benefício com ambientes amplos.",
      image: "./imagens/galeria/pexels-asadphoto-3601426.jpg",
      breakfast: false,
      refundable: true,
      available: true,
      payLater: true,
      amenities: ["wifi", "parking", "ac", "kitchen"],
      mealPlans: ["lunch-dinner"],
      recommendedScore: 88,
    },
    {
      id: 7,
      name: "Tropical Infinity Suites",
      location: "Cabo Ledo",
      price: 990,
      rating: 9.8,
      reviews: 20,
      discount: 10,
      description: "Suites de luxo com vista panorâmica.",
      image: "./imagens/galeria/pexels-pixabay-274249.jpg",
      breakfast: true,
      refundable: false,
      available: true,
      payLater: false,
      amenities: ["wifi", "pool", "vip", "gym", "restaurant"],
      mealPlans: ["breakfast", "all-inclusive"],
      recommendedScore: 99,
    },
    {
      id: 8,
      name: "Retiro Maré Mansa",
      location: "Luanda",
      price: 390,
      rating: 8.1,
      reviews: 41,
      discount: 0,
      description: "Estadia tranquila com foco em relaxamento.",
      image: "./imagens/galeria/pexels-pixabay-261169.jpg",
      breakfast: true,
      refundable: true,
      available: true,
      payLater: true,
      amenities: ["wifi", "pool"],
      mealPlans: ["breakfast"],
      recommendedScore: 79,
    },
  ];

  const ui = {
    summaryDestino: document.getElementById("summary-destino"),
    summaryDatas: document.getElementById("summary-datas"),
    summaryHospedes: document.getElementById("summary-hospedes"),
    priceMin: document.getElementById("price-min"),
    priceMax: document.getElementById("price-max"),
    priceMinLabel: document.getElementById("price-min-label"),
    priceMaxLabel: document.getElementById("price-max-label"),
    sortSelect: document.getElementById("sort-select"),
    resultsCount: document.getElementById("results-count"),
    resultsList: document.getElementById("results-list"),
    emptyState: document.getElementById("empty-state"),
    clearFilters: document.getElementById("btn-limpar-filtros"),
    btnAplicarResumo: document.getElementById("btn-aplicar-resumo"),
    filterAvailable: document.getElementById("filter-available"),
    filterRefundable: document.getElementById("filter-refundable"),
    amenityChecks: Array.from(document.querySelectorAll(".amenities-grid input[type='checkbox']")),
    mealChecks: Array.from(document.querySelectorAll(".filter-group input[value='breakfast'], .filter-group input[value='all-inclusive'], .filter-group input[value='lunch-dinner']")),
    paymentRadios: Array.from(document.querySelectorAll("input[name='pagamento']")),
  };

  const state = {
    minPrice: Number(ui.priceMin?.value || 0),
    maxPrice: Number(ui.priceMax?.value || 1000),
    selectedAmenities: new Set(),
    selectedMeals: new Set(),
    payment: "all",
    onlyAvailable: false,
    onlyRefundable: false,
    sort: "recommended",
  };

  function updateSummary() {
    const interval = [query.checkin, query.checkout].filter(Boolean).join(" - ");
    if (ui.summaryDestino) ui.summaryDestino.textContent = query.destino;
    if (ui.summaryDatas) ui.summaryDatas.textContent = interval || "Sem datas";
    if (ui.summaryHospedes) {
      ui.summaryHospedes.textContent = `${query.adultos} adulto(s), ${query.criancas} criança(s)`;
    }
  }

  function clampPrices() {
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

    if (ui.priceMinLabel) ui.priceMinLabel.textContent = formatCurrency(min);
    if (ui.priceMaxLabel) ui.priceMaxLabel.textContent = formatCurrency(max);
  }

  function getCardTags(item) {
    const tags = [];
    if (item.breakfast) tags.push("Café da manhã incluído");
    if (item.refundable) tags.push("Totalmente reembolsável");
    if (item.mealPlans.includes("all-inclusive")) tags.push("Tudo incluído");
    if (item.mealPlans.includes("lunch-dinner")) tags.push("Almoço + jantar");
    return tags.length ? tags : ["Condições padrão"];
  }

  function cardTemplate(item) {
    const tags = getCardTags(item)
      .map((tag) => `<span class="result-tag">${tag}</span>`)
      .join("");

    const discountLabel = item.discount > 0 ? `<span class="discount-badge">${item.discount}% de desconto</span>` : "";

    return `
      <article class="result-card" data-id="${item.id}">
        <div class="result-media" style="background-image: url('${item.image}')" role="img" aria-label="${item.name}"></div>
        <div class="result-body">
          <h3>${item.name}</h3>
          <p class="result-location">${item.location}</p>
          <div class="result-meta">
            <span><span class="material-symbols-outlined">restaurant</span>${item.breakfast ? "Pequeno-almoço" : "Sem pequeno-almoço"}</span>
            <span><span class="material-symbols-outlined">pool</span>Piscina</span>
            <span><span class="material-symbols-outlined">groups</span>${query.adultos + query.criancas} hóspedes</span>
          </div>
          <p>${item.description}</p>
          <div class="result-tags">
            <span class="rating-chip">${item.rating.toFixed(1)}</span>
            ${tags}
          </div>
        </div>
        <div class="result-side">
          ${discountLabel}
          <div>
            <div class="result-price">${formatCurrency(item.price)}<small>por noite + taxas</small></div>
          </div>
          <button type="button" class="result-cta">Ver detalhes</button>
        </div>
      </article>
    `;
  }

  function applyFilters(list) {
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

  function applySort(list) {
    const sorted = [...list];

    switch (state.sort) {
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

  function render() {
    clampPrices();

    const filtered = applyFilters(properties);
    const ordered = applySort(filtered);

    if (ui.resultsCount) {
      ui.resultsCount.textContent = `${ordered.length} ${ordered.length === 1 ? "quarto" : "quartos"}`;
    }

    if (!ui.resultsList || !ui.emptyState) return;

    if (!ordered.length) {
      ui.resultsList.innerHTML = "";
      ui.emptyState.hidden = false;
      return;
    }

    ui.emptyState.hidden = true;
    ui.resultsList.innerHTML = ordered.map(cardTemplate).join("");
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

    ui.btnAplicarResumo?.addEventListener("click", () => {
      query.destino = ui.summaryDestino?.textContent || query.destino;
      render();
    });
  }

  updateSummary();
  bindEvents();
  render();
})();

