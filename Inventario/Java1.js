// Datos iniciales de la tabla
const initialData = [
  { id: 1, producto: "Leche Entera", cantidad: "40 L", fecha: "27 May 2026", hora: "07:15", destino: "Cocina Escolar", responsable: "Ma. Antonieta López" },
  { id: 2, producto: "Aceite Vegetal", cantidad: "15 L", fecha: "25 May 2026", hora: "08:00", destino: "Cocina Escolar", responsable: "Esperanza Ruíz" },
  { id: 3, producto: "Arroz Blanco", cantidad: "17 Kg", fecha: "23 May 2026", hora: "07:30", destino: "Cocina Escolar", responsable: "Esperanza Ruíz" },
  { id: 4, producto: "Pan Integral", cantidad: "40 pzas", fecha: "21 May 2026", hora: "07:20", destino: "Cocina Escolar", responsable: "Ma. Antonieta López" }
];

// Cargar tabla desde localStorage o utilizar initialData
let tableData = JSON.parse(localStorage.getItem("salidasTableData")) || [...initialData];

let chartLineInstance = null;
let chartDonutInstance = null;

const $ = id => document.getElementById(id);

/* =====================================================
   ORDENAMIENTO DE TABLA POR FECHA
====================================================== */
function parseFechaSpanish(fechaStr) {
  if (!fechaStr) return new Date(0);
  const meses = {
    jan: 0, ene: 0, feb: 1, mar: 2, apr: 3, abr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, ago: 7, sep: 8, oct: 9, nov: 10, dec: 11, dic: 11
  };
  
  const partes = fechaStr.trim().split(/\s+/);
  if (partes.length >= 3) {
    const dia = parseInt(partes[0], 10) || 1;
    const mesKey = partes[1].toLowerCase().substring(0, 3);
    const mes = meses[mesKey] !== undefined ? meses[mesKey] : 0;
    const anio = parseInt(partes[2], 10) || new Date().getFullYear();
    return new Date(anio, mes, dia);
  }
  
  const parsed = Date.parse(fechaStr);
  return isNaN(parsed) ? new Date(0) : new Date(parsed);
}

function ordenarPorFecha() {
  tableData.sort((a, b) => parseFechaSpanish(b.fecha) - parseFechaSpanish(a.fecha));
}

/* =====================================================
   MENÚ HAMBURGUESA Y NAVEGACIÓN
====================================================== */
function inicializarMenuHamburguesa() {
  const menuLateral = document.querySelector(".sidebar") || document.querySelector(".menu-lateral");
  const btnHamburguesa = $("btnHamburguesa");
  const fondoMenu = $("fondoMenu");

  if (btnHamburguesa && menuLateral) {
    btnHamburguesa.onclick = (e) => {
      e.stopPropagation();
      let abierto = menuLateral.classList.toggle("menu-abierto");
      document.querySelector(".main-content")?.classList.toggle("menu-desplazado", abierto);
      document.querySelector(".contenido")?.classList.toggle("menu-desplazado", abierto);
      fondoMenu?.classList.toggle("fondo-visible", false);
    };
  }

  if (fondoMenu) {
    fondoMenu.onclick = () => {
      menuLateral.classList.remove("menu-abierto");
      fondoMenu.classList.remove("fondo-visible");
      document.querySelector(".main-content")?.classList.remove("menu-desplazado");
      document.querySelector(".contenido")?.classList.remove("menu-desplazado");
    };
  }
}

function mostrarModulo(modulo, boton) {
  document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active", "activo"));
  if (boton) boton.classList.add("activo", "active");

  const menuLateral = document.querySelector(".sidebar") || document.querySelector(".menu-lateral");
  if (menuLateral) menuLateral.classList.remove("menu-abierto");
  
  const fondoMenu = $("fondoMenu");
  if (fondoMenu) fondoMenu.classList.remove("fondo-visible");

  document.querySelector(".main-content")?.classList.remove("menu-desplazado");
  document.querySelector(".contenido")?.classList.remove("menu-desplazado");
}

