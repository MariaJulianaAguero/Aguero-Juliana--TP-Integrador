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
const btnReiniciar = document.getElementById('btn-reiniciar');
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

btnReiniciar.addEventListener('click', resetGame);

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

    
  
    const contenedorOpciones = document.getElementById('opciones');
    contenedorOpciones.innerHTML = '';
    preguntaActual.opciones.forEach(op => {
      const boton = document.createElement('button');
      boton.textContent = op;
      boton.className = 'opcion';
      boton.addEventListener('click', () =>
        mostrarResultado(op, preguntaActual.correcta, preguntaActual.puntos)
      );
      contenedorOpciones.appendChild(boton);
     });
    
    if (preguntaActual.imagen) {
      imgBandera.src = preguntaActual.imagen;
      imgBandera.classList.remove('hidden');
    } else {
      imgBandera.classList.add('hidden');
    }
  
    document.getElementById('resultado').textContent = '';
    btnSiguiente.classList.add('hidden');
  }
  
  function mostrarResultado(elegida, correcta, puntos) {
    const res = document.getElementById('resultado');
    preguntasRespondidas++;

    const lapso = Date.now() - tiempoInicio;
    tiemposRespuesta.push(lapso);

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

    // Mostrar puntaje
  document.getElementById('puntaje').textContent = `Puntaje: ${puntaje}`;
    // Siguiente o resumen
    if (preguntasRespondidas >= totalPreguntas) {
      mostrarResumen();
    } else {
      btnSiguiente.classList.remove('hidden');
    }
  
  }

  function mostrarResumen() {
    const duracionTotal = tiemposRespuesta.reduce((a, b) => a + b, 0);
    const promedio = duracionTotal / tiemposRespuesta.length;
  
    document.getElementById('pregunta').innerHTML = `
    <strong>🏁 Juego terminado</strong><br><br>
    🟢 <strong>Correctas:</strong> ${respuestasCorrectas}<br>
    🔴 <strong>Incorrectas:</strong> ${respuestasIncorrectas}<br>
    ⏱️ <strong>Tiempo total:</strong> ${(duracionTotal/1000).toFixed(2)} s<br>
    ⌛ <strong>Tiempo promedio:</strong> ${(promedio/1000).toFixed(2)} s<br>
    🧠 <strong>Puntaje total:</strong> ${puntaje}
  `;
  document.getElementById('opciones').innerHTML = '';
  imgBandera.classList.add('hidden');
  btnSiguiente.classList.add('hidden');
  btnReiniciar.classList.remove('hidden');
  
    // Llamada para guardar los resultados en localStorage
    guardarPartidaEnLocalStorage(nombreJugador, puntaje);
  }

  function resetGame() {
    puntaje = 0;
    preguntasRespondidas = respuestasCorrectas = respuestasIncorrectas = 0;
    tiemposRespuesta = [];
    tiempoInicio = null;
    nombreJugador = '';


    // - Vuelve a mostrar el formulario de nombre
    formulario.classList.remove('hidden');
    // - Oculta el área de juego
    contenedor.classList.add('hidden');
    // - Oculta todos los botones de juego
    btnGuardar.classList.add('hidden');
    btnSiguiente.classList.add('hidden');
    btnReiniciar.classList.add('hidden');
    rankingContainer.classList.add('hidden');

    
    document.getElementById('puntaje').textContent    = 'Puntaje: 0';
    document.getElementById('pregunta').textContent   = '';
    document.getElementById('opciones').innerHTML     = '';
    document.getElementById('resultado').textContent   = '';
    imgBandera.classList.add('hidden');

    // 3) Limpia el input de nombre
    document.getElementById('nombre').value = '';
  }
  
  
  function guardarPartidaEnLocalStorage(nombre, puntaje) {
    const partida = {
      nombre: nombre,
      puntaje: puntaje,
      correctas: respuestasCorrectas,
      tiempoTotal: (tiemposRespuesta.reduce((a, b) => a + b, 0) / 1000).toFixed(2)
    };
  
    let ranking = JSON.parse(localStorage.getItem('ranking'));
    if (!Array.isArray(ranking)) ranking = [];
    ranking.push(partida);
    localStorage.setItem('ranking', JSON.stringify(ranking));
    alert('¡Partida guardada en localStorage!');
  }

  function verRanking() {
    let partidas = JSON.parse(localStorage.getItem('ranking'));
    if (!Array.isArray(partidas) || partidas.length === 0) {
      alert('No hay partidas guardadas.');
      return;
    }
    const tabla = document.getElementById('tabla-ranking');
    tabla.innerHTML = '';
    partidas.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.puntaje}</td>
        <td>${p.correctas}</td>
        <td>${p.tiempoTotal}</td>
      `;
      tabla.appendChild(tr);
    });
  }


  function iniciarJuego() {
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    nombreJugador = nombre;
    document.getElementById('nombre-jugador').textContent = nombreJugador;
  
    formulario.classList.add('hidden');
    contenedor.classList.remove('hidden');
    btnGuardar.classList.remove('hidden');
  
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

  