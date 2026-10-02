// Gráfico de Líneas (Entradas de alimentos)
const ctxLine = document.getElementById('lineChart').getContext('2d');
new Chart(ctxLine, {
  type: 'line',
  data: {
    labels: ['21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May'],
    datasets: [{
      data: [12, 35, 12, 27, 12, 43, 12],
      borderColor: '#10b981',
      borderWidth: 3,
      pointBackgroundColor: '#10b981',
      pointRadius: 5,
      tension: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false },
      x: { grid: { display: false } }
    }
  }
});

// Gráfico de Dona (Productos recibidos)
const ctxDonut = document.getElementById('donutChart').getContext('2d');
new Chart(ctxDonut, {
  type: 'doughnut',
  data: {
    labels: ['Leche 65%', 'Arroz 22%', 'Aceite 13%'],
    datasets: [{
      data: [65, 22, 13],
      backgroundColor: ['#3b82f6', '#f59e0b', '#a855f7']
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      }
    },
    cutout: '65%'
  }
});

// Funcionalidad del Menú Hamburguesa
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}
if (overlay) {
    overlay.addEventListener('click', toggleMenu);
}

// Menús Desplegables Superiores (Admin y Campanita)
const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const bellBtn = document.getElementById('bellBtn');
const bellDropdown = document.getElementById('bellDropdown');

if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bellDropdown) bellDropdown.style.display = 'none';
        userDropdown.style.display = (userDropdown.style.display === 'block') ? 'none' : 'block';
    });
}

if (bellBtn && bellDropdown) {
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (userDropdown) userDropdown.style.display = 'none';
        bellDropdown.style.display = (bellDropdown.style.display === 'block') ? 'none' : 'block';
    });
}

window.addEventListener('click', () => {
    if (userDropdown) userDropdown.style.display = 'none';
    if (bellDropdown) bellDropdown.style.display = 'none';
});

// Funcionalidad para Agregar Productos a la Tabla
// Funcionalidad para Agregar Productos a la Tabla
const btnAdd = document.getElementById('openModalBtn') ;
const addProductModal = document.getElementById('addProductModal');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const addProductForm = document.getElementById('addProductForm');
const tableBody = document.querySelector('.data-table tbody');

if (btnAdd) {
    btnAdd.addEventListener('click', () => {
        if (addProductModal) addProductModal.style.display = 'flex';
    });
}

if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', () => {
        if (addProductModal) addProductModal.style.display = 'none';
    });
}

if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const producto = document.getElementById('inputProducto').value;
        const cantidad = document.getElementById('inputCantidad').value;
        const fecha = document.getElementById('inputFecha').value;
        const hora = document.getElementById('inputHora').value;
        const proveedor = document.getElementById('inputProveedor').value;
        const responsable = document.getElementById('inputResponsable').value;

        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${producto}</td>
            <td class="text-green">${cantidad}</td>
            <td>${fecha}</td>
            <td>${hora}</td>
            <td>${proveedor}</td>
            <td>${responsable}</td>
            <td><button class="btn-delete" type="button">🗑️</button></td>
        `;

        // Añadir evento de borrado al botón de la nueva fila
        nuevaFila.querySelector('.btn-delete').addEventListener('click', () => {
            nuevaFila.remove();
        });

        tableBody.prepend(nuevaFila);
        addProductForm.reset();
        addProductModal.style.display = 'none';
    });
}

// Activar el botón de borrar para las filas que ya vienen por defecto en la tabla HTML
document.querySelectorAll('.data-table .btn-delete').forEach(button => {
    button.addEventListener('click', (e) => {
        e.target.closest('tr').remove();
    });
});
// ==========================================
// FUNCIONALIDAD DEL BUSCADOR EN LA TABLA
// ==========================================

const searchInput = document.querySelector('.search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const textoBusqueda = e.target.value.toLowerCase();
        const filas = document.querySelectorAll('.data-table tbody tr');

        filas.forEach(fila => {
            const contenidoFila = fila.textContent.toLowerCase();
            // Si el texto coincide con algo de la fila, la muestra; si no, la oculta
            if (contenidoFila.includes(textoBusqueda)) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    });
}