// Extrae la parte numérica de una string tipo "40 L"
function parseCantidad(cantStr) {
  if (!cantStr) return 0;
  const match = cantStr.toString().match(/[\d\.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Extrae la unidad de medida (ej: L, Kg, pzas)
function parseUnidad(cantStr) {
  if (!cantStr) return "";
  const match = cantStr.toString().trim().match(/[^\d\.\s]+/);
  return match ? match[0] : "";
}

function saveTableData() {
  ordenarPorFecha();
  localStorage.setItem("salidasTableData", JSON.stringify(tableData));
  actualizarGraficasDesdeTabla();
}

function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.producto}</td>
      <td class="qty-text">${item.cantidad}</td>
      <td>${item.fecha}</td>
      <td>${item.hora}</td>
      <td>${item.destino}</td>
      <td>${item.responsable}</td>
      <td>
        <button class="btn-action" title="Editar fila" onclick="editRow(${item.id})">✏️</button>
        <button class="btn-action" title="Eliminar fila" onclick="deleteRow(${item.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function addNewRowPrompt() {
  const producto = prompt("Nombre del producto:");
  if (!producto) return;
  const cantidad = prompt("Cantidad (ej: 20 L):", "10 Kg");
  const fecha = prompt("Fecha (ej: 22 May 2026):", "22 May 2026");
  const hora = prompt("Hora:", "08:30");
  const destino = prompt("Destino:", "Cocina Escolar");
  const responsable = prompt("Responsable:", "Ma. Antonieta López");

  const newItem = {
    id: Date.now(),
    producto,
    cantidad,
    fecha,
    hora,
    destino,
    responsable
  };

  tableData.push(newItem);
  saveTableData();
  renderTable(tableData);
}

function filterTable() {
  const query = document.getElementById("filterInput").value.toLowerCase();
  const filtered = tableData.filter(item => 
    item.producto.toLowerCase().includes(query) ||
    item.responsable.toLowerCase().includes(query)
  );
  renderTable(filtered);
}

function editRow(id) {
  const item = tableData.find(d => d.id === id);
  if (!item) return;

  const newProd = prompt("Editar Producto:", item.producto);
  if (newProd !== null) item.producto = newProd;

  const newQty = prompt("Editar Cantidad (ej: 30 L):", item.cantidad);
  if (newQty !== null) item.cantidad = newQty;

  const newFecha = prompt("Editar Fecha:", item.fecha);
  if (newFecha !== null) item.fecha = newFecha;

  const newResp = prompt("Editar Responsable:", item.responsable);
  if (newResp !== null) item.responsable = newResp;

  saveTableData();
  renderTable(tableData);
}

function deleteRow(id) {
  if (confirm("¿Deseas eliminar este registro?")) {
    tableData = tableData.filter(d => d.id !== id);
    saveTableData();
    renderTable(tableData);
  }
}

function toggleEditDropdown(panelId) {
  const panel = document.getElementById(panelId);
  const allPanels = document.querySelectorAll('.edit-dropdown');
  
  allPanels.forEach(p => {
    if (p.id !== panelId) {
      p.classList.add('hidden');
      p.classList.remove('active');
    }
  });

  if (panel) {
    panel.classList.toggle('hidden');
    panel.classList.toggle('active');
  }
}

function toggleTableColumn(colIndex) {
  const table = document.getElementById("salidasTable");
  for (let row of table.rows) {
    if (row.cells[colIndex]) {
      const isHidden = row.cells[colIndex].style.display === 'none';
      row.cells[colIndex].style.display = isHidden ? '' : 'none';
    }
  }
}

/* =====================================================
   GESTIÓN DE CUENTAS
====================================================== */
let cuentas = JSON.parse(localStorage.getItem("cuentasInventario")) || [];
let cuentaActivaId = localStorage.getItem("cuentaActivaInventario");
let cuentaEditandoId = null;
let fotoTemporal = "";

if (cuentas.length === 0) {
  const cuentaInicial = {
    id: Date.now().toString(),
    nombre: "Admin",
    correo: "admin@instituto.com",
    rol: "Administrador",
    foto: ""
  };
  cuentas.push(cuentaInicial);
  cuentaActivaId = cuentaInicial.id;
  guardarCuentas();
}

function guardarCuentas() {
  localStorage.setItem("cuentasInventario", JSON.stringify(cuentas));
  localStorage.setItem("cuentaActivaInventario", cuentaActivaId);
}

function obtenerCuentaActiva() {
  return cuentas.find(c => c.id === cuentaActivaId) || cuentas[0];
}

function actualizarPerfil() {
  const cuenta = obtenerCuentaActiva();
  if (!cuenta) return;

  if ($("nombreAdministrador")) $("nombreAdministrador").innerText = cuenta.nombre;
  if ($("rolAdministrador")) $("rolAdministrador").innerText = cuenta.rol;
  if ($("menuNombre")) $("menuNombre").innerText = cuenta.nombre;
  if ($("menuCorreo")) $("menuCorreo").innerText = cuenta.correo;

  const foto = $("fotoAdministrador");
  const icono = $("iconoAdministrador");

  if (foto && icono) {
    if (cuenta.foto) {
      foto.src = cuenta.foto;
      foto.classList.remove("hidden");
      icono.classList.add("hidden");
    } else {
      foto.classList.add("hidden");
      icono.classList.remove("hidden");
    }
  }
}

function toggleMenuCuenta(event) {
  if (event) event.stopPropagation();
  const menuCuenta = $("menuCuenta");
  if (menuCuenta) {
    menuCuenta.classList.toggle("hidden");
    menuCuenta.classList.toggle("active");
  }
}

function cerrarModal(modalId) {
  const m = $(modalId);
  if (m) m.classList.add("hidden");
}

function abrirMiCuenta() {
  if ($("menuCuenta")) $("menuCuenta").classList.add("hidden");
  const cuenta = obtenerCuentaActiva();
  if (!cuenta) return;

  cuentaEditandoId = cuenta.id;
  if ($("tituloCuenta")) $("tituloCuenta").innerText = "👤 Editar mi cuenta";
  if ($("cuentaNombre")) $("cuentaNombre").value = cuenta.nombre;
  if ($("cuentaCorreo")) $("cuentaCorreo").value = cuenta.correo;
  if ($("cuentaRol")) $("cuentaRol").value = cuenta.rol;
  fotoTemporal = cuenta.foto || "";

  mostrarPreview(fotoTemporal);
  if ($("btnEliminarCuenta")) $("btnEliminarCuenta").classList.remove("hidden");
  if ($("modalCuenta")) $("modalCuenta").classList.remove("hidden");
}

function abrirAgregarCuenta() {
  if ($("menuCuenta")) $("menuCuenta").classList.add("hidden");
  cuentaEditandoId = null;
  fotoTemporal = "";

  if ($("tituloCuenta")) $("tituloCuenta").innerText = "➕ Agregar cuenta";
  if ($("cuentaNombre")) $("cuentaNombre").value = "";
  if ($("cuentaCorreo")) $("cuentaCorreo").value = "";
  if ($("cuentaRol")) $("cuentaRol").value = "Administrador";
  if ($("fotoCuenta")) $("fotoCuenta").value = "";

  mostrarPreview("");
  if ($("btnEliminarCuenta")) $("btnEliminarCuenta").classList.add("hidden");
  if ($("modalCuenta")) $("modalCuenta").classList.remove("hidden");
}

function previsualizarFoto(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(e) {
    fotoTemporal = e.target.result;
    mostrarPreview(fotoTemporal);
  };
  lector.readAsDataURL(archivo);
}

function mostrarPreview(foto) {
  const imagen = $("previewFoto");
  const icono = $("previewIcono");

  if (imagen && icono) {
    if (foto) {
      imagen.src = foto;
      imagen.classList.remove("hidden");
      icono.classList.add("hidden");
    } else {
      imagen.classList.add("hidden");
      icono.classList.remove("hidden");
    }
  }
}

function guardarCuenta() {
  const nombre = $("cuentaNombre").value.trim();
  const correo = $("cuentaCorreo").value.trim();
  const rol = $("cuentaRol").value;

  if (!nombre) return alert("⚠️ Debes escribir el nombre.");
  if (!correo) return alert("⚠️ Debes escribir el correo.");

  if (cuentaEditandoId) {
    const cuenta = cuentas.find(c => c.id === cuentaEditandoId);
    if (cuenta) {
      cuenta.nombre = nombre;
      cuenta.correo = correo;
      cuenta.rol = rol;
      cuenta.foto = fotoTemporal;
    }
  } else {
    const nuevaCuenta = {
      id: Date.now().toString(),
      nombre: nombre,
      correo: correo,
      rol: rol,
      foto: fotoTemporal
    };
    cuentas.push(nuevaCuenta);
    cuentaActivaId = nuevaCuenta.id;
  }

  guardarCuentas();
  actualizarPerfil();
  cerrarModal("modalCuenta");
  alert("✅ Cuenta guardada correctamente.");
}

function abrirCambiarCuenta() {
  if ($("menuCuenta")) $("menuCuenta").classList.add("hidden");
  const lista = $("listaCuentas");
  if (!lista) return;
  lista.innerHTML = "";

  cuentas.forEach(cuenta => {
    const boton = document.createElement("button");
    boton.className = "account-item-btn";

    const fotoHTML = cuenta.foto
      ? `<img src="${cuenta.foto}" alt="${cuenta.nombre}">`
      : `👤`;

    boton.innerHTML = `
      <div class="account-item-avatar">${fotoHTML}</div>
      <div class="account-item-info">
        <p class="account-name">${cuenta.nombre}</p>
        <p class="account-role">${cuenta.rol}</p>
      </div>
      ${cuenta.id === cuentaActivaId ? '<span class="active-check">✓</span>' : ''}
    `;

    boton.onclick = function() {
      cambiarCuenta(cuenta.id);
    };

    lista.appendChild(boton);
  });

  if ($("modalCambiarCuenta")) $("modalCambiarCuenta").classList.remove("hidden");
}

function cambiarCuenta(id) {
  cuentaActivaId = id;
  guardarCuentas();
  actualizarPerfil();
  cerrarModal("modalCambiarCuenta");
  alert("✅ Cuenta cambiada correctamente.");
}

function eliminarCuenta() {
  if (cuentas.length <= 1) {
    alert("⚠️ Debes tener al menos una cuenta.");
    return;
  }

  if (!confirm("¿Seguro que deseas eliminar esta cuenta?")) return;

  cuentas = cuentas.filter(c => c.id !== cuentaEditandoId);
  cuentaActivaId = cuentas[0].id;

  guardarCuentas();
  actualizarPerfil();
  cerrarModal("modalCuenta");
  alert("🗑️ Cuenta eliminada.");
}

function logoutAccount() {
  alert("Cerrando sesión de usuario...");
}

/* =====================================================
   PROCESAMIENTO DE DATOS CON UNIDADES Y FECHAS
====================================================== */

function procesarDatosTabla() {
  const productosMap = {};
  const fechasMap = {};

  tableData.forEach(item => {
    const cant = parseCantidad(item.cantidad);
    const unidad = parseUnidad(item.cantidad);

    // 1. Agrupar por Producto
    if (!productosMap[item.producto]) {
      productosMap[item.producto] = { total: 0, unidad: unidad };
    }
    productosMap[item.producto].total += cant;

    // 2. Agrupar por Fecha
    if (!fechasMap[item.fecha]) {
      fechasMap[item.fecha] = {
        total: 0,
        detalles: {}
      };
    }
    
    fechasMap[item.fecha].total += cant;
    
    // Si hay más de un producto el mismo día
    if (!fechasMap[item.fecha].detalles[item.producto]) {
      fechasMap[item.fecha].detalles[item.producto] = { cantidad: 0, unidad: unidad };
    }
    fechasMap[item.fecha].detalles[item.producto].cantidad += cant;
  });

  const fechasLabels = Object.keys(fechasMap);
  const fechasTotales = fechasLabels.map(f => fechasMap[f].total);
  const fechasDetallesObj = fechasLabels.map(f => fechasMap[f].detalles);

  const prodLabels = Object.keys(productosMap);
  const prodTotales = prodLabels.map(p => productosMap[p].total);
  const prodUnidades = prodLabels.map(p => productosMap[p].unidad);

  return {
    productos: {
      labels: prodLabels,
      data: prodTotales,
      unidades: prodUnidades
    },
    fechas: {
      labels: fechasLabels,
      data: fechasTotales,
      detalles: fechasDetallesObj
    }
  };
}

function actualizarGraficasDesdeTabla() {
  if (!chartLineInstance || !chartDonutInstance) return;

  const datosProcesados = procesarDatosTabla();

  // Actualizar Donut / Pie
  chartDonutInstance.data.labels = datosProcesados.productos.labels;
  chartDonutInstance.data.datasets[0].data = datosProcesados.productos.data;
  chartDonutInstance.data.datasets[0].unidades = datosProcesados.productos.unidades;
  chartDonutInstance.update();

  // Actualizar Líneas / Barras
  chartLineInstance.data.labels = datosProcesados.fechas.labels;
  chartLineInstance.data.datasets[0].data = datosProcesados.fechas.data;
  chartLineInstance.data.datasets[0].detalles = datosProcesados.fechas.detalles;
  chartLineInstance.update();
}

function changeLineChartType(newType) {
  if (!chartLineInstance) return;
  const currentData = chartLineInstance.data;
  chartLineInstance.destroy();

  const ctxLine = document.getElementById('lineChart').getContext('2d');
  chartLineInstance = createLineChart(ctxLine, newType, currentData);

  localStorage.setItem("lineChartType", newType);
}

function changeDonutChartType(newType) {
  if (!chartDonutInstance) return;
  const currentData = chartDonutInstance.data;
  chartDonutInstance.destroy();

  const ctxDonut = document.getElementById('donutChart').getContext('2d');
  chartDonutInstance = createDonutChart(ctxDonut, newType, currentData);

  localStorage.setItem("donutChartType", newType);
}

/* =====================================================
   CREACIÓN DE GRÁFICAS Y PERSONALIZACIÓN DE TOOLTIPS
====================================================== */

// Crea la gráfica de la izquierda (Agrupación por Día, Unidades y Total Consumo)
function createLineChart(ctx, type, data) {
  return new Chart(ctx, {
    type: type,
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const dataset = context.dataset;
              const index = context.dataIndex;
              const detalles = dataset.detalles ? dataset.detalles[index] : null;

              if (detalles) {
                let lineas = [];
                let totalSuma = 0;

                // Generar lista de consumo por producto ej: cereal: 27 Kg
                for (let prod in detalles) {
                  const item = detalles[prod];
                  lineas.push(`${prod}: ${item.cantidad} ${item.unidad}`.trim());
                  totalSuma += item.cantidad;
                }

                // Agregar el Consumo Total
                lineas.push(`Consumo Total: ${totalSuma}`);
                return lineas;
              }
              return `Consumo: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: type === 'pie' || type === 'doughnut' ? {} : {
        y: { beginAtZero: true }
      }
    }
  });
}

// Crea la gráfica de la derecha (Cálculo automático de Porcentaje %)
function createDonutChart(ctx, type, data) {
  return new Chart(ctx, {
    type: type,
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
        tooltip: {
          callbacks: {
            label: function(context) {
              const dataset = context.dataset;
              const totalSum = dataset.data.reduce((a, b) => a + b, 0);
              const currentValue = context.parsed || dataset.data[context.dataIndex];
              const percentage = totalSum > 0 ? ((currentValue / totalSum) * 100).toFixed(1) : 0;
              const unidad = dataset.unidades ? dataset.unidades[context.dataIndex] : "";
              
              return ` ${context.label}: ${currentValue} ${unidad} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function initCharts() {
  const lineCanvas = document.getElementById('lineChart');
  const donutCanvas = document.getElementById('donutChart');

  if (!lineCanvas || !donutCanvas) return;

  const lineType = localStorage.getItem("lineChartType") || 'line';
  const donutType = localStorage.getItem("donutChartType") || 'doughnut';

  if (document.getElementById("selectLineChartType")) {
    document.getElementById("selectLineChartType").value = lineType;
  }
  if (document.getElementById("selectDonutChartType")) {
    document.getElementById("selectDonutChartType").value = donutType;
  }

  const datosIniciales = procesarDatosTabla();

  // Inicializar Gráfica Histórica / Líneas
  const ctxLine = lineCanvas.getContext('2d');
  chartLineInstance = createLineChart(ctxLine, lineType, {
    labels: datosIniciales.fechas.labels,
    datasets: [{
      label: 'Consumo por Fecha',
      data: datosIniciales.fechas.data,
      detalles: datosIniciales.fechas.detalles,
      borderColor: '#ff0000',
      backgroundColor: '#ff000033',
      borderWidth: 3,
      pointBackgroundColor: '#ff0000',
      pointRadius: 6,
      tension: 0.4,
      fill: false
    }]
  });

  // Inicializar Gráfica de Dona / Distribución
  const ctxDonut = donutCanvas.getContext('2d');
  chartDonutInstance = createDonutChart(ctxDonut, donutType, {
    labels: datosIniciales.productos.labels,
    datasets: [{
      data: datosIniciales.productos.data,
      unidades: datosIniciales.productos.unidades,
      backgroundColor: ['#4d88ff', '#ffe066', '#f2ad73', '#b388ff', '#82ca9d', '#ffc658']
    }]
  });
}

// Cierre automático de dropdowns al hacer clic fuera
document.onclick = e => {
  if (!e.target.closest(".user-profile") && !e.target.closest("#menuCuenta")) {
    const menuCuenta = $("menuCuenta");
    if (menuCuenta) menuCuenta.classList.add("hidden");
  }
};

// Inicialización general
document.addEventListener("DOMContentLoaded", () => {
  inicializarMenuHamburguesa();
  ordenarPorFecha();
  renderTable(tableData);
  initCharts();
  actualizarPerfil();
});