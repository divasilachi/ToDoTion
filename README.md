# ToDoTion - Productive Workspace 🚀

**ToDoTion** es un tablero Kanban interactivo, minimalista y elegante diseñado para optimizar la gestión de proyectos y la organización de tareas en entornos ágiles. La aplicación se comunica de forma asíncrona con una API simulada local para ofrecer una experiencia fluida de usuario (SPA) y persistencia completa de datos.

---

## ✨ Características Técnicas

- **Arquitectura Asíncrona (GET):** Renderizado dinámico de tarjetas de tareas distribuidas en tres pizarras operativas (*Por Hacer*, *En Proceso* y *Finalizado*).
- **Indicador de Progreso Matemático:** Barra superior segmentada y contadores que recalculan en tiempo real el porcentaje exacto de avance del proyecto según el volumen de tareas.
- **Creación de Tareas (POST):** Formulario modal flotante con desenfoque de fondo (*backdrop-filter*) para registrar tareas con título, descripción, selector de prioridad por colores y fecha límite.
- **Buscador Predictivo:** Filtro en tiempo real integrado en la cabecera que discrimina instantáneamente las tarjetas por coincidencia de texto en el título.
- **Movimiento Persistente (PATCH):** Integración local de la librería `SortableJS` para arrastrar y soltar tarjetas entre columnas en ordenadores, actualizando el estado en la base de datos de fondo y de forma silenciosa.
- **Operaciones CRUD Completas (PUT/DELETE):** Modal detallado de información (`⚙ Info`) para editar textos, reasignar prioridades o eliminar el registro del servidor de forma definitiva.
- **Arquitectura de Datos Relacional:** Caja de comentarios interactiva por tarjeta. Los mensajes se almacenan en una colección independiente en la raíz del JSON (`/comments`), vinculándose asíncronamente con la tarea mediante consultas filtradas por el identificador único (`?taskId=`).
- **Navegación Móvil Avanzada (Responsive):** Menú hamburguesa interactivo en JS Vanilla y un selector de pestañas que muestra una única columna a pantalla completa en dispositivos móviles. Incorpora un selector de estado dentro del modal de información para mover tareas cómodamente en pantallas táctiles sin romper la maquetación.

---

## 🛠️ Estructura del Proyecto

El desarrollo se ha realizado utilizando **JavaScript Vanilla (puro)** y aplicando el **Principio de Separación de Intereses (SoI)** para modularizar el código:

- `index.html`: Estructura semántica nativa, accesibilidad y contenedores dinámicos del DOM.
- `css/base.css`: Centralización de la paleta de colores minimalista (`:root`) y reseteos globales.
- `css/layout.css`: Posicionamiento estructural del tablero con Flexbox y Media Queries de adaptabilidad móvil.
- `css/components.css`: Estilos minuciosos de las piezas reutilizables (tarjetas, píldoras de prioridad y modales).
- `js/Sortable.js`: Motor de la librería de arrastre descargado localmente para garantizar el funcionamiento autónomo de la app sin conexión a internet.
- `js/main.js`: Lógica principal de la aplicación, peticiones Fetch API, control de modales y flujos CRUD.
- `js/drag-drop.js`: Configuración y eventos táctiles de las pizarras Kanban compartidas.
- `db.json`: Base de datos simulada y estructurada en formato JSON estricto.

---

## 🧰 Tecnologías Utilizadas

- **HTML5** Semántico
- **CSS3** (Flexbox, Variables globales, Media Queries y Backdrop Filters)
- **JavaScript ES6+** (Async/Await y Fetch API)
- **SortableJS v1.15.0** (Integración local)
- **Node.js & json-server** (Mocking de API REST)

---

## 🚀 Instalación y Ejecución Local

Para poner en marcha este proyecto en tu entorno local, sigue estos pasos:

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org) en tu equipo.

### 1. Clonar el repositorio

```bash
git clone https://github.com
cd TU_REPOSITORIO
```

### 2. Instalar e iniciar json-server

Este proyecto requiere `json-server` para simular la API REST y gestionar la base de datos `db.json`. Tienes dos opciones para ejecutarlo:

#### Opción A: Ejecución directa con NPX (Recomendada, no requiere instalación global)
Abre una terminal en la ruta raíz del proyecto y ejecuta:
```bash
npx json-server --watch db.json --port 3000
```

#### Opción B: Instalación global
Si prefieres tenerlo disponible globalmente en tu sistema, instala el paquete y luego levanta el servidor:
```bash
npm install -g json-server
json-server --watch db.json --port 3000
```

Una vez ejecutado, la API estará disponible en `http://localhost:3000`. No cierres esta terminal.

### 3. Ejecutar la aplicación frontend

Para evitar problemas de CORS con las peticiones asíncronas de JavaScript, abre el archivo `index.html` utilizando un servidor local. 

- Si usas **VS Code**, se recomienda instalar la extensión **Live Server**, hacer clic derecho sobre `index.html` y seleccionar **Open with Live Server**.
