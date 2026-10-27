// ==========================================
// Diario de Estudio — Lógica Principal (app.js)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias a los elementos del DOM exactos según AGENTS.md / index.html
    const sessionForm = document.getElementById('sessionForm');
    const dateInput = document.getElementById('date');
    const topicInput = document.getElementById('topic');
    const minutesInput = document.getElementById('minutes');
    
    const sessionList = document.getElementById('sessionList');
    const emptyState = document.getElementById('emptyState');
    
    const streakEl = document.getElementById('streak');
    const bestStreakEl = document.getElementById('bestStreak');
    const weekMinutesEl = document.getElementById('weekMinutes');
    const monthDaysEl = document.getElementById('monthDays');
    
    const clearDataBtn = document.getElementById('clearDataBtn');
    const toast = document.getElementById('toast');

    // Clave exacta requerida en LocalStorage según las reglas
    const STORAGE_KEY = 'diarioDeEstudioSesiones';
    const GOAL_STORAGE_KEY = 'diarioDeEstudioObjetivoSemanal';
    const DEFAULT_WEEKLY_GOAL = 180; // 3 horas por defecto

    // 2. Funciones de ayuda para fechas locales (REGLA ESTRICTA: NUNCA UTC)
    function fechaComoTexto(fecha) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    }

    function textoAFecha(texto) {
        const [anio, mes, dia] = texto.split('-').map(Number);
        return new Date(anio, mes - 1, dia);
    }

    const hoyFecha = new Date();
    const hoyStr = fechaComoTexto(hoyFecha);

    // Configurar fecha máxima en el input para bloquear fechas futuras (Regla dura)
    if (dateInput) {
        dateInput.max = hoyStr;
        dateInput.value = hoyStr;
    }

    // 3. Cargar sesiones guardadas al iniciar
    let sessions = loadSessions();
    renderApp();

    // 4. Manejar envío del formulario
    if (sessionForm) {
        sessionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const date = dateInput.value;
            const topic = topicInput.value.trim();
            const minutes = parseInt(minutesInput.value, 10);

            // Validaciones
            if (!date || !topic || isNaN(minutes) || minutes <= 0) {
                alert('Por favor completa todos los campos correctamente.');
                return;
            }

            // Bloquear fechas futuras en JS (por seguridad adicional)
            if (date > hoyStr) {
                alert('No se pueden registrar sesiones en fechas futuras.');
                return;
            }

            // Crear objeto de sesión requerido: { date, topic, minutes }
            const newSession = {
                id: 'sess_' + Date.now() + Math.random().toString(36).substring(2, 7),
                date,
                topic,
                minutes,
                createdAt: new Date().toISOString()
            };

            sessions.unshift(newSession);
            saveSessions(sessions);
            renderApp();

            // Resetear formulario manteniendo la fecha de hoy
            topicInput.value = '';
            minutesInput.value = '';
            dateInput.value = hoyStr;

            showToast('¡Sesión guardada con éxito!');
        });
    }

    // 5. Botón de limpiar / reiniciar diario
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de reiniciar tu diario? Se borrarán todas las sesiones.')) {
                sessions = [];
                saveSessions(sessions);
                renderApp();
                showToast('Diario reiniciado correctamente.');
            }
        });
    }

    // 6. Eliminar sesión individual (global para el onclick)
    window.deleteSession = function(id) {
        if (confirm('¿Eliminar esta sesión de estudio?')) {
            sessions = sessions.filter(s => s.id !== id);
            saveSessions(sessions);
            renderApp();
            showToast('Sesión eliminada.');
        }
    };

    // 7. LocalStorage Helpers
    function loadSessions() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.error('Error al cargar LocalStorage:', err);
            return [];
        }
    }

    function saveSessions(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (err) {
            console.error('Error al guardar en LocalStorage:', err);
        }
    }

    // 8. Renderizado general de la interfaz y estadísticas
    function renderApp() {
        renderList();
        updateStats();
        renderHeatMap();
    }

    function renderList() {
        if (!sessionList) return;
        sessionList.innerHTML = '';

        if (!sessions || sessions.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        // Ordenar por fecha descendiente y hora de creación
        const sorted = [...sessions].sort((a, b) => {
            if (b.date !== a.date) {
                return b.date.localeCompare(a.date);
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        sorted.forEach(session => {
            const li = document.createElement('li');
            const formattedDate = formatDateDisplay(session.date);

            li.innerHTML = `
                <div class="session-top">
                    <span class="session-topic">${escapeHTML(session.topic)}</span>
                    <div class="session-meta-badges">
                        <span class="badge badge-time">⏳ ${session.minutes} min</span>
                        <span class="badge">📅 ${formattedDate}</span>
                    </div>
                </div>
                <div class="session-footer">
                    <button class="btn-delete-session" onclick="deleteSession('${session.id}')" type="button">Eliminar</button>
                </div>
            `;
            sessionList.appendChild(li);
        });
    }

    // ==========================================
    // CÁLCULOS ESTRICTOS SEGÚN REGLAS DE AGENTS.md
    // ==========================================

    function updateStats() {
        const uniqueDates = [...new Set(sessions.map(s => s.date))].sort((a, b) => b.localeCompare(a));

        // 1. Racha actual (🔥)
        const currentStreak = calculateCurrentStreak(uniqueDates);
        if (streakEl) streakEl.textContent = `${currentStreak}`;

        // 2. Mejor racha (🏆)
        const bestStreak = calculateBestStreak(uniqueDates);
        if (bestStreakEl) bestStreakEl.textContent = `${bestStreak}`;

        // 3. Minutos de la semana (⏱️) - Lunes a Domingo (Hora local)
        const weekMins = calculateWeekMinutes(sessions);
        if (weekMinutesEl) weekMinutesEl.textContent = `${weekMins} min`;

        // 4. Días del mes (📅) - Desde el día 1 hasta hoy en curso
        const monthDays = calculateMonthDays(uniqueDates);
        if (monthDaysEl) monthDaysEl.textContent = `${monthDays} días`;

        // 5. Objetivo semanal y barra de progreso
        updateWeeklyGoalUI(weekMins);
    }

    function getWeeklyGoal() {
        try {
            const val = localStorage.getItem(GOAL_STORAGE_KEY);
            return val ? parseInt(val, 10) : DEFAULT_WEEKLY_GOAL;
        } catch (e) {
            return DEFAULT_WEEKLY_GOAL;
        }
    }

    function saveWeeklyGoal(goalMinutes) {
        try {
            localStorage.setItem(GOAL_STORAGE_KEY, goalMinutes.toString());
        } catch (e) {
            console.error('Error al guardar objetivo semanal', e);
        }
    }

    function updateWeeklyGoalUI(weekMins) {
        const goalText = document.getElementById('goalText');
        const goalPercentage = document.getElementById('goalPercentage');
        const goalProgressBar = document.getElementById('goalProgressBar');
        
        const currentGoal = getWeeklyGoal();
        const percentage = currentGoal > 0 ? Math.min(Math.round((weekMins / currentGoal) * 100), 100) : 0;
        const rawPercentage = currentGoal > 0 ? Math.round((weekMins / currentGoal) * 100) : 0;

        if (goalText) goalText.textContent = `Progreso: ${weekMins} / ${currentGoal} min`;
        if (goalPercentage) goalPercentage.textContent = `${rawPercentage}%`;
        if (goalProgressBar) goalProgressBar.style.width = `${percentage}%`;
    }

    // Manejo del formulario de objetivo semanal
    const editGoalBtn = document.getElementById('editGoalBtn');
    const goalFormContainer = document.getElementById('goalFormContainer');
    const goalForm = document.getElementById('goalForm');
    const goalInput = document.getElementById('goalInput');
    const cancelGoalBtn = document.getElementById('cancelGoalBtn');

    if (editGoalBtn && goalFormContainer && goalForm && goalInput) {
        editGoalBtn.addEventListener('click', () => {
            goalInput.value = getWeeklyGoal();
            goalFormContainer.classList.toggle('hidden');
        });

        if (cancelGoalBtn) {
            cancelGoalBtn.addEventListener('click', () => {
                goalFormContainer.classList.add('hidden');
            });
        }

        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newGoal = parseInt(goalInput.value, 10);
            if (isNaN(newGoal) || newGoal <= 0) {
                alert('Por favor introduce un número válido de minutos.');
                return;
            }
            saveWeeklyGoal(newGoal);
            goalFormContainer.classList.add('hidden');
            renderApp();
            showToast('¡Objetivo semanal actualizado!');
        });
    }

    // Racha actual (regla de que si ayer se estudió y hoy todavía no, la racha sigue viva)
    function calculateCurrentStreak(uniqueDates) {
        if (uniqueDates.length === 0) return 0;

        const ayerFecha = new Date(hoyFecha.getFullYear(), hoyFecha.getMonth(), hoyFecha.getDate() - 1);
        const ayerStr = fechaComoTexto(ayerFecha);

        const latest = uniqueDates[0];
        // Si el último día con sesión es anterior a ayer, la racha actual es 0
        if (latest !== hoyStr && latest !== ayerStr) {
            return 0;
        }

        let streak = 0;
        let expected = textoAFecha(latest);

        for (let i = 0; i < uniqueDates.length; i++) {
            const expectedStr = fechaComoTexto(expected);
            if (uniqueDates[i] === expectedStr) {
                streak++;
                expected.setDate(expected.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }

    // Mejor racha (cadena más larga de todo el historial, incluye actual, sin regla de viva/rota)
    function calculateBestStreak(uniqueDates) {
        if (uniqueDates.length === 0) return 0;

        // uniqueDates está ordenado de más reciente a más antiguo (descendente)
        // Para calcular rachas consecutivas, conviene ordenar ascendente o recorrer comprobando
        const ascDates = [...uniqueDates].sort((a, b) => a.localeCompare(b));

        let maxStreak = 0;
        let currentStreak = 0;
        let prevDate = null;

        for (const dateStr of ascDates) {
            if (!prevDate) {
                currentStreak = 1;
            } else {
                const prev = textoAFecha(prevDate);
                const curr = textoAFecha(dateStr);
                const diffTime = curr - prev;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays === 1) {
                    currentStreak++;
                } else if (diffDays > 1) {
                    currentStreak = 1;
                }
                // Si diffDays === 0 es el mismo día (imposible porque uniqueDates no tiene duplicados)
            }
            prevDate = dateStr;
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
        }

        // Asegurar invariante: mejor racha >= racha actual
        const current = calculateCurrentStreak(uniqueDates);
        return Math.max(maxStreak, current);
    }

    // Minutos de la semana (Lunes a Domingo, hora local)
    function calculateWeekMinutes(sessionList) {
        // Encontrar el lunes de la semana actual (Lunes = 1, Domingo = 0 en getDay())
        const dayOfWeek = hoyFecha.getDay();
        const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        const lunesFecha = new Date(hoyFecha.getFullYear(), hoyFecha.getMonth(), hoyFecha.getDate() - distanceToMonday);
        const lunesStr = fechaComoTexto(lunesFecha);

        let totalMins = 0;
        for (const s of sessionList) {
            // Entre lunes y hoy (inclusive)
            if (s.date >= lunesStr && s.date <= hoyStr) {
                totalMins += (parseInt(s.minutes, 10) || 0);
            }
        }
        return totalMins;
    }

    // Días únicos del mes en curso (desde el día 1 hasta hoy local)
    function calculateMonthDays(uniqueDates) {
        const anioActual = hoyFecha.getFullYear();
        const mesActual = String(hoyFecha.getMonth() + 1).padStart(2, '0');
        const inicioMesStr = `${anioActual}-${mesActual}-01`;

        let count = 0;
        for (const d of uniqueDates) {
            if (d >= inicioMesStr && d <= hoyStr) {
                count++;
            }
        }
        return count;
    }

    // ==========================================
    // LÓGICA Y RENDERIZADO DEL MAPA DE CALOR
    // ==========================================

    function determinarNivelIntensidad(minutos) {
        if (minutos <= 0 || isNaN(minutos)) return 0;
        if (minutos <= 30) return 1;
        if (minutos <= 60) return 2;
        if (minutos <= 90) return 3;
        return 4;
    }

    function agruparMinutosPorDia(sesionesList) {
        const mapa = {};
        if (!Array.isArray(sesionesList)) return mapa;
        
        for (const s of sesionesList) {
            if (!s || typeof s.date !== 'string' || isNaN(s.minutes)) continue;
            const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
            if (!regexFecha.test(s.date)) continue;
            
            const mins = parseInt(s.minutes, 10);
            if (mins <= 0) continue;
            
            mapa[s.date] = (mapa[s.date] || 0) + mins;
        }
        return mapa;
    }

    function generarEstructuraMapaCalor(sesionesList, hoy) {
        const minutosPorDia = agruparMinutosPorDia(sesionesList);
        
        const diaActualLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const diaSemanaHoy = diaActualLocal.getDay(); // 0 = Domingo, 1 = Lunes
        const diaSemanaLunes1 = diaSemanaHoy === 0 ? 7 : diaSemanaHoy;
        
        // Retroceder 11 semanas completas + días transcurridos de la semana actual hasta el lunes
        const diasAtrasInicio = (11 * 7) + (diaSemanaLunes1 - 1);
        const fechaInicio = new Date(diaActualLocal.getFullYear(), diaActualLocal.getMonth(), diaActualLocal.getDate() - diasAtrasInicio);
        
        const semanas = [];
        let fechaIteracion = new Date(fechaInicio);
        
        while (fechaIteracion <= diaActualLocal || (fechaIteracion.getDay() !== 1 && fechaIteracion <= new Date(diaActualLocal.getFullYear(), diaActualLocal.getMonth(), diaActualLocal.getDate() + (7 - diaSemanaLunes1)))) {
            const semanaActual = [];
            for (let i = 0; i < 7; i++) {
                const fechaStr = fechaComoTexto(fechaIteracion);
                const esFuturo = fechaIteracion > diaActualLocal;
                
                let minutos = 0;
                let nivel = 0;
                
                if (!esFuturo) {
                    minutos = minutosPorDia[fechaStr] || 0;
                    nivel = determinarNivelIntensidad(minutos);
                }
                
                semanaActual.push({
                    fecha: fechaStr,
                    minutos: minutos,
                    nivel: nivel,
                    esFuturo: esFuturo
                });
                
                fechaIteracion.setDate(fechaIteracion.getDate() + 1);
            }
            semanas.push(semanaActual);
            
            if (fechaIteracion > diaActualLocal && fechaIteracion.getDay() === 1) {
                break;
            }
        }
        
        return semanas;
    }

    function renderHeatMap() {
        const container = document.getElementById('heatmapContainer');
        const tooltip = document.getElementById('heatmapTooltip');
        if (!container) return;

        container.innerHTML = '';
        const semanas = generarEstructuraMapaCalor(sessions, hoyFecha);

        semanas.forEach(semana => {
            const col = document.createElement('div');
            col.className = 'heatmap-column';

            semana.forEach(celda => {
                const cellEl = document.createElement('div');
                cellEl.className = 'heatmap-cell';
                cellEl.setAttribute('data-level', celda.nivel);

                // Eventos para el Tooltip (Escritorio y Táctil)
                const mostrarInfo = (e) => {
                    if (!tooltip) return;
                    const fechaFmt = formatDateDisplay(celda.fecha);
                    const textoMins = celda.minutos > 0 ? `${celda.minutos} minutos` : 'Sin actividad';
                    tooltip.textContent = `${fechaFmt}: ${textoMins}`;
                    tooltip.classList.remove('hidden');
                };

                const ocultarInfo = () => {
                    if (!tooltip) return;
                    tooltip.classList.add('hidden');
                };

                cellEl.addEventListener('mouseenter', mostrarInfo);
                cellEl.addEventListener('mouseleave', ocultarInfo);
                cellEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (tooltip.classList.contains('hidden')) {
                        mostrarInfo();
                    } else {
                        ocultarInfo();
                    }
                });

                col.appendChild(cellEl);
            });

            container.appendChild(col);
        });
    }

    // Formatear fecha para mostrar
    function formatDateDisplay(dateStr) {
        try {
            const date = textoAFecha(dateStr);
            return date.toLocaleDateString('es-ES', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
});
