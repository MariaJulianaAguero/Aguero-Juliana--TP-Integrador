const url = "https://restcountries.com/v3.1/all";
let paises = [];
let puntaje = 0;  // Variable global para el puntaje
let preguntaActual = null;
let totalPreguntas = 10;
let preguntasRespondidas = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let tiempoInicio = null;
let tiemposRespuesta = [];
let nombreJugador = '';

//DOM
const formulario        = document.getElementById('formulario-nombre-container');
const contenedor        = document.getElementById('contenedor');
const rankingContainer  = document.getElementById('ranking-container');
const btnComenzar       = document.getElementById('btn-comenzar');
const btnGuardar        = document.getElementById('guardar-partida');
const btnVerRanking     = document.getElementById('ver-ranking');
const btnSiguiente      = document.getElementById('siguiente');
const imgBandera        = document.getElementById('imagen');

// Eventos
btnComenzar.addEventListener('click', iniciarJuego);
btnGuardar.addEventListener('click', () => {
  guardarPartidaEnLocalStorage(nombreJugador, puntaje);
});
btnVerRanking.addEventListener('click', () => {
  rankingContainer.classList.toggle('hidden');
  if (!rankingContainer.classList.contains('hidden')) {
    verRanking();
  }
});
btnSiguiente.addEventListener('click', () => {
  btnSiguiente.classList.add('hidden');
  nuevaPregunta();
});

function obtenerPaises() {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      paises = data; // Guarda todos los paises en la variable paises para usarlos mas tarde
      nuevaPregunta();
      tiempoInicio = Date.now();
    })
    .catch(error => console.error('Error al obtener países:', error));
}

function generarPregunta(paises) {
    const tipoPreguntas = [preguntaCapitales, preguntaBandera, preguntaLimites];
    const tipo = tipoPreguntas[Math.floor(Math.random() * tipoPreguntas.length)];
    return tipo(paises);
  }

  function preguntaCapitales(paises) {
    let pais;
    do {
      pais = paises[Math.floor(Math.random() * paises.length)];
    } while (!pais.capital || !pais.capital[0]);
  
  
    const correcta = pais.name.common;
    const pregunta = `¿Cual es el pais de la ciudad capital ${pais.capital[0]}?`;
    const incorrectas = generarOpcionesIncorrectas(paises, correcta);
    const opciones = mezclar([correcta].concat(incorrectas));
  
  
    return { pregunta, opciones, correcta, puntos: 3 };
  }

  function preguntaBandera(paises) {
    let pais;
    do {
      pais = paises[Math.floor(Math.random() * paises.length)];
    } while (!pais.flags || !pais.flags.svg);
  
  
    const correcta = pais.name.common;
    const pregunta = `¿A que pais pertenece esta bandera?`;
    const imagen = pais.flags.svg;
    const incorrectas = generarOpcionesIncorrectas(paises, correcta);
    const opciones = mezclar([correcta].concat(incorrectas));
  
  
    return { pregunta, opciones, correcta, puntos: 5, imagen };
  }

  function preguntaLimites(paises) {
    const pais = paises[Math.floor(Math.random() * paises.length)];
    const correcta = (pais.borders || []).length;
    const pregunta = `¿Cuántos países limítrofes tiene ${pais.name.common}?`;
  
  
    const incorrectas = mezclar([
      Math.max(0, correcta + 1),
      Math.max(0, correcta + 2),
      Math.max(0, correcta - 1)
    ]).slice(0, 3);
    const opciones = mezclar([correcta].concat(incorrectas));
  
  
    return { pregunta, opciones, correcta, puntos: 3 };
  }

  function mezclar(arr) {
    return arr.sort(() => 0.5 - Math.random());
  }
  
  
  function generarOpcionesIncorrectas(paises, correcta) {
    const nombres = paises
      .filter(p => p.name && p.name.common !== correcta)
      .map(p => p.name.common);
    return mezclar(nombres).slice(0, 3);
  }
  
  function nuevaPregunta() {
    preguntaActual = generarPregunta(paises);
    const preguntaElement = document.getElementById('pregunta');
  
    preguntaElement.textContent = preguntaActual.pregunta;
    preguntaElement.className = 'pregunta-estilo';
  
    const contenedorOpciones = document.getElementById('opciones');
    contenedorOpciones.innerHTML = '';
    preguntaActual.opciones.forEach(op => {
      const boton = document.createElement('button');
      boton.textContent = op;
      boton.className = 'opcion';
      boton.onclick = () => mostrarResultado(op, preguntaActual.correcta, preguntaActual.puntos);
      contenedorOpciones.appendChild(boton);
    });
  
    const img = document.getElementById('imagen');
    if (preguntaActual.imagen) {
      img.src = preguntaActual.imagen;
      img.style.display = 'block';
    } else {
      img.style.display = 'none';
    }
  
    document.getElementById('resultado').textContent = '';
    document.getElementById('siguiente').style.display = 'none';
  }
  
  function mostrarResultado(elegida, correcta, puntos) {
    const res = document.getElementById('resultado');
    preguntasRespondidas++;

    const tiempoRespuesta = Date.now() - tiempoInicio;
    tiemposRespuesta.push(tiempoRespuesta);

    if (elegida === correcta) {
      puntaje += puntos;
      respuestasCorrectas++;
      res.textContent = '¡Correcto!';
      res.style.color = 'green';
    } else {
      respuestasIncorrectas++;
      res.textContent = `Incorrecto. La respuesta correcta era: ${correcta}`;
      res.style.color = 'red';
    }

    if (preguntasRespondidas >= totalPreguntas) {
      mostrarResumen();
    } else {
      document.getElementById('siguiente').style.display = 'block';
    }
  
  
    document.getElementById('puntaje').textContent = `Puntaje: ${puntaje}`;
  
  }

  function mostrarResumen() {
    const duracionTotal = tiemposRespuesta.reduce((a, b) => a + b, 0);
    const promedio = duracionTotal / tiemposRespuesta.length;
  
    const resumen = `
      <strong>🏁 Juego terminado</strong><br><br>
      🟢 <strong>Correctas:</strong> ${respuestasCorrectas}<br>
      🔴 <strong>Incorrectas:</strong> ${respuestasIncorrectas}<br>
      ⏱️ <strong>Tiempo total:</strong> ${(duracionTotal / 1000).toFixed(2)} segundos<br>
      ⌛ <strong>Tiempo promedio por pregunta:</strong> ${(promedio / 1000).toFixed(2)} segundos<br>
      🧠 <strong>Puntaje total:</strong> ${puntaje}
    `;
  
    document.getElementById('pregunta').innerHTML = resumen;
    document.getElementById('opciones').innerHTML = '';
    document.getElementById('imagen').style.display = 'none';
    document.getElementById('siguiente').style.display = 'none';
  
    // Llamada para guardar los resultados en localStorage
    guardarPartidaEnLocalStorage(nombreJugador, puntaje);
  }
  
  function guardarPartidaEnLocalStorage(nombre, puntaje) {
    const partida = {
      nombre: nombre,
      puntaje: puntaje,
      correctas: respuestasCorrectas,
      tiempoTotal: (tiemposRespuesta.reduce((a, b) => a + b, 0) / 1000).toFixed(2)
    };
  
    // Asegurarse de que 'ranking' en localStorage sea un array
    let partidasGuardadas = JSON.parse(localStorage.getItem('ranking'));
  
    // Si 'ranking' no existe o no es un array válido, inicializar como un array vacío
    if (!Array.isArray(partidasGuardadas)) {
      partidasGuardadas = [];
    }
  
    // Agregar la nueva partida
    partidasGuardadas.push(partida);
  
    // Guardar nuevamente en localStorage
    localStorage.setItem('ranking', JSON.stringify(partidasGuardadas));
  
    alert('¡Partida guardada en localStorage!');
  }
