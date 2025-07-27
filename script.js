let tasas = {};
const historialMaximo = 5;
const monedasFiltradas = ['USD', 'EUR', 'CLP', 'ARS'];

async function cargarTasas() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('Error al cargar tasas: ' + res.status);
    const data = await res.json();
    return data.rates;
  } catch (error) {
    console.error('Error en cargarTasas:', error);
    Swal.fire('Error', 'No se pudieron cargar las tasas de cambio. Intenta más tarde.', 'error');
    return {};
  }
}

function poblarSelects() {
  const origen = document.getElementById('origen');
  const destino = document.getElementById('destino');

  origen.innerHTML = '';
  destino.innerHTML = '';

  monedasFiltradas.forEach(moneda => {
    if (tasas[moneda]) {
      origen.appendChild(new Option(moneda, moneda));
      destino.appendChild(new Option(moneda, moneda));
    }
  });

  origen.value = 'USD';
  destino.value = 'EUR';
}

function mostrarTablaTasas() {
  const tbody = document.querySelector('#tabla-tasas tbody');
  tbody.innerHTML = '';
  monedasFiltradas.forEach(moneda => {
    if (tasas[moneda]) {
      tbody.innerHTML += `<tr><td>${moneda}</td><td>${tasas[moneda].toFixed(4)}</td></tr>`;
    }
  });
}

function mostrarHistorial() {
  const historialGuardado = JSON.parse(localStorage.getItem('historial')) || [];
  const historialUl = document.getElementById('historial');
  historialUl.innerHTML = '';
  historialGuardado.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historialUl.appendChild(li);
  });
}

function agregarAHistorial(texto) {
  let historial = JSON.parse(localStorage.getItem('historial')) || [];
  historial.unshift(texto);
  historial = historial.slice(0, historialMaximo);
  localStorage.setItem('historial', JSON.stringify(historial));
  mostrarHistorial();
}

document.getElementById('convertir').addEventListener('click', () => {
  const monto = parseFloat(document.getElementById('monto').value);
  const origen = document.getElementById('origen').value;
  const destino = document.getElementById('destino').value;

  if (isNaN(monto) || monto <= 0) {
    Swal.fire('Error', 'Ingrese un monto válido mayor que cero', 'warning');
    return;
  }

  if (origen === destino) {
    Swal.fire('Error', 'Seleccione monedas diferentes para la conversión', 'warning');
    return;
  }

  const tasaOrigen = tasas[origen];
  const tasaDestino = tasas[destino];

  if (!tasaOrigen || !tasaDestino) {
    Swal.fire('Error', 'Moneda no disponible en las tasas', 'error');
    return;
  }

  const resultado = (monto / tasaOrigen) * tasaDestino;

  const fecha = new Date().toLocaleString();
  const textoResultado = `${fecha}: ${monto} ${origen} = ${resultado.toFixed(2)} ${destino}`;

  document.getElementById('resultado').textContent = textoResultado;

  agregarAHistorial(textoResultado);
});

document.getElementById('borrarHistorial').addEventListener('click', () => {
  localStorage.removeItem('historial');
  mostrarHistorial();
});

document.addEventListener('DOMContentLoaded', async () => {
  tasas = await cargarTasas();
  console.log('Tasas cargadas:', tasas);
  poblarSelects();
  mostrarTablaTasas();
  mostrarHistorial();
});