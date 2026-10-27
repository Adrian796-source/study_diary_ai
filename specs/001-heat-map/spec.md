# 1. Especificación de Requisitos: Mapa de Calor de Estudio (Heat Map)

## 1. Contexto y Objetivo
El Diario de Estudio actual permite registrar sesiones, visualizar rachas, minutos semanales y días del mes. El objetivo de esta funcionalidad es incorporar un mapa de calor visual (similar al de la actividad de GitHub) que permita al usuario ver de un vistazo su constancia y volumen de estudio a lo largo de las últimas semanas, utilizando una escala de colores basada en los minutos estudiados por día.

## 2. Usuarios
- **Estudiante autodidacta**: Usuario que utiliza el Diario de Estudio para registrar su progreso diario y que se motiva al visualizar su constancia temporal y la intensidad de su dedicación.

## 3. Historias de Usuario
- **HU-1**: Como estudiante, quiero ver un mapa de calor con mi actividad de estudio de las últimas semanas para identificar visualmente mis días más constantes y productivos.
- **HU-2**: Como estudiante, quiero que los días con más minutos de estudio muestren un color más intenso para autopercibir rápidamente las jornadas de mayor dedicación.
- **HU-3**: Como estudiante, quiero consultar el detalle exacto de minutos y fecha al interactuar con un día del mapa de calor, tanto en ordenador como en dispositivos táctiles.

## 4. Requisitos Funcionales (RF-x)
- **RF-1**: Cuando el usuario visualice la página principal, el sistema mostrará un mapa de calor que representará la actividad de estudio estructurada por columnas de lunes a domingo (hora local).
- **RF-2**: Si un día tiene sesiones de estudio registradas o corresponde a un día futuro de la semana en curso, el sistema asignará a ese día el nivel de intensidad máximo (actividad).
- **RF-3**: Si un día tiene sesiones registradas, el sistema sumará el total de minutos de todas las sesiones de ese día y le asignará un nivel de intensidad de color proporcional según los siguientes umbrales fijos:
  - **Nivel 1 (Baja)**: 1 a 30 minutos.
  - **Nivel 2 (Media)**: 31 a 60 minutos.
  - **Nivel 3 (Alta)**: 61 a 90 minutos.
  - **Nivel 4 (Máxima)**: 91 minutos o más.
- **RF-4**: Cuando el usuario interactúe con cualquier celda del mapa de calor (mediante `hover` o ratón o toque/clic en dispositivos táctiles), el sistema mostrará un indicador flotante o texto emergente con la fecha exacta y el total de minutos estudiados en esa jornada.
- **RF-5**: En la columna correspondiente a la semana en curso, el sistema mostrará los días transcurridos hasta hoy con su color de intensidad correspondiente, y los días futuros restantes de la semana se mostrarán con color vacío (Nivel 0).

## 5. Requisitos No Funcionales
- **RNF-1**: El mapa de calor debe respetar estrictamente la estructura de almacenamiento local (`localStorage`) existente bajo la clave `"diarioDeEstudioSesiones"`.
- **RNF-2**: La representación visual y los textos de la interfaz deben estar completamente en español.
- **RNF-3**: La funcionalidad debe operar de forma totalmente local en el navegador (`file://`) sin requerir servidores ni dependencias externas.

## 6. Casos Límite
- **Historial de actividad vacío**: Si no existen sesiones registradas en el `localStorage`, el mapa de calor mostrará todos los días de las últimas 12 semanas en el nivel de intensidad mínimo (sin actividad).
- **Actividad en el día de hoy/hora futura**: El cálculo de los días (lunes a domingo) y fechas debe realizarse estrictamente en hora local del dispositivo, evitando desajustes por UTC.
- **Múltiples sesiones en un día**: Si el usuario registra varias sesiones en el mismo día natural, los minutos se acumularán correctamente para determinar el nivel de intensidad de ese día único.
- **Pantalla con formato incorrecto o corrupto**: Si una sesión almacenada contiene datos inválidos o fechas con formato erróneo, el sistema los ignorará de forma silenciosa para evitar fallos en el renderizado del mapa de calor.

## 7. Fuera de Alcance
- Vistas personalizadas de rangos de tiempo superiores a 12 semanas (ej. selección de año completo o meses específicos).
- Funcionalidad de exportación o compartición del mapa de calor en redes sociales.
- Temas de colores personalizables por el usuario para el mapa de calor.

## 8. Criterios de Finalización
- El mapa de calor se renderiza correctamente en la interfaz principal reflejando de forma precisa los datos almacenados en el `localStorage`.
- La asignación de colores responde correctamente a los rangos de minutos acumulados por día.
- La interacción en dispositivos de escritorio (hover) y táctiles (toque/clic) muestra la información de manera clara y sin demoras.
- Se mantiene el cumplimiento estricto de las restricciones del proyecto (archivos puros, textos en español, sin dependencias ni servidor).

## 9. Dudas Abiertas
- **[Necesita Aclaración] Ninguna**: Todas las ambigüedades de diseño, umbrales y comportamientos en casos límite han sido resueltas.