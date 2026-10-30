# 📚 Study Diary AI

Una aplicación web moderna para registrar sesiones de estudio, mantener rachas de días consecutivos y visualizar la actividad mediante un mapa de calor. Este proyecto fue desarrollado aplicando un flujo de trabajo avanzado de Inteligencia Artificial utilizando **Spec-Driven Development (SDD)** con **OpenCode**.

## 🚀 Características Principales

- **Registro de Sesiones:** Interfaz para guardar la fecha, el tema y los minutos estudiados.
- **Cálculo de Rachas:** Algoritmo que calcula la racha actual y la mejor racha histórica, respetando reglas estrictas de fechas locales.
- **Mapa de Calor:** Visualización estilo GitHub (12 semanas) que colorea los días según la intensidad de estudio (Nivel 0 al 4).
- **Almacenamiento Local:** Los datos se guardan en el navegador (`localStorage`), garantizando privacidad y persistencia sin necesidad de un backend.
- **Diseño Responsive:** Interfaz moderna y adaptada para dispositivos móviles.

## 🧠 Metodología: Spec-Driven Development (SDD)

Este proyecto no se programó de forma tradicional. Se utilizó un flujo de trabajo guiado por especificaciones y asistido por agentes de IA (OpenCode + Gemini):

1. **Constitución (`docs/constitution.md`):** Definición de los 6 principios innegociables del proyecto (simplicidad, privacidad, idioma, etc.).
2. **Especificación (`specs/001-heat-map/spec.md`):** Redacción de requisitos funcionales (RF) en notación EARS, casos límite y criterios de aceptación.
3. **Planificación (`specs/001-heat-map/plan.md`):** Diseño de la arquitectura, funciones puras necesarias, pseudocódigo y estrategia de testing.
4. **Tareas (`specs/001-heat-map/tasks.md`):** División del trabajo en tareas atómicas y verificables.
5. **Implementación:** Escritura de tests (con `node --test`) antes que el código, y desarrollo asistido por IA.
6. **Validación:** Auditoría del código y verificación de requisitos usando herramientas de navegador (Chrome DevTools).

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
- **Testing:** Node.js (`node --test`).
- **Herramientas de IA:** OpenCode (Agentes `coordinator`, `planner`, `implementer`, `reviewer`), Gemini 3.5 Flash-Lite, Context7 (MCP).

## 📂 Estructura del Proyecto

```text
.
├── .agents/               # Skills y configuración de agentes IA
├── .opencode/             # Comandos personalizados y configuración global
├── docs/                  # Constitución del proyecto
├── specs/                 # Especificaciones, planes y tareas por funcionalidad
├── app.js                 # Lógica principal y manipulación del DOM
├── index.html             # Estructura de la interfaz
├── styles.css             # Estilos visuales
└── package.json           # Configuración de Node (para tests)
⚙️ Cómo Ejecutar el Proyecto
Clona este repositorio:

bash
git clone https://github.com/Adrian796-source/study_diary_ai.git
Navega a la carpeta del proyecto.

Abre el archivo index.html en tu navegador web favorito.

(Opcional) Para ejecutar los tests unitarios, abre una terminal y ejecuta:

bash
node --test
👨‍💻 Autor
Adrián Basta - GitHub | LinkedIn