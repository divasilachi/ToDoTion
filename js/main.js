/* ==========================================================================
   1. RENDERIZADO DEL TABLERO KANBAN
   ========================================================================== */
async function obtenerYMostrarTareas() {
  try {
    const tareas = await fetchTareas(); // Viene de api.js

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

    actualizarContadoresYBarras(contadorTodo, contadorDoing, contadorDone);
    activarDragAndDrop(); // Viene de drag-drop.js
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
}

function actualizarContadoresYBarras(todo, doing, done) {
  document.getElementById("count-todo").textContent = todo;
  document.getElementById("count-doing").textContent = doing;
  document.getElementById("count-done").textContent = done;

  document.getElementById("badge-todo").textContent = todo;
  document.getElementById("badge-doing").textContent = doing;
  document.getElementById("badge-done").textContent = done;

  const totalTareas = todo + doing + done;

  if (totalTareas > 0) {
    document.getElementById("bar-todo").style.width =
      `${(todo / totalTareas) * 100}%`;
    document.getElementById("bar-doing").style.width =
      `${(doing / totalTareas) * 100}%`;
    document.getElementById("bar-done").style.width =
      `${(done / totalTareas) * 100}%`;
  } else {
    document.getElementById("bar-todo").style.width = "0%";
    document.getElementById("bar-doing").style.width = "0%";
    document.getElementById("bar-done").style.width = "0%";
  }
}

function actualizarContadoresEnVivo() {
  let contadorTodo = document.getElementById("list-todo").children.length;
  let contadorDoing = document.getElementById("list-doing").children.length;
  let contadorDone = document.getElementById("list-done").children.length;
  actualizarContadoresYBarras(contadorTodo, contadorDoing, contadorDone);
}

/* ==========================================================================
   2. OPERACIONES CRUD: CREAR, EDITAR, COMENTAR Y ELIMINAR
   ========================================================================== */
// Formulario de Crear
document
  .getElementById("form-add-task")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nuevaTarea = {
      title: document.getElementById("input-title").value,
      description: document.getElementById("input-desc").value,
      priority: document.querySelector('input[name="priority"]:checked').value,
      dueDate: document.getElementById("input-date").value,
      status: "todo",
    };

    try {
      const respuesta = await fetchCrearTarea(nuevaTarea);
      if (respuesta.ok) {
        cerrarModal();
        await obtenerYMostrarTareas();
      }
    } catch (error) {
      console.error("Error al enviar la tarea:", error);
    }
  });

// Detectar clic en el botón de ver detalle de la tarjeta
document.addEventListener("click", async (evento) => {
  if (evento.target.classList.contains("btn-ver-detalle")) {
    const tarjetaPulsada = evento.target.closest(".task-card");
    const idTarea = tarjetaPulsada.getAttribute("data-id");
    try {
      const tarea = await fetchTareaPorId(idTarea);
      const comentarios = await fetchComentariosPorTarea(idTarea);
      rellenarModalEdicion(tarea, comentarios);
    } catch (error) {
      console.error("Error al abrir detalle:", error);
    }
  }
});

// Formulario de Editar
document
  .getElementById("form-edit-task")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const id = document.getElementById("edit-task-id").value;

    try {
      const tareaActual = await fetchTareaPorId(id);
      const tareaActualizada = {
        ...tareaActual,
        title: document.getElementById("edit-title").value,
        description: document.getElementById("edit-desc").value,
        priority: document.querySelector('input[name="edit-priority"]:checked')
          .value,
        dueDate: document.getElementById("edit-date").value,
        status: document.getElementById("edit-status").value,
      };

      const resPut = await fetchActualizarTarea(id, tareaActualizada);
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
      const respuesta = await fetchCrearComentario(nuevoComentario);
      if (respuesta.ok) {
        inputComentario.value = "";
        const tarea = await fetchTareaPorId(id);
        const comentarios = await fetchComentariosPorTarea(id);
        rellenarModalEdicion(tarea, comentarios);
      }
    } catch (error) {
      console.error("Error al añadir el comentario:", error);
    }
  });

// Eliminar tarea y comentarios en cascada
document
  .getElementById("btn-delete-task")
  .addEventListener("click", async () => {
    const id = document.getElementById("edit-task-id").value;

    if (
      confirm("¿Estás completamente seguro de que quieres eliminar esta tarea?")
    ) {
      try {
        const listaComentarios = await fetchComentariosPorTarea(id);
        if (listaComentarios && listaComentarios.length > 0) {
          for (const comentario of listaComentarios) {
            await fetchEliminarComentario(comentario.id);
          }
        }
        const respuestaTarea = await fetchEliminarTarea(id);
        if (respuestaTarea.ok) {
          cerrarModalEdicion();
          await obtenerYMostrarTareas();
        }
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    }
  });

document.addEventListener("DOMContentLoaded", obtenerYMostrarTareas);

/* ==========================================================================
   3. LÓGICA DE NAVEGACIÓN RESPONSIVE (MÓVIL)
   ========================================================================== */
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
