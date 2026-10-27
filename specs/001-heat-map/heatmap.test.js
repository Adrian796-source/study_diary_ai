// ==========================================
// Tests unitarios para el Mapa de Calor (T1)
// ==========================================
import test from 'node:test';
import assert from 'node:assert';

// Importar o redefinir las funciones puras requeridas para la lógica del mapa de calor
// (Estas funciones se integrarán posteriormente en app.js)

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

function determinarNivelIntensidad(minutos) {
    if (minutos <= 0 || isNaN(minutos)) return 0;
    if (minutos <= 30) return 1;
    if (minutos <= 60) return 2;
    if (minutos <= 90) return 3;
    return 4;
}

function agruparMinutosPorDia(sesiones) {
    const mapa = {};
    if (!Array.isArray(sesiones)) return mapa;
    
    for (const s of sesiones) {
        if (!s || typeof s.date !== 'string' || isNaN(s.minutes)) continue;
        // Validar formato de fecha AAAA-MM-DD simple
        const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
        if (!regexFecha.test(s.date)) continue;
        
        const mins = parseInt(s.minutes, 10);
        if (mins <= 0) continue;
        
        mapa[s.date] = (mapa[s.date] || 0) + mins;
    }
    return mapa;
}

function generarEstructuraMapaCalor(sesiones, hoy) {
    const minutosPorDia = agruparMinutosPorDia(sesiones);
    
    const diaActualLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const diaSemanaHoy = diaActualLocal.getDay(); // 0 = Domingo, 1 = Lunes
    const diaSemanaLunes1 = diaSemanaHoy === 0 ? 7 : diaSemanaHoy;
    
    // Retroceder 11 semanas completas + días transcurridos de la semana actual hasta el lunes
    const diasAtrasInicio = (11 * 7) + (diaSemanaLunes1 - 1);
    const fechaInicio = new Date(diaActualLocal.getFullYear(), diaActualLocal.getMonth(), diaActualLocal.getDate() - diasAtrasInicio);
    
    const semanas = [];
    let fechaIteracion = new Date(fechaInicio);
    
    while (fechaIteracion <= diaActualLocal || fechaIteracion.getDay() !== 1 && fechaIteracion <= new Date(diaActualLocal.getFullYear(), diaActualLocal.getMonth(), diaActualLocal.getDate() + (7 - diaSemanaLunes1))) {
        // Generar una semana completa (lunes a domingo)
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
        
        // Si ya pasamos o cubrimos el día actual y terminamos la semana, parar
        if (fechaIteracion > diaActualLocal && fechaIteracion.getDay() === 1) {
            break;
        }
    }
    
    return semanas;
}

test('determinarNivelIntensidad asigna correctamente los niveles', () => {
    assert.strictEqual(determinarNivelIntensidad(0), 0);
    assert.strictEqual(determinarNivelIntensidad(-10), 0);
    assert.strictEqual(determinarNivelIntensidad(15), 1);
    assert.strictEqual(determinarNivelIntensidad(30), 1);
    assert.strictEqual(determinarNivelIntensidad(45), 2);
    assert.strictEqual(determinarNivelIntensidad(60), 2);
    assert.strictEqual(determinarNivelIntensidad(75), 3);
    assert.strictEqual(determinarNivelIntensidad(90), 3);
    assert.strictEqual(determinarNivelIntensidad(95), 4);
    assert.strictEqual(determinarNivelIntensidad(120), 4);
});

test('agruparMinutosPorDia acumula minutos y descarta datos corruptos', () => {
    const sesiones = [
        { date: '2026-10-21', minutes: 30, topic: 'JS' },
        { date: '2026-10-21', minutes: 15, topic: 'CSS' },
        { date: '2026-10-20', minutes: 60, topic: 'HTML' },
        { date: 'invalid-date', minutes: 20 },
        { date: '2026-10-19', minutes: -5 },
        { date: '2026-10-18', minutes: 'abc' }
    ];

    const resultado = agruparMinutosPorDia(sesiones);
    assert.deepStrictEqual(resultado, {
        '2026-10-21': 45,
        '2026-10-20': 60
    });
});

test('generarEstructuraMapaCalor genera exactamente 12 semanas y marca días futuros', () => {
    const hoy = new Date(2026, 9, 21); // Miércoles 21 de octubre de 2026
    const sesiones = [
        { date: '2026-10-21', minutes: 40, topic: 'Test' }
    ];

    const semanas = generarEstructuraMapaCalor(sesiones, hoy);
    assert.strictEqual(semanas.length, 12);
    
    // Verificar que el día de hoy (miércoles) tiene 40 min y nivel 2
    const ultimaSemana = semanas[semanas.length - 1];
    const hoyCelda = ultimaSemana.find(c => c.fecha === '2026-10-21');
    assert.ok(hoyCelda);
    assert.strictEqual(hoyCelda.minutos, 40);
    assert.strictEqual(hoyCelda.nivel, 2);
    assert.strictEqual(hoyCelda.esFuturo, false);

    // Verificar que el jueves posterior (día futuro) está marcado como esFuturo true y nivel 0
    const juevesCelda = ultimaSemana.find(c => c.fecha === '2026-10-22');
    assert.ok(juevesCelda);
    assert.strictEqual(juevesCelda.esFuturo, true);
    assert.strictEqual(juevesCelda.nivel, 0);
});
