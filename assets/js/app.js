// ============================================================
// LISTA DE PERSONAL — Edita aquí los nombres
// fullName : nombre completo (guardado internamente)
// name     : lo que se muestra en pantalla (1 nombre + 1 apellido)
// room     : consultorio por defecto (editable en pantalla)
// ============================================================
const staffList = [
    { id: 1, fullName: "Dra. Torres Avalos Nadia del Pilar",   name: "Dra. Nadia Torres",    room: "C-222" },
    { id: 2, fullName: "Dra. Fernandez Yupanqui Veronica",     name: "Dra. Veronica Fernandez",  room: "C-102" },
    { id: 3, fullName: "Dr. Yaco Quispe Juan Carlos",   name: "Dr. Juan Carlos Yaco",  room: "C-103" },
    { id: 4, fullName: "Dr. Castillo Inquilla Miguel",       name: "Dr. Miguel Inquilla",    room: "Lab-1" },
    { id: 5, fullName: "Dra. Puma Angelo Rosario Elizabeth",      name: "Dra. Rosario Puma",   room: "C-105" },
    { id: 6, fullName: "Dra. Mauricio Cordova Yelitza",         name: "Dra. Yelitza Mauricio",    room: "Triaje" },
    { id: 7, fullName: "Dra. Liendo Acosta Danitza del Rosario",         name: "Dra. Danitza Liendo",    room: "Triaje" },
    { id: 8, fullName: "Dra. Chavez Catacora Benilde",         name: "Dra. Benilde Chavez",    room: "Triaje" },
    { id: 9, fullName: "Dra. Choque la Torre Raquel Virginia",         name: "Dra. Raquel Choque",    room: "Triaje" },
    { id: 10, fullName: "Dr. Carpio Macedo Omar Fernando",         name: "Dr. Omar Carpio",    room: "Triaje" },
    { id: 11, fullName: "Dra. Zea Tapia Milagros del Rosario",         name: "Dra. Milagros Zea",    room: "Triaje" },
    { id: 12, fullName: "Dra. Salazar Carrasco Sofia",         name: "Dra. Sofia Salazar",    room: "Triaje" },
    { id: 13, fullName: "Dra. Vizcarra Jimenez Dariela",         name: "Dra. Dariela Vizcarra",    room: "Triaje" },
    { id: 14, fullName: "Dra. Carrasco Espinza Adriana Isabel",         name: "Dra. Adriana Carrasco",    room: "Triaje" },
    { id: 15, fullName: "Dr. Vasquez Zubieta Luis",         name: "Dra. Luis Vasquez",    room: "Triaje" },
    { id: 16, fullName: "Dra. CD. Bornaz Arenas Milagros",         name: "Dra. Milagros Bornaz",    room: "Triaje" },
    { id: 17, fullName: "Dr. CD. Castro Torres Jorge Luis",         name: "Dr. Jorge Castro",    room: "Triaje" },
    { id: 18, fullName: "Dr. CD. Hoyos Garcia Jorge",         name: "Dr. Jorge Hoyos",    room: "Triaje" },
    { id: 19, fullName: "Dr. CD. Nina Cohaila David",         name: "Dr. David Nina",    room: "Triaje" },
    { id: 20, fullName: "Dr. CD. Yturry Choqueza Ernesto",         name: "Dr. Ernesto Yturry",    room: "Triaje" },
    { id: 21, fullName: "Lic. QF. Somocurcio Nuñes Tatiana Emma",         name: "Lic. Tatiana Somocurcio",    room: "Triaje" },
    { id: 22, fullName: "Lic. Yucra Onque Pedro",         name: "Lic. Pedro Yucra",    room: "Triaje" },
    { id: 23, fullName: "Lic. Garcia Delgado Yesenia",         name: "Lic. Yesenia Garcia",    room: "Triaje" },
    { id: 24, fullName: "Lic. Berrios Salas Edda",         name: "Lic. Edda Berrios",    room: "Triaje" },
    { id: 25, fullName: "Lic. Pari Flores Noelia",         name: "Lic. Noelia Pari",    room: "Triaje" },
    { id: 26, fullName: "Lic. Fuentes Fuster Fabiola",         name: "Lic. Fabiola Fuentes",    room: "Triaje" }
];

let db = [];

window.onload = () => {
    initDB();
    renderStaff();
};

function initDB() {
    const saved = localStorage.getItem('policlinico_db');
    if (saved) {
        const savedDB = JSON.parse(saved);

        // ✅ FIX: Sincroniza nombres desde staffList sin borrar los registros de horas
        db = staffList.map(p => {
            const existing = savedDB.find(s => s.id === p.id);
            if (existing) {
                return {
                    ...existing,       // conserva status, times, room
                    fullName: p.fullName, // ✅ actualiza nombre completo
                    name: p.name          // ✅ actualiza nombre corto
                };
            }
            // Personal nuevo que no existía antes
            return {
                ...p,
                status: 'none',
                times: { in: '-', motivo: '-', regreso: '-', final: '-' }
            };
        });
        save();
    } else {
        db = staffList.map(p => ({
            ...p,
            status: 'none',
            times: { in: '-', motivo: '-', regreso: '-', final: '-' }
        }));
        save();
    }
}

