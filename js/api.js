const API_URL = "http://localhost:3000/tasks";

// Obtener todas las tareas
async function fetchTareas() {
  const respuesta = await fetch(API_URL);
  return await respuesta.json();
}

// Crear una tarea nueva
async function fetchCrearTarea(nuevaTarea) {
  return await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaTarea),
  });
}

// Obtener una tarea por ID
async function fetchTareaPorId(id) {
  const respuesta = await fetch(`${API_URL}/${id}`);
  return await respuesta.json();
}

// Obtener comentarios de una tarea
async function fetchComentariosPorTarea(id) {
  const respuesta = await fetch(
    `http://localhost:3000/comments?taskId=${String(id)}`,
  );
  return await respuesta.json();
}

// Actualizar una tarea por completo (PUT)
async function fetchActualizarTarea(id, tareaActualizada) {
  return await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tareaActualizada),
  });
}

// Guardar un nuevo comentario
async function fetchCrearComentario(nuevoComentario) {
  return await fetch("http://localhost:3000/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoComentario),
  });
}

// Eliminar un comentario específico
async function fetchEliminarComentario(idComentario) {
  return await fetch(`http://localhost:3000/comments/${idComentario}`, {
    method: "DELETE",
  });
}

// Eliminar una tarea específica
async function fetchEliminarTarea(idTarea) {
  return await fetch(`${API_URL}/${idTarea}`, {
    method: "DELETE",
  });
}
