const searchBar = document.getElementById("search-bar");

if (searchBar) {
  searchBar.addEventListener("input", (evento) => {
    const textoBuscado = evento.target.value.toLowerCase();
    const todasLasTarjetas = document.querySelectorAll(".task-card");

    todasLasTarjetas.forEach((tarjeta) => {
      const tituloTarjeta = tarjeta
        .querySelector(".card-title")
        .textContent.toLowerCase();
      if (tituloTarjeta.includes(textoBuscado)) {
        tarjeta.style.display = "flex";
      } else {
        tarjeta.style.display = "none";
      }
    });
  });
}