function verRanking() {
  // Obtener el ranking desde el localStorage
  let partidas = JSON.parse(localStorage.getItem('ranking'));

  // Si no hay partidas guardadas o no es un arreglo válido, inicializamos un arreglo vacío
  if (!Array.isArray(partidas)) {
      partidas = [];
  }

  // Si no hay partidas, mostramos un mensaje
  if (partidas.length === 0) {
      alert('No hay partidas guardadas.');
      return;
  }

  // Mostrar las partidas en la tabla
  const tabla = document.getElementById('tabla-ranking');
  tabla.innerHTML = ''; // Limpiar tabla antes de mostrar nuevos resultados

  partidas.forEach(partida => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
          <td>${partida.nombre}</td>
          <td>${partida.puntaje}</td>
          <td>${partida.correctas}</td>
          <td>${partida.tiempoTotal}</td>
      `;
      tabla.appendChild(fila);
  });

  // Hacer visible el contenedor del ranking
  document.getElementById('ranking-container').style.display = 'block';
}
  function iniciarJuego() {
    const inputNombre = document.getElementById('nombre');
    const nombre = inputNombre.value.trim();
  
    if (nombre === '') {
      alert('Por favor ingresá tu nombre');
      return;
    }
  
    nombreJugador = nombre;
    document.getElementById('nombre-jugador').textContent = nombreJugador;
  
    // Oculta el formulario y empieza a mostrar el juego
    document.getElementById('formulario-nombre-container').style.display = 'none';
    document.getElementById('contenedor').style.display = 'block';
    
  
    obtenerPaises();
  }

  document.getElementById('btn-comenzar').addEventListener('click', iniciarJuego);
  
  function obtenerRanking() {
    fetch('https://TU-BACKEND-EN-RENDER/ranking')
      .then(res => res.json())
      .then(ranking => {
        console.log(ranking); // Acá lo podés mostrar en la consola o en HTML
        mostrarRankingEnPantalla(ranking); // función para que lo muestres en pantalla
      })
      .catch(err => {
        console.error("Error al obtener el ranking:", err);
      });
  }

  function mostrarRankingEnPantalla(ranking) {
    const contenedor = document.getElementById('ranking');
    contenedor.innerHTML = '<h3>Ranking</h3>';
    ranking.forEach((j, i) => {
      contenedor.innerHTML += `<p>${i + 1}. ${j.jugador} - ${j.puntaje} pts - ${j.tiempo}s</p>`;
    });
  }

  function guardarPartida(nombre, puntaje, tiempoTotal) {
    const datos = {
      nombre: nombreJugador,
      puntaje,
      correctas: respuestasCorrectas,
      tiempoTotal: (tiemposRespuesta.reduce((a, b) => a + b, 0) / 1000).toFixed(2)
    };
  
    // Guardamos los datos en el localStorage
    let partidasGuardadas = JSON.parse(localStorage.getItem('ranking')) || []; // Si no hay partidas guardadas, inicializamos un arreglo vacío
    partidasGuardadas.push(datos);
    localStorage.setItem('ranking', JSON.stringify(partidasGuardadas));
  
    alert('¡Partida guardada con éxito!');
  }