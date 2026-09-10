const API_URL = "http://localhost:3000/tasks";

const modalAddTask = document.getElementById("modal-add-task");
const formAddTask = document.getElementById("form-add-task");
const modalEditTask = document.getElementById("modal-edit-task");
const formEditTask = document.getElementById("form-edit-task");
const commentsLog = document.getElementById("comments-log");

const btnOpenAddModal = document.getElementById("btn-open-add-modal");
const btnCloseAddModal = document.getElementById("btn-close-add-modal");
const btnCancelAdd = document.getElementById("btn-cancel-add");
const btnCloseEditModal = document.getElementById("btn-close-edit-modal");
const btnCancelEdit = document.getElementById("btn-cancel-edit");
const searchBar = document.getElementById("search-bar");

/* ==========================================================================
   1. RENDERIZADO DEL TABLERO KANBAN
   ========================================================================== */
async function obtenerYMostrarTareas() {
  try {
    const respuesta = await fetch(API_URL);
    const tareas = await respuesta.json();

    document.getElementById("list-todo").innerHTML = "";
    document.getElementById("list-doing").innerHTML = "";
    document.getElementById("list-done").innerHTML = "";

    let contadorTodo = 0;
    let contadorDoing = 0;
    let contadorDone = 0;

    tareas.forEach((tarea) => {
      const tarjetaHTML = `
        <article class="task-card" data-id="${tarea.id}">
            <h3 class="card-title">${tarea.title}</h3>
            <p class="card-desc">${tarea.description}</p>
            <div class="card-footer">
                <span class="badge-priority ${tarea.priority.toLowerCase()}">${tarea.priority}</span>
                <span class="card-date">🗓︎ ${tarea.dueDate}</span>
                <span class="btn-ver-detalle" style="cursor: pointer; font-weight: 700; color: var(--secondary-forest); font-size: 11px;">⚙ Info</span>
            </div>
        </article>
      `;

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

    const totalTareas = contadorTodo + contadorDoing + contadorDone;

    if (totalTareas > 0) {
      const pctTodo = (contadorTodo / totalTareas) * 100;
      const pctDoing = (contadorDoing / totalTareas) * 100;
      const pctDone = (contadorDone / totalTareas) * 100;

      document.getElementById("bar-todo").style.width = `${pctTodo}%`;
      document.getElementById("bar-doing").style.width = `${pctDoing}%`;
      document.getElementById("bar-done").style.width = `${pctDone}%`;
    } else {
      document.getElementById("bar-todo").style.width = "0%";
      document.getElementById("bar-doing").style.width = "0%";
      document.getElementById("bar-done").style.width = "0%";
    }

    activarDragAndDrop();
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
}

/* ==========================================================================
   2. CONTROLADORES EN VIVO DE ESTADÍSTICAS
   ========================================================================== */
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

/* ==========================================================================
   3. MODAL DE CREACIÓN DE TAREAS (POST)
   ========================================================================== */
function abrirModal() {
  modalAddTask.style.display = "flex";
}

function cerrarModal() {
  modalAddTask.style.display = "none";
  formAddTask.reset();
}

btnOpenAddModal.addEventListener("click", abrirModal);
btnCloseAddModal.addEventListener("click", cerrarModal);
btnCancelAdd.addEventListener("click", cerrarModal);

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
    dueDate: fechaLimite,
    status: "todo",
  };

  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

/* ==========================================================================
   4. FILTRO DE BÚSQUEDA
   ========================================================================== */
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

/* ==========================================================================
   5. MODAL DE EDICIÓN Y DETALLE RELACIONAL
   ========================================================================== */
async function abrirModalEdicion(id) {
  try {
    const respuestaTarea = await fetch(`${API_URL}/${id}`);
    const tarea = await respuestaTarea.json();

    document.getElementById("edit-task-id").value = tarea.id;
    document.getElementById("edit-title").value = tarea.title;
    document.getElementById("edit-desc").value = tarea.description;
    document.getElementById("edit-date").value = tarea.dueDate;
    document.getElementById("edit-status").value = tarea.status;

    document.querySelector(
      `input[name="edit-priority"][value="${tarea.priority}"]`,
    ).checked = true;

    const respuestaComments = await fetch(
      `http://localhost:3000/comments?taskId=${String(id)}`,
    );
    const listaComentarios = await respuestaComments.json();

    commentsLog.innerHTML = "";

    if (listaComentarios && listaComentarios.length > 0) {
      listaComentarios.forEach((comentario) => {
        commentsLog.innerHTML += `
          <div class="comment-bubble">
            <strong style="font-size: 11px; color: var(--secondary-forest); display: block; margin-bottom: 2px;">
              ⚲ ${comentario.author || "Anónimo"}:
            </strong>
            <p style="margin: 0; font-size: 13px;">${comentario.text}</p>
          </div>`;
      });
    } else {
      commentsLog.innerHTML = `<p style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 10px;">No hay comentarios en esta tarea aún.</p>`;
    }

    modalEditTask.style.display = "flex";
  } catch (error) {
    console.error(
      "Error al obtener el detalle de la tarea y comentarios:",
      error,
    );
  }
}

function cerrarModalEdicion() {
  modalEditTask.style.display = "none";
  formEditTask.reset();
}

btnCloseEditModal.addEventListener("click", cerrarModalEdicion);
btnCancelEdit.addEventListener("click", cerrarModalEdicion);

document.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-ver-detalle")) {
    const tarjetaPulsada = evento.target.closest(".task-card");
    const idTarea = tarjetaPulsada.getAttribute("data-id");
    abrirModalEdicion(idTarea);
  }
});
// --- 6. OPERACIONES CRUD: ACTUALIZAR Y ELIMINAR ---
formEditTask.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = document.getElementById("edit-task-id").value;

  try {
    const resGet = await fetch(`${API_URL}/${id}`);
    const tareaActual = await resGet.json();

    const tareaActualizada = {
      ...tareaActual,
      title: document.getElementById("edit-title").value,
      description: document.getElementById("edit-desc").value,
      priority: document.querySelector('input[name="edit-priority"]:checked')
        .value,
      dueDate: document.getElementById("edit-date").value,
      status: document.getElementById("edit-status").value,
    };

    const resPut = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tareaActualizada),
    });

    if (resPut.ok) {
      cerrarModalEdicion();
      await obtenerYMostrarTareas();
    }
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
  }
});

