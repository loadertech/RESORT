document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão
    const form = event.target;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Mensagem enviada com sucesso!");
          form.reset(); // Limpa o formulário
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, "errors")) {
              alert(
                "Erro: " + data.errors.map((error) => error.message).join(", "),
              );
            } else {
              alert("Ocorreu um erro ao enviar a mensagem.");
            }
          });
        }
      })
      .catch((error) => {
        alert("Erro ao enviar a mensagem: " + error);
      });
  });
