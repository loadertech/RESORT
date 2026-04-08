import { formatCurrency } from "./data.js";

function getCardTags(item) {
  const tags = [];
  if (item.breakfast) tags.push("Café da manhã incluído");
  if (item.refundable) tags.push("Totalmente reembolsável");
  if (item.mealPlans.includes("all-inclusive")) tags.push("Tudo incluído");
  if (item.mealPlans.includes("lunch-dinner")) tags.push("Almoço + jantar");
  return tags.length ? tags : ["Condições padrão"];
}

function cardTemplate(item, query) {
  const tags = getCardTags(item)
    .map((tag) => `<span class="result-tag">${tag}</span>`)
    .join("");

  const discountLabel = item.discount > 0
    ? `<span class="discount-badge">${item.discount}% de desconto</span>`
    : "";

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

export function renderResults(ui, list, query) {
  if (!ui.resultsList || !ui.emptyState || !ui.resultsCount) return;

  ui.resultsCount.textContent = `${list.length} ${list.length === 1 ? "quarto" : "quartos"}`;

  if (!list.length) {
    ui.resultsList.innerHTML = "";
    ui.emptyState.hidden = false;
    return;
  }

  ui.emptyState.hidden = true;
  ui.resultsList.innerHTML = list.map((item) => cardTemplate(item, query)).join("");
}

export function renderPriceLabels(ui, min, max) {
  if (ui.priceMinLabel) ui.priceMinLabel.textContent = formatCurrency(min);
  if (ui.priceMaxLabel) ui.priceMaxLabel.textContent = formatCurrency(max);
}

export function hydrateSearchForm(ui, query) {
  if (ui.searchDestino) ui.searchDestino.value = query.destino || "";
    if (ui.searchAdultos) ui.searchAdultos.value = String(query.adultos || 2);
  if (ui.searchCriancas) ui.searchCriancas.value = String(query.criancas || 0);
}