function save() {
    localStorage.setItem('policlinico_db', JSON.stringify(db));
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    if (viewId === 'view-history') renderHistory();
}

function renderStaff(filter = "") {
    const container = document.getElementById('staff-list');
    container.innerHTML = "";

    db.filter(p => p.fullName.toLowerCase().includes(filter.toLowerCase()))
      .forEach(p => {
        const card = document.createElement('div');
        card.className = `staff-card state-${p.status}`;
        card.innerHTML = `
            <div class="card-header">
                <div class="name-tag">
                    <h4>
                        ${p.name}
                        <button class="btn-eye" onclick="toggleFullName(this, '${p.fullName}')" title="Ver nombre completo">&#128065;</button>
                    </h4>
                    <span class="full-name-tooltip" style="display:none;">${p.fullName}</span>
                </div>
                <div class="room-tag">
                    <input type="text" value="${p.room}" onchange="updateRoom(${p.id}, this.value)" placeholder="Cons.">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn-action btn-in"
                    ${p.status !== 'none' ? 'disabled' : ''}
                    onclick="mark(${p.id}, 'in')">Ingreso</button>
                <button class="btn-action btn-motivo"
                    ${p.status !== 'in' ? 'disabled' : ''}
                    onclick="mark(${p.id}, 'motivo')">Salida</button>
                <button class="btn-action btn-regreso"
                    ${p.status !== 'out' ? 'disabled' : ''}
                    onclick="mark(${p.id}, 'regreso')">Regreso</button>
                <button class="btn-action btn-fin"
                    ${p.status === 'final' || p.status === 'none' ? 'disabled' : ''}
                    onclick="mark(${p.id}, 'final')">Final</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ✅ NUEVO: Muestra/oculta el nombre completo bajo el nombre corto
function toggleFullName(btn, fullName) {
    const tooltip = btn.closest('.name-tag').querySelector('.full-name-tooltip');
    const isVisible = tooltip.style.display !== 'none';
    tooltip.style.display = isVisible ? 'none' : 'block';
    btn.classList.toggle('eye-active', !isVisible);
}

function mark(id, type) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const idx = db.findIndex(p => p.id === id);

    if      (type === 'in')      { db[idx].status = 'in';    db[idx].times.in      = time; }
    else if (type === 'motivo')  { db[idx].status = 'out';   db[idx].times.motivo  = time; }
    else if (type === 'regreso') { db[idx].status = 'in';    db[idx].times.regreso = time; }
    else if (type === 'final')   { db[idx].status = 'final'; db[idx].times.final   = time; }

    save();
    renderStaff(document.getElementById('search-input').value);
}

function updateRoom(id, val) {
    const idx = db.findIndex(p => p.id === id);
    db[idx].room = val;
    save();
}

function filterStaff() {
    renderStaff(document.getElementById('search-input').value);
}

function renderHistory() {
    const body = document.getElementById('history-body');
    body.innerHTML = "";

    const sorted = [...db]
        .filter(p => p.times.in !== '-')
        .sort((a, b) => a.times.in.localeCompare(b.times.in));

    if (sorted.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:#999; padding:30px;">
                    Aún no hay registros de ingreso para hoy.
                </td>
            </tr>
        `;
        return;
    }

    sorted.forEach(p => {
        body.innerHTML += `
            <tr>
                <td>
                    <strong>${p.name}</strong>
                    <button class="btn-eye btn-eye-table" onclick="toggleHistoryName(this, '${p.fullName}')" title="Ver nombre completo">&#128065;</button>
                    <div class="full-name-tooltip" style="display:none; font-size:0.8rem; color:#555; margin-top:3px;">${p.fullName}</div>
                </td>
                <td>${p.room}</td>
                <td style="color:#27ae60; font-weight:600">${p.times.in}</td>
                <td style="color:#e67e22; font-weight:600">${p.times.motivo}</td>
                <td style="color:#2980b9; font-weight:600">${p.times.regreso}</td>
                <td style="color:#c0392b; font-weight:600">${p.times.final}</td>
            </tr>
        `;
    });
}

// ✅ NUEVO: Toggle nombre completo en historial
function toggleHistoryName(btn, fullName) {
    const tooltip = btn.nextElementSibling;
    const isVisible = tooltip.style.display !== 'none';
    tooltip.style.display = isVisible ? 'none' : 'block';
    btn.classList.toggle('eye-active', !isVisible);
}

// Modal y Reinicio
function openModal()  { document.getElementById('modal-reset').style.display = 'flex'; }
function closeModal() { document.getElementById('modal-reset').style.display = 'none'; }

function resetDay() {
    db = db.map(p => ({
        ...p,
        status: 'none',
        times: { in: '-', motivo: '-', regreso: '-', final: '-' }
    }));
    save();
    renderStaff();
    closeModal();
    showView('view-home');
    alert("Día reiniciado correctamente.");
}