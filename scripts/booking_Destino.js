(function () {
  // Valor selecionado para montar o redirect de resultados
  let destinoSelecionado = "";

  const btnDestino = document.getElementById("btn-destino");
  const getModalDestino = () => document.getElementById("modal-destino");

  function abrirModalDestino(event) {
    event.preventDefault();
    event.stopPropagation();

    const modalDestino = getModalDestino();
    if (!modalDestino) {
      console.warn("Modal de destino não encontrado no DOM.");
      return;
    }

    modalDestino.classList.add("show");
    modalDestino.setAttribute("aria-hidden", "false");
  }

  btnDestino?.addEventListener("click", abrirModalDestino);

  btnDestino?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      abrirModalDestino(event);
    }
  });

  function selecionarDestino(local) {
    try {
      if (!local || typeof local !== "string") {
        throw new Error("O parâmetro 'local' deve ser uma string não nula");
      }

      destinoSelecionado = local;

      const pDestino = document.querySelector("#btn-destino p");
      if (pDestino) pDestino.innerText = local;

      if (typeof window.fecharModaisReserva === "function") {
        window.fecharModaisReserva();
      } else {
        const modalDestino = getModalDestino();
        modalDestino?.classList.remove("show");
        modalDestino?.setAttribute("aria-hidden", "true");
      }
    } catch (error) {
      console.error("Erro ao selecionar destino:", error);
    }
  }

  window.addEventListener("click", (event) => {
    const modalDestino = getModalDestino();
    if (modalDestino && event.target === modalDestino) {
      modalDestino.classList.remove("show");
      modalDestino.setAttribute("aria-hidden", "true");
    }
  });

  document.getElementById("btn-verificar")?.addEventListener("click", () => {
    const datasRaw = typeof datasSelecionadas !== "undefined" ? datasSelecionadas : "";
    const adultos = typeof qtdAdultos !== "undefined" ? qtdAdultos : 2;
    const criancas = typeof qtdCriancas !== "undefined" ? qtdCriancas : 0;

    const datas = String(datasRaw).split(" a ");
    const checkin = datas[0] || "";
    const checkout = datas[1] || "";

    const params = new URLSearchParams({
      destino: destinoSelecionado || "Explorar destinos...",
      checkin: checkin,
      checkout: checkout,
      adultos: String(adultos),
      criancas: String(criancas),
    });

    window.location.href = `resultados.html?${params.toString()}`;
  });

  function filtrarDestinos() {
    const input = document.getElementById("input-busca-destino");
    const filter = input?.value?.toLowerCase() || "";
    const items = document.querySelectorAll(".lista-destinos li");

    items.forEach((item) => {
      const text = item.textContent?.toLowerCase() || "";
      item.style.display = text.includes(filter) ? "" : "none";
    });
  }

  window.selecionarDestino = selecionarDestino;
  window.filtrarDestinos = filtrarDestinos;
})();
