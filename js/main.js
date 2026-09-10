const API_URL = "http://localhost:3000/tasks";

const modalAddTask = document.getElementById("modal-add-task");
const btnOpenAddModal = document.getElementById("btn-open-add-modal");
const btnCloseAddModal = document.getElementById("btn-close-add-modal");
const btnCancelAdd = document.getElementById("btn-cancel-add");
const formAddTask = document.getElementById("form-add-task");

async function obtenerYMostrarTareas() {
  try {
    const respuesta = await fetch(API_URL);
    const tareas = await respuesta.json(); //

    document.getElementById("list-todo").innerHTML = "";
    document.getElementById("list-doing").innerHTML = "";
    document.getElementById("list-done").innerHTML = "";

    let contadorTodo = 0;
    let contadorDoing = 0;
    let contadorDone = 0;

    tareas.forEach((tarea) => {
      //
      const tarjetaHTML = `
                <article class="task-card" data-id="${tarea.id}">
                    <h3 class="card-title">${tarea.title}</h3>
                    <p class="card-desc">${tarea.description}</p>
                    <div class="card-footer">
                        <span class="badge-priority ${tarea.priority.toLowerCase()}">${tarea.priority}</span>
                        <span class="card-date">🗓︎ ${tarea.limitDate}</span>
                    </div>
                </article>
            `; //

      if (tarea.status === "todo") {
        document.getElementById("list-todo").innerHTML += tarjetaHTML;
        contadorTodo++;
      } else if (tarea.status === "doing") {
        document.getElementById("list-doing").innerHTML += tarjetaHTML;
        contadorDoing++;
      } else if (tarea.status === "done") {
        document.getElementById("list-done").innerHTML += tarjetaHTML;
        contadorDone++;
      }
    });

    document.getElementById("count-todo").textContent = contadorTodo;
    document.getElementById("count-doing").textContent = contadorDoing;
    document.getElementById("count-done").textContent = contadorDone;

    document.getElementById("badge-todo").textContent = contadorTodo;
    document.getElementById("badge-doing").textContent = contadorDoing;
    document.getElementById("badge-done").textContent = contadorDone;

    const totalTareas = contadorTodo + contadorDoing + contadorDone; //

    if (totalTareas > 0) {
      const pctTodo = (contadorTodo / totalTareas) * 100; //
      const pctDoing = (contadorDoing / totalTareas) * 100; //
      const pctDone = (contadorDone / totalTareas) * 100; //

      document.getElementById("bar-todo").style.width = `${pctTodo}%`; //
      document.getElementById("bar-doing").style.width = `${pctDoing}%`; //
      document.getElementById("bar-done").style.width = `${pctDone}%`; //
    } else {
      document.getElementById("bar-todo").style.width = "0%"; //
      document.getElementById("bar-doing").style.width = "0%"; //
      document.getElementById("bar-done").style.width = "0%"; //
    }
    activarDragAndDrop();
  } catch (error) {
    console.error(
      "¡Ups! Hubo un error al conectar con la base de datos:",
      error,
    );
  }
}

function abrirModal() {
  //
  modalAddTask.style.display = "flex"; //
}

function cerrarModal() {
  //
  modalAddTask.style.display = "none"; //
  formAddTask.reset(); //
}

btnOpenAddModal.addEventListener("click", abrirModal); //
btnCloseAddModal.addEventListener("click", cerrarModal); //
btnCancelAdd.addEventListener("click", cerrarModal); //

document.addEventListener("DOMContentLoaded", obtenerYMostrarTareas); //

formAddTask.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const titulo = document.getElementById("input-title").value;
  const descripcion = document.getElementById("input-desc").value;
  const prioridad = document.querySelector(
    'input[name="priority"]:checked',
  ).value;
  const fechaLimite = document.getElementById("input-date").value;

  const nuevaTarea = {
    title: titulo,
    description: descripcion,
    priority: prioridad,
    limitDate: fechaLimite,
    status: "todo",
    comments: [],
  };

  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaTarea),
    });

    if (respuesta.ok) {
      cerrarModal();
      await obtenerYMostrarTareas();
    } else {
      alert("Hubo un problema al guardar la tarea en el servidor.");
    }
  } catch (error) {
    console.error("Error al enviar la tarea:", error);
  }
});

const searchBar = document.getElementById("search-bar");

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
function actualizarContadoresEnVivo() {
  let contadorTodo = document.getElementById("list-todo").children.length;
  let contadorDoing = document.getElementById("list-doing").children.length;
  let contadorDone = document.getElementById("list-done").children.length;

  document.getElementById("count-todo").textContent = contadorTodo;
  document.getElementById("count-doing").textContent = contadorDoing;
  document.getElementById("count-done").textContent = contadorDone;

  document.getElementById("badge-todo").textContent = contadorTodo;
  document.getElementById("badge-doing").textContent = contadorDoing;
  document.getElementById("badge-done").textContent = contadorDone;

  const total = contadorTodo + contadorDoing + contadorDone;
  if (total > 0) {
    document.getElementById("bar-todo").style.width =
      `${(contadorTodo / total) * 100}%`;
    document.getElementById("bar-doing").style.width =
      `${(contadorDoing / total) * 100}%`;
    document.getElementById("bar-done").style.width =
      `${(contadorDone / total) * 100}%`;
  }
}