// Añadir comentario nuevo
document
  .getElementById("btn-add-comment")
  .addEventListener("click", async () => {
    const id = document.getElementById("edit-task-id").value;
    const inputComentario = document.getElementById("input-new-comment");
    const textoComentario = inputComentario.value.trim();

    if (!textoComentario) return;

    const nuevoComentario = {
      taskId: String(id),
      author: "Equipo de desarrollo",
      text: textoComentario,
      createdAt: new Date().toISOString(),
    };

    try {
      const respuesta = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoComentario),
      });

      if (respuesta.ok) {
        inputComentario.value = "";
        await abrirModalEdicion(id);
      } else {
        alert("Hubo un problema al guardar tu comentario en el servidor.");
      }
    } catch (error) {
      console.error("Error al añadir el comentario relacional:", error);
    }
  });

// Eliminar tarea (DELETE)
document
  .getElementById("btn-delete-task")
  .addEventListener("click", async () => {
    const id = document.getElementById("edit-task-id").value;

    if (
      confirm("¿Estás completamente seguro de que quieres eliminar esta tarea?")
    ) {
      try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (respuesta.ok) {
          cerrarModalEdicion();
          await obtenerYMostrarTareas();
        }
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    }
  });

document.addEventListener("DOMContentLoaded", obtenerYMostrarTareas);

// --- 7. LÓGICA DE NAVEGACIÓN RESPONSIVE (MÓVIL) ---
const btnHamburger = document.getElementById("btn-hamburger");
const navMenuResponsive = document.getElementById("nav-menu-responsive");

if (btnHamburger && navMenuResponsive) {
  btnHamburger.addEventListener("click", () => {
    navMenuResponsive.classList.toggle("active");
  });
}

const pestañasSelectoras = document.querySelectorAll(".selector-tab");

pestañasSelectoras.forEach((pestaña) => {
  pestaña.addEventListener("click", () => {
    pestañasSelectoras.forEach((p) => p.classList.remove("active"));
    pestaña.classList.add("active");

    document
      .getElementById("column-todo")
      .classList.remove("active-mobile-view");
    document
      .getElementById("column-doing")
      .classList.remove("active-mobile-view");
    document
      .getElementById("column-done")
      .classList.remove("active-mobile-view");

    const idColumnaDestino = pestaña.getAttribute("data-target");
    document
      .getElementById(idColumnaDestino)
      .classList.add("active-mobile-view");
  });
});

function inicializarVistaMovil() {
  if (window.innerWidth <= 768) {
    document.getElementById("column-todo").classList.add("active-mobile-view");
  }
}
document.addEventListener("DOMContentLoaded", inicializarVistaMovil);
