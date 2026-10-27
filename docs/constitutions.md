

```markdown
# Constitucion del Diario de Estudio

1. **Simplicidad del stack**: Exactamente tres archivos (`index.html`, `styles.css`, `app.js`), sin dependencias, frameworks ni pasos de build.
2. **Ejecucion directa**: Debe funcionar abriendo `index.html` directamente en el navegador (`file://`) sin necesidad de servidor web.
3. **Alineacion estricta con la Spec**: Toda funcionalidad y calculo de metricas (racha, mejor racha, semana, mes) debe seguir exactamente las reglas definidas en `AGENTS.md`.
4. **Politica de pruebas**: Sin tests automaticos ni dependencias externas; la verificacion se realiza a mano o mediante herramientas de navegador (Chrome DevTools).
5. **Privacidad y datos de usuario**: Todos los datos se almacenan de forma local en `localStorage` bajo la clave `diarioDeEstudioSesiones`, sin enviar informacion a servidores externos.
6. **Idioma y claridad educativa**: Todos los textos de la interfaz y los comentarios del codigo fuente deben estar redactados en español para facilitar el aprendizaje.
```