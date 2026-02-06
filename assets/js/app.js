const app = document.getElementById("app");

/* =========================
   UTILIDADES DE TIEMPO
========================= */
function fechaActual() {
    return new Date().toISOString().split("T")[0];
}

function ahora() {
    return {
        hora: new Date().toLocaleTimeString()
    };
}

/* =========================
   DATOS INICIALES
========================= */
let sedes = JSON.parse(localStorage.getItem("sedes")) || {
    1: {
        nombre: "Sede 1",
        consultorios: [
            {
                numero: 101,
                doctor: "No asignado",
                estado: "No llegó",
                historial: {}
            },
            {
                numero: 102,
                doctor: "No asignado",
                estado: "No llegó",
                historial: {}
            }
        ]
    },
    2: {
        nombre: "Sede 2",
        consultorios: [
            {
                numero: 201,
                doctor: "No asignado",
                estado: "No llegó",
                historial: {}
            },
            {
                numero: 202,
                doctor: "No asignado",
                estado: "No llegó",
                historial: {}
            }
        ]
    }
};

/* =========================
   STORAGE
========================= */
function guardarDatos() {
    localStorage.setItem("sedes", JSON.stringify(sedes));
}

/* =========================
   REGISTRO POR FECHA
========================= */
function registroHoy(consultorio) {
    const hoy = fechaActual();
    if (!consultorio.historial[hoy]) {
        consultorio.historial[hoy] = {};
    }
    return consultorio.historial[hoy];
}

/* =========================
   PANTALLA INICIO
========================= */
function mostrarInicio() {
    app.innerHTML = `
        <div class="card">
            <h2>Control de Consultorios</h2>

            <button onclick="entrarSede(1)">Sede 1</button>
            <button onclick="entrarSede(2)">Sede 2</button>

            <hr>

            <button onclick="mostrarHistorial()">📅 Ver historial</button>

            <hr>

            <button onclick="nuevoDia()" style="background:#dc3545">
                🔄 Nuevo día
            </button>
        </div>
    `;
}

/* =========================
   SEDE
========================= */
function claseEstado(estado) {
    switch (estado) {
        case "En consulta": return "estado-consulta";
        case "En almuerzo": return "estado-almuerzo";
        case "Finalizó turno": return "estado-salida";
        default: return "estado-no-llego";
    }
}

function entrarSede(id) {
    const sede = sedes[id];
    let filas = "";

    sede.consultorios.forEach((c, i) => {
        filas += `
            <tr class="${claseEstado(c.estado)}">
                <td data-label="Consultorio">${c.numero}</td>
                <td data-label="Doctor">${c.doctor}</td>
                <td data-label="Estado">${c.estado}</td>
                <td data-label="Acción">
                    <button onclick="verConsultorio(${id}, ${i})">
                        Ver
                    </button>
                </td>
            </tr>
        `;
    });

    app.innerHTML = `
        <div class="card">
            <h2>${sede.nombre}</h2>

            <button onclick="mostrarInicio()">⬅ Volver</button>
            <br><br>

            <table border="1" cellpadding="8" width="100%">
                <tr>
                    <th>Consultorio</th>
                    <th>Doctor</th>
                    <th>Estado</th>
                    <th>Acción</th>
                </tr>
                ${filas}
            </table>
        </div>
    `;
}



/* =========================
   CONSULTORIO
========================= */
function verConsultorio(sedeId, index) {
    const c = sedes[sedeId].consultorios[index];
    const hoy = fechaActual();
    const r = c.historial[hoy] || {};

    app.innerHTML = `
        <div class="card">
            <h2>Consultorio ${c.numero}</h2>

            <label>Doctor:</label>
            <input value="${c.doctor}" 
                   onchange="cambiarDoctor(${sedeId}, ${index}, this.value)">

            <p>Estado: <strong>${c.estado}</strong></p>

            <button onclick="marcarIngreso(${sedeId}, ${index})">Ingreso</button>
            <button onclick="salidaAlmuerzo(${sedeId}, ${index})">Salida Almuerzo</button>
            <button onclick="regresoAlmuerzo(${sedeId}, ${index})">Regreso</button>
            <button onclick="marcarSalida(${sedeId}, ${index})">Salida</button>

            <hr>

            <h4>Registro del día (${hoy})</h4>
            <pre>${JSON.stringify(r, null, 2)}</pre>

            <button onclick="entrarSede(${sedeId})">⬅ Volver</button>
        </div>
    `;
}

