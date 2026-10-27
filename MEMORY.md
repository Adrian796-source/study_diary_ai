# Memoria — Diario de Estudio

## Estado actual
- Añadida la funcionalidad de **Objetivo Semanal de Estudio** (Spec 002): permite fijar los minutos deseados por semana, calcula el progreso automáticamente de lunes a domingo y muestra una barra de progreso interactiva.
- App totalmente rediseñada con un estilo visual moderno, elegante y oscuro.
- Creada la **Constitución del proyecto** en `docs/constitution.md` con los 6 principios innegociables.
- Manteniendo estrictamente las restricciones duras: exactamente tres archivos (`index.html`, `styles.css`, `app.js`), sin dependencias ni build.

## Stack y estructura
- HTML + CSS + JS puros.
- `index.html`: estructura limpia con cabecera, métricas en cuadrícula, widget de objetivo semanal con barra de progreso, formulario de registro y lista de sesiones.
- `styles.css`: diseño visual moderno, tipografía clara, tarjetas con sombras suaves y estados interactivos.
- `app.js`: lógica de persistencia en `localStorage` con la clave `diarioDeEstudioSesiones` y `diarioDeEstudioObjetivoSemanal`, cálculo preciso de racha actual, mejor racha, minutos semanales, progreso del objetivo y días del mes (con manejo estricto de fechas locales).

## Cómo verificar
1. Abrir `index.html` en el navegador.
2. Añadir una sesión de hoy -> racha actual muestra `1 🔥`.
3. Comprobar el objetivo semanal y modificar los minutos objetivo.
4. Para reiniciar datos: botón "Reiniciar diario" o en DevTools -> Application -> Local Storage -> borrar claves.

## Decisiones tomadas
- **Objetivo Semanal**: Persistencia en `localStorage` con clave `diarioDeEstudioObjetivoSemanal` (por defecto 180 min), barra de progreso dinámica y opción de edición en línea.
- **Rediseño UI**: Se ha aplicado un tema moderno oscuro con paleta índigo, bordes sutiles y tipografía optimizada para una experiencia de usuario prémium sin perder la simplicidad del proyecto educativo.
- **Constitución**: Se ha creado `docs/constitution.md` para fijar formalmente los 6 principios del proyecto.
- **Respeto absoluto al contrato técnico**: Se han mantenido intactos los IDs de elementos y claves de almacenamiento requeridos por `AGENTS.md`.
