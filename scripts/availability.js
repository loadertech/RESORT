// Availability page functionality
document.addEventListener("DOMContentLoaded", function () {
  const bookingForm = document.getElementById("booking-form");
  const resultsSection = document.getElementById("results-section");
  const resultsGrid = document.getElementById("results-grid");
  const checkinInput = document.getElementById("checkin-date");
  const checkoutInput = document.getElementById("checkout-date");

  // Set minimum dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  checkinInput.min = today.toISOString().split("T")[0];
  checkoutInput.min = tomorrow.toISOString().split("T")[0];

  // Update checkout min when checkin changes
  checkinInput.addEventListener("change", function () {
    const checkinDate = new Date(this.value);
    const nextDay = new Date(checkinDate);
    nextDay.setDate(nextDay.getDate() + 1);
    checkoutInput.min = nextDay.toISOString().split("T")[0];

    // Clear checkout if it's before new min
    if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
      checkoutInput.value = "";
    }
  });

  // Form submission
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Validate dates
    const checkin = new Date(data.checkin);
    const checkout = new Date(data.checkout);

    if (checkout <= checkin) {
      alert("A data de check-out deve ser posterior à data de check-in.");
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector(".btn-primary");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Verificando...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      displayResults(data);
      resultsSection.style.display = "block";
      resultsSection.scrollIntoView({ behavior: "smooth" });

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  function displayResults(searchData) {
    const rooms = [
      {
        id: 1,
        title: "Quarto Standard",
        price: "€89/noite",
        image:
          "/imagens/imagens_gerentes/resorts/fabio-fistarol-qai_Clhyq0s-unsplash.jpg",
        features: [
          "Vista para jardim",
          "Wi-Fi gratuito",
          "Café da manhã incluído",
        ],
        description:
          "Quarto confortável com todas as comodidades essenciais para uma estadia agradável.",
        available: true,
      },
      {
        id: 2,
        title: "Quarto Deluxe",
        price: "€129/noite",
        image:
          "/imagens/imagens_gerentes/resorts/sasha-kaunas-xEaAoizNFV8-unsplash.jpg",
        features: [
          "Vista para o mar",
          "Varanda privada",
          "Mini-bar",
          "Wi-Fi gratuito",
        ],
        description:
          "Espaçoso quarto deluxe com vista panorâmica e serviços premium.",
        available: true,
      },
      {
        id: 3,
        title: "Suite Executiva",
        price: "€199/noite",
        image:
          "/imagens/imagens_gerentes/resorts/bilderboken-rlwE8f8anOc-unsplash.jpg",
        features: [
          "Sala de estar",
          "Cozinha completa",
          "Vista para o oceano",
          "Serviço de quartos 24h",
        ],
        description:
          "Suite luxuosa com espaço adicional e comodidades de primeira classe.",
        available: true,
      },
      {
        id: 4,
        title: "Suite Presidencial",
        price: "€299/noite",
        image:
          "/imagens/imagens_gerentes/resorts/chelsea-gates-0653_wY0nRc-unsplash.jpg",
        features: [
          "2 quartos",
          "Sala de jantar",
          "Piscina privada",
          "Mordomo pessoal",
        ],
        description:
          "A experiência máxima de luxo com serviços personalizados e espaço generoso.",
        available: false,
      },
    ];

    resultsGrid.innerHTML = "";

    rooms.forEach((room) => {
      const roomCard = document.createElement("div");
      roomCard.className = "room-card";

      roomCard.innerHTML = `
        <div class="room-image" style="background-image: url('${room.image}')"></div>
        <div class="room-content">
          <div class="room-header">
            <h3 class="room-title">${room.title}</h3>
            <span class="room-price">${room.price}</span>
          </div>

          <div class="room-features">
            ${room.features.map((feature) => `<span class="room-feature">${feature}</span>`).join("")}
          </div>

          <p class="room-description">${room.description}</p>

          <div class="room-actions">
            ${
              room.available
                ? `<button class="room-btn room-btn-primary" onclick="bookRoom(${room.id})">Reservar Agora</button>
               <button class="room-btn room-btn-secondary" onclick="viewDetails(${room.id})">Ver Detalhes</button>`
                : `<button class="room-btn room-btn-secondary" disabled>Indisponível</button>`
            }
          </div>
        </div>
      `;

      resultsGrid.appendChild(roomCard);
    });
  }

  // Global functions for room actions
  window.bookRoom = function (roomId) {
    alert(
      `Reserva iniciada para o quarto ${roomId}. Redirecionando para checkout...`,
    );
    // Here you would redirect to booking page or open booking modal
  };

  window.viewDetails = function (roomId) {
    alert(`Mostrando detalhes do quarto ${roomId}`);
    // Here you would open a detailed modal or redirect to room details page
  };
});
