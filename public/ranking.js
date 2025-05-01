fetch('/ranking')
  .then(res => res.json())
  .then(partidas => {
    const tabla = document.getElementById('tabla-ranking');

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
  })
  .catch(error => {
    console.error('Error al cargar el ranking:', error);
  });