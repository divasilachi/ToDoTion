const opcionesSortable = {
  group: "kanban-shared",
  animation: 200,
  ghostClass: "sortable-ghost",
  filter: ".btn-ver-detalle",
  preventOnFilter: false,

  onEnd: async function (evento) {
    const tarjetaElemento = evento.item;
    const idTarea = tarjetaElemento.getAttribute("data-id");
    const idListaDestino = evento.to.id;

    let nuevoEstado = "todo";
    if (idListaDestino === "list-doing") {
      nuevoEstado = "doing";
    } else if (idListaDestino === "list-done") {
      nuevoEstado = "done";
    }

    try {
      const respuesta = await fetch(`http://localhost:3000/tasks/${idTarea}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });

      if (respuesta.ok) {
        actualizarContadoresEnVivo();
      } else {
        alert("Hubo un problema al actualizar el estado en el servidor.");
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error);
    }
  },
};

function activarDragAndDrop() {
  Sortable.create(document.getElementById("list-todo"), opcionesSortable);
  Sortable.create(document.getElementById("list-doing"), opcionesSortable);
  Sortable.create(document.getElementById("list-done"), opcionesSortable);
}
