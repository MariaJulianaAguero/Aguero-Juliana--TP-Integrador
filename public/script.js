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
  
  
  
  
  