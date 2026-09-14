function activarDragAndDrop() {
  // Capturamos tus tarjetas reales y tus columnas
  const tarjetas = document.querySelectorAll(".task-card");
  const columnas = document.querySelectorAll(
    "#list-todo, #list-doing, #list-done",
  );

  // 1. Configurar las tarjetas para que se puedan arrastrar
  tarjetas.forEach((tarjeta) => {
    tarjeta.setAttribute("draggable", "true");

    tarjeta.addEventListener("dragstart", (evento) => {
      // Guardamos el ID único de la tarea
      const idTarea = tarjeta.getAttribute("data-id");
      evento.dataTransfer.setData("text/plain", idTarea);

      // Estilo fantasma opcional mientras arrastras
      tarjeta.style.opacity = "0.5";
    });

    tarjeta.addEventListener("dragend", () => {
      tarjeta.style.opacity = "1";
    });
  });

  // 2. Configurar las columnas para recibir las tarjetas
  columnas.forEach((columna) => {
    columna.addEventListener("dragover", (evento) => {
      evento.preventDefault(); // Obligatorio para permitir el drop
    });

    columna.addEventListener("drop", async (evento) => {
      evento.preventDefault();

      const idTarea = evento.dataTransfer.getData("text/plain");
      const tarjetaElemento = document.querySelector(`[data-id="${idTarea}"]`);

      if (!tarjetaElemento) return;

      // Movemos la tarjeta de forma visual inmediatamente
      columna.appendChild(tarjetaElemento);

      // Determinamos el nuevo string de estado según el contenedor
      const idListaDestino = columna.id;
      let nuevoEstado = "todo";

      if (idListaDestino === "list-doing") {
        nuevoEstado = "doing";
      } else if (idListaDestino === "list-done") {
        nuevoEstado = "done";
      }

      // Actualizamos tus contadores y barras de diseño en vivo
      actualizarContadoresEnVivo();

      // Enviamos el cambio definitivo a tu JSON Server
      try {
        const respuesta = await fetch(
          `http://localhost:3000/tasks/${idTarea}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: nuevoEstado }),
          },
        );

        if (!respuesta.ok) {
          alert("Hubo un problema al guardar el nuevo estado en el servidor.");
        }
      } catch (error) {
        console.error("Error al actualizar el estado de la tarea:", error);
      }
    });
  });
}
