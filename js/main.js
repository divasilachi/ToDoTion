// 1. La dirección de nuestra Base de Datos local (URL del json-server)
const API_URL = "http://localhost:3000/tasks";

// 2. FUNCIÓN PRINCIPAL: Va a buscar las tareas al servidor y las pinta en la pantalla
// Usamos "async" para indicarle a JavaScript que esta función tarda unos milisegundos en completarse
async function obtenerYMostrarTareas() {
  try {
    // "await fetch" le dice al código: "¡Frena aquí! Espera a que el repartidor traiga los datos del servidor"
    const respuesta = await fetch(API_URL);

    // Transformamos la respuesta del servidor en una lista de tareas que JavaScript entienda (JSON)
    const tareas = await respuesta.json();

    // Antes de pintar, limpiamos las 3 columnas para que no se dupliquen las tarjetas
    document.getElementById("list-todo").innerHTML = "";
    document.getElementById("list-doing").innerHTML = "";
    document.getElementById("list-done").innerHTML = "";

    // Variables para llevar la cuenta de las estadísticas rápidas
    let contadorTodo = 0;
    let contadorDoing = 0;
    let contadorDone = 0;

    // 3. RECORRER LA LISTA DE TAREAS Y CREAR EL HTML DE CADA TARJETA
    tareas.forEach((tarea) => {
      // Creamos una caja blanca para la tarjeta
      const tarjetaHTML = `
                <article class="task-card" data-id="${tarea.id}">
                    <h3 class="card-title">${tarea.title}</h3>
                    <p class="card-desc">${tarea.description}</p>
                    <div class="card-footer">
                        <span class="badge-priority ${tarea.priority.toLowerCase()}">${tarea.priority}</span>
                        <span class="card-date">📅 ${tarea.limitDate}</span>
                    </div>
                </article>
            `;

      // Dependiendo del "status" de la tarea en el JSON, la metemos en su columna correspondiente
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

    // 4. ACTUALIZAR LOS MARCADORES DEL NUEVO PANEL DE ESTADÍSTICAS SUPERIOR
    document.getElementById("count-todo").textContent = contadorTodo;
    document.getElementById("count-doing").textContent = contadorDoing;
    document.getElementById("count-done").textContent = contadorDone;

    // También actualizamos los circulitos (badges) al lado de los títulos de las columnas
    document.getElementById("badge-todo").textContent = contadorTodo;
    document.getElementById("badge-doing").textContent = contadorDoing;
    document.getElementById("badge-done").textContent = contadorDone;
  } catch (error) {
    console.error(
      "¡Ups! Hubo un error al conectar con la base de datos:",
      error,
    );
  }
}

// 5. INICIAR LA APP: Le decimos al navegador que ejecute la función en cuanto la página termine de cargar
document.addEventListener("DOMContentLoaded", obtenerYMostrarTareas);
