# Spec: 002-objetivo Semanal de Estudio

## Resumen
Añadir una funcionalidad para que el usuario pueda fijar un objetivo semanal de minutos de estudio y visualizar el progreso actual (minutos acumulados en la semana actual) para motivarse a cumplirlo.

## Requisitos Funcionales (RF)
- **RF-1**: El usuario debe poder configurar/fijar un número de minutos objetivo para la semana actual.
- **RF-2**: El sistema debe calcular automáticamente los minutos estudiados en la semana actual (de lunes a domingo) basándose en las sesiones de estudio registradas en el diario.
- **RF-3**: El sistema debe mostrar visualmente el progreso actual (minutos realizados vs minutos objetivo) de forma clara en la interfaz o vista principal del diario.

## Criterios de Aceptación
1. Al acceder al diario, el usuario ve el objetivo semanal configurado y el progreso acumulado de la semana en curso.
2. Si el usuario establece o fija el objetivo semanal, este se guarda y se actualiza la visualización del progreso.
3. Las sesiones registradas suman automáticamente los minutos a la semana correspondiente (lunes a domingo).