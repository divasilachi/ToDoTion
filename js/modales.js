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

function abrirModal() {
  modalAddTask.style.display = "flex";
}

function cerrarModal() {
  modalAddTask.style.display = "none";
  formAddTask.reset();
}

function cerrarModalEdicion() {
  modalEditTask.style.display = "none";
  formEditTask.reset();
}

// Eventos de control de modales
if (btnOpenAddModal) btnOpenAddModal.addEventListener("click", abrirModal);
if (btnCloseAddModal) btnCloseAddModal.addEventListener("click", cerrarModal);
if (btnCancelAdd) btnCancelAdd.addEventListener("click", cerrarModal);
if (btnCloseEditModal)
  btnCloseEditModal.addEventListener("click", cerrarModalEdicion);
if (btnCancelEdit) btnCancelEdit.addEventListener("click", cerrarModalEdicion);

// Cargar la información en el modal de edición
function rellenarModalEdicion(tarea, listaComentarios) {
  document.getElementById("edit-task-id").value = tarea.id;
  document.getElementById("edit-title").value = tarea.title;
  document.getElementById("edit-desc").value = tarea.description;
  document.getElementById("edit-date").value = tarea.dueDate;
  document.getElementById("edit-status").value = tarea.status;

  document.querySelector(
    `input[name="edit-priority"][value="${tarea.priority}"]`,
  ).checked = true;

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
}
