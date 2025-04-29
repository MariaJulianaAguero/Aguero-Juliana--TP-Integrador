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
    document.getElementById('pregunta').textContent = preguntaActual.pregunta;
  
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
  }
  
  function mostrarResultado(elegida, correcta, puntos) {
    const res = document.getElementById('resultado');
    if (elegida === correcta) {
      puntaje += puntos;
      res.textContent = '¡Correcto!';
      res.style.color = 'green';
    } else {
      res.textContent = `Incorrecto. La respuesta correcta era: ${correcta}`;
      res.style.color = 'red';
    }
  
  
    document.getElementById('puntaje').textContent = `Puntaje: ${puntaje}`;
  
  }
  obtenerPaises();
  
  