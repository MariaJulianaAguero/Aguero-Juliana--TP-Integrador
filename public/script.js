const url = "https://restcountries.com/v3.1/all";
let paises = [];
let puntaje = 0;  // Variable global para el puntaje


function obtenerPaises() {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      paises = data; // Guarda todos los paises en la variable paises para usarlos mas tarde
    });
}

function generarPregunta(paises) {
    const tipoPreguntas = [preguntaCapitales, preguntaBandera, preguntaLimites];
    const tipo = tipoPreguntas[Math.floor(Math.random() * tipoPreguntas.length)];
    return tipo(paises);
  }
  