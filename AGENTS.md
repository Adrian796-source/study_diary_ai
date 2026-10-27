# AGENTS.md — Diario de Estudio

## Qué es esto
Un registro sencillo de sesiones de estudio ("Diario de Estudio") que muestra la racha de días consecutivos estudiando, el total de minutos de la semana y los días estudiados este mes. Es un proyecto de aprendizaje hecho desde cero; mantenlo simple.

## Restricciones duras
- Exactamente tres archivos: `index.html`, `styles.css` y `app.js`. Sin build, sin dependencias, sin frameworks ni librerías.
- Tiene que funcionar abriendo `index.html` directamente (`file://`), sin servidor.
- Todos los textos de la interfaz en español, y los comentarios del código también (el usuario está aprendiendo).
- No añadas funcionalidades, archivos ni librerías que no se hayan pedido.

## Datos
- Las sesiones se guardan en `localStorage` con la clave `diarioDeEstudioSesiones`: un array de `{ date, topic, minutes }`.
- `date` es un texto `AAAA-MM-DD`; `minutes` es un número mayor que 0; `topic` es un texto no vacío.
- El formulario **no permite fechas futuras**: se bloquean con el atributo `max` del input y una comprobación en JS.

## Fechas (fácil de equivocarse)
- Usa siempre la fecha **local**, nunca UTC. Construye las fechas con `new Date(anio, mes - 1, dia)` y formatéalas con los métodos locales (`getFullYear`, `getMonth`, `getDate`).

## Forma de trabajar
- Haz solo lo que se pide: no añadas funcionalidades por tu cuenta.
- Cambios pequeños y enfocados; no reescribas lo que ya funciona.
- Al terminar, resume qué has cambiado y cualquier decisión que deba revisar.

## Memoria
- Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- Si algo se convierte en una regla permanente, propón moverlo a `AGENTS.md` en lugar de dejarlo en la memoria.
- No guardes nunca datos sensibles (claves, tokens, datos personales).

## Comandos
- Tests: `node --test`

## Reglas
- Lee `docs/constitution.md` y la spec activa (`specs/NNN-*/`) antes de tocar código.

## Constitución
- El proyecto se rige por los 6 principios innegociables definidos en `docs/constitution.md` (stack puro sin dependencias, ejecución `file://`, alineación con Spec, pruebas sin dependencias, privacidad local y código/textos en español).

## Límites
- ✅ Siempre: respetar las reglas de fechas y racha, mantener los textos en español.
- ⚠️ Pregunta antes: crear archivos nuevos, cambiar el formato de los datos guardados.
- ⛔ Nunca: añadir dependencias, frameworks o un paso de build.

## Verificación
- No hay tests ni lint. Probar abriendo `index.html` en el navegador.
- Para empezar de cero: DevTools → Application → Local Storage → borrar la clave `diarioDeEstudioSesiones`.

## Regla de la racha
- Un día cuenta si tiene al menos una sesión.
- La racha son los días consecutivos que terminan hoy.
- Si hoy todavía no hay sesión pero ayer sí, la racha sigue viva: solo se rompe cuando termina el día.
- Si el último día con sesión es anterior a ayer, la racha es 0.

## Regla de la mejor racha
- Es la cadena de días consecutivos más larga de **todo el historial**, mire donde mire.
- No depende de hoy: **no** se le aplica la regla de "sigue viva / se rompe".
- Incluye la racha actual en curso. Invariante: **mejor racha ≥ racha actual**.
- Un día cuenta si tiene al menos una sesión; varias sesiones el mismo día cuentan como un solo día.

## Regla de la semana de estudio
- La semana empieza el lunes y termina el domingo (hora local).
- Suma los minutos de todas las sesiones registradas entre el lunes de la semana actual y hoy.
- Si hay varias sesiones en un mismo día, se suman los minutos de todas ellas.

## Regla de los días del mes
- Cuenta los días únicos con al menos una sesión en el mes en curso (desde el día 1 hasta hoy en hora local).
- Si hay varias sesiones en un mismo día, cuenta como 1 solo día.

## Cómo comprobarlo (a mano, sin ejecutor de tests)
1. Abre `index.html` y añade una sesión con la fecha de hoy → la racha muestra 1 🔥.
2. Añade una con la fecha de ayer → la racha muestra 2 🔥.
3. Recarga la página → las sesiones se mantienen.
4. Casos ya verificados como correctos: solo hoy = 1; hoy + ayer = 2; solo ayer = 1; anteayer = 0.
5. Mejor racha: 3 días seguidos el mes pasado + hoy solo → mejor racha = 3, racha actual = 1.
6. Minutos de la semana: dos sesiones hoy de 30 y 15 min → muestra 45 min ⏱️; sesión del domingo anterior no suma.
7. Días del mes: dos sesiones hoy en distinta hora → muestra 1 día 📅.
## Verificación
- No hay tests automáticos. Después de cada cambio, verifica con el MCP de Chrome DevTools: abre `index.html`, prueba la funcionalidad, revisa la consola y comprueba la vista móvil.
- Para empezar de cero: DevTools -> Application -> Local Storage -> borrar la clave `diario-estudio-sesiones`.