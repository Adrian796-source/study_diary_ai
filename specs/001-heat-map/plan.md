# 5. Plan de Implementación: Mapa de Calor de Estudio (Heat Map)

## 1. Archivos a Modificar o Crear
Estrategia: Se mantiene la restricción del proyecto (stack exacto de 3 archivos: `index.html`, `styles.css`, `app.js`). No se añaden archivos ni dependencias.

- **`index.html`** *(se modifica)*:
  - Añadir el contenedor `<section id="heat-map">` donde se renderizará el mapa de calor y el elemento de tooltip / texto emergente para la interacción. *(Cubre: RF-1, RF-4)*
- **`styles.css`** *(se modifica)*:
  - Añadir los estilos para la cuadrícula del mapa de calor (distribución por semanas/días), los 4 niveles de intensidad de color (de más suave a más intenso) y los estilos del tooltip interactivo. *(Cubre: RF-1, RF-2, RF-3, RF-4)*
- **`app.js`** *(se modifica)*:
  - Añadir las funciones puras de lógica para procesar las sesiones, calcular rangos de fechas locales, agrupar minutos por día, determinar los niveles de intensidad y manejar el renderizado de la cuadrícula y tooltips. *(Cubre: RF-1, RF-2, RF-3, RF-4, RF-5)*

Este documento de planificación técnica detalla los puntos anteriores.

## 2. Funciones Puras de Lógica
Para asegurar la testabilidad y el cumplimiento de la regla de fecha local, se implementarán funciones puras que reciben `hoy` (Date) y los datos de sesiones como parámetros:

- **`obtenerFechaLocalISO(fecha)`**:
  - Devuelve un string en formato `"YYYY-MM-DD"` (local) usando los métodos del objeto Date (`getFullYear`, `getMonth`, `getDate`) ajustando el mes (`getMonth() + 1`) y añadiendo el cero a la izquierda si es necesario. *(Cubre: RF-1, RF-5)*
- **`agruparMinutosPorDia(sesiones)`**:
  - Recibe un array de sesiones, las filtra validando que tengan fecha y minutos válidos, y retorna un objeto o `Map` donde la clave es la fecha en formato `YYYY-MM-DD` (local) y el valor es el total de minutos de estudio de ese día. Filtra y descarta silenciosamente registros corruptos o inválidos. *(Cubre: RF-3, Casos Límite)*
- **`calcularNivelIntensidad(minutos)`**:
  - Recibe un número (minutos) y devuelve un entero de 0 a 4 según los umbrales:
    - 0 min = Nivel 0 (vacío)
    - 1 a 30 min = Nivel 1
    - 31 a 60 min = Nivel 2
    - 61 a 90 min = Nivel 3
    - 90 min o más = Nivel 4
  - *(Cubre: RF-2, RF-3)*
- **`construirMatrizCalor(sesiones, hoy)`**:
  - Retorna un array de 12 semanas, donde cada semana es un array de 7 objetos (días) con las propiedades: `fecha` (string ISO), `minutos` (número), `nivel` (0-4) y `esFuturo` (booleano). *(Cubre: RF-1, RF-2, RF-3, RF-5)*
- **`obtenerLunes(fecha)`**:
  - Retorna la fecha del lunes de la semana de la fecha dada.

## 3. Algoritmo del Mapa en Pseudocódigo

```text
función generarEstructuraCalor(sesiones, hoy):
    minutosPorDia = agruparMinutosPorDia(sesiones)
    finSemanaActual = obtenerLunes(hoy)
    semanas = []
    
    // Obtener el lunes de hace 12 semanas
    inicioMatriz = restarDias(finSemanaActual, 77) // 7 * 11 = 77. Desplaza 11 semanas, la 12 es la actual
    
    // Agrupar por semanas
    para i = 0 hasta 11: // 12 semanas
        semanaActual = []
        lunesDeSemana = sumarDias(inicioMatriz, (i * 7))
        
        // Calcular inicio y fin de semana
        para j = 0 hasta 6: // 7 días
            fechaDia = sumarDias(lunesDeSemana, j)
            fechaISO = obtenerFechaLocalISO(fechaDia)
            
            // Diferencia en días para saber si es futuro
            esFuturo = fechaDia > hoy
            
            si esFuturo:
                minutos = 0
                nivel = 0
            sino:
                minutos = minutosPorDia[fechaISO] || 0
                nivel = calcularNivelIntensidad(minutos)
            
            semanaActual.agregar({
                fecha: fechaISO,
                minutos: minutos,
                nivel: nivel,
                esFuturo: esFuturo
            })
            
        semanas.agregar(semanaActual)
        
    retornar semanas
fin función

## 4. Cómo se Pinta en la Interfaz
- **`index.html`**: Se añade un contenedor principal `<div id="heat-map-container">`. Dentro, se renderiza de forma dinámica un contenedor para los nombres de los días de la semana y otro para la cuadrícula de celdas `<div id="heat-map-grid">`. Además, se incluye un elemento oculto `<div id="heat-map-tooltip">` con el texto emergente. *(Cubre: RF-1, RF-4)*
- **`app.js`**: Se generan los elementos dinámicamente usando `document.createElement` para cada celda y se les asigna la clase CSS correspondiente al nivel. La interacción en escritorio se maneja con eventos `mouseover` y `mouseout` (o `mousemove`), y en dispositivos táctiles con `touchstart` y `touchend`. *(Cubre: RF-4, RF-5)*
- **`styles.css`**: Se definen los estilos para la cuadrícula usando `display: grid` con `grid-template-columns: repeat(7, 1fr)` o similar. Se crean las clases `.nivel-0`, `.nivel-1`, `.nivel-2`, `.nivel-3`, `.nivel-4` con los colores correspondientes (verde claro a oscuro). Las celdas futuras reciben un estilo específico de "vacío". *(Cubre: RF-1, RF-2, RF-3)*

## 5. Decisiones Técnicas Justificadas y Alternativas Descartadas
- **Uso de CSS Grid**: Para la cuadrícula se usará `display: grid` con `grid-template-columns: repeat(7, 1fr)` en lugar de `flexbox`. Grid es más adecuado para crear cuadrículas bidimensionales y alinea perfectamente las celdas sin cálculos de anchos. *(Cubre: RF-1, RF-2, RF-3, RF-4)*
- **Generación de elementos en JS**: Se usarán métodos del DOM (`createElement`, `appendChild`) en lugar de construir strings de HTML gigantes (`innerHTML`). Esto es más seguro, eficiente y permite añadir eventos de interacción de forma más limpia. *(Cubre: RF-4)*
- **Formato de fecha local**: Se implementará una función propia para formatear fechas usando los métodos locales (`getFullYear`, `getMonth`, `getDate`). Se descarta el uso de `toISOString()` porque convierte a UTC y podría causar desfases de un día según la zona horaria. *(Cubre: RF-5)*
- **Rango de 12 semanas**: Se calculará desde el lunes de la semana actual hacia atrás (restando 77 días). Esto asegura que siempre haya 12 semanas completas y la semana actual se muestre completa (con días futuros vacíos). *(Cubre: RF-1, RF-5)*

## 6. Estrategia de Pruebas con node --test
Se crearán pruebas unitarias para las funciones puras en un archivo separado (ej. `pruebas.js`) que se ejecutará con `node --test`. Se probarán los siguientes casos:
- **Casos de Nivel**: Probar que `calcularNivelIntensidad` devuelve 0 para 0 minutos, 1 para 30, 2 para 60, 3 para 90, 4 para 91, y que no da error con valores raros.
- **Agrupación de Días**: Probar que `agruparMinutosPorDia` suma correctamente las sesiones en el mismo día y devuelve los datos en el formato esperado.
- **Estructura de Matriz**: Probar que `construirMatrizCalor` devuelve un array de 12 arrays de 7 elementos, y que las fechas y niveles son correctos para días con y sin datos.