/* =========================
   CAMBIAR DOCTOR
========================= */
function cambiarDoctor(sedeId, index, nombre) {
    sedes[sedeId].consultorios[index].doctor = nombre || "No asignado";
    guardarDatos();
}

/* =========================
   MARCAS DE TIEMPO
========================= */
function marcarIngreso(sedeId, index) {
    const c = sedes[sedeId].consultorios[index];
    const r = registroHoy(c);

    r.ingreso = ahora();
    c.estado = "En consulta";

    guardarDatos();
    verConsultorio(sedeId, index);
}

function salidaAlmuerzo(sedeId, index) {
    const c = sedes[sedeId].consultorios[index];
    const r = registroHoy(c);

    r.salidaAlmuerzo = ahora();
    c.estado = "En almuerzo";

    guardarDatos();
    verConsultorio(sedeId, index);
}

function regresoAlmuerzo(sedeId, index) {
    const c = sedes[sedeId].consultorios[index];
    const r = registroHoy(c);

    r.regresoAlmuerzo = ahora();
    c.estado = "En consulta";

    guardarDatos();
    verConsultorio(sedeId, index);
}

function marcarSalida(sedeId, index) {
    const c = sedes[sedeId].consultorios[index];
    const r = registroHoy(c);

    r.salida = ahora();
    c.estado = "Finalizó turno";

    guardarDatos();
    verConsultorio(sedeId, index);
}

/* =========================
   NUEVO DÍA
========================= */
function nuevoDia() {
    if (!confirm("¿Iniciar un nuevo día? El historial se conservará.")) return;

    for (const sedeId in sedes) {
        sedes[sedeId].consultorios.forEach(c => {
            c.estado = "No llegó";
        });
    }

    guardarDatos();
    mostrarInicio();
}

/* =========================
   HISTORIAL VISUAL
========================= */
function mostrarHistorial() {
    app.innerHTML = `
        <div class="card">
            <h2>Historial por fecha</h2>

            <input type="date" id="fechaHistorial"><br><br>

            <button onclick="verHistorial()">Ver</button>
            <button onclick="mostrarInicio()">⬅ Volver</button>
        </div>
    `;
}

function verHistorial() {
    const fecha = document.getElementById("fechaHistorial").value;
    if (!fecha) return alert("Seleccione una fecha");

    let filas = "";

    for (const sedeId in sedes) {
        sedes[sedeId].consultorios.forEach(c => {
            const r = c.historial[fecha];
            if (r) {
                filas += `
                    <tr>
                        <td>${sedes[sedeId].nombre}</td>
                        <td>${c.numero}</td>
                        <td>${c.doctor}</td>
                        <td>${r.ingreso?.hora || "-"}</td>
                        <td>${r.salidaAlmuerzo?.hora || "-"}</td>
                        <td>${r.regresoAlmuerzo?.hora || "-"}</td>
                        <td>${r.salida?.hora || "-"}</td>
                    </tr>
                `;
            }
        });
    }

    if (!filas) {
        filas = `<tr><td colspan="7">No hay registros</td></tr>`;
    }

    app.innerHTML = `
        <div class="card">
            <h2>Historial del ${fecha}</h2>

            <table border="1" cellpadding="6">
                <tr>
                    <th>Sede</th>
                    <th>Consultorio</th>
                    <th>Doctor</th>
                    <th>Ingreso</th>
                    <th>Salida Almuerzo</th>
                    <th>Regreso</th>
                    <th>Salida</th>
                </tr>
                ${filas}
            </table>

            <br>
            <button onclick="mostrarHistorial()">⬅ Volver</button>
        </div>
    `;
}

/* =========================
   INICIO
========================= */
mostrarInicio();
