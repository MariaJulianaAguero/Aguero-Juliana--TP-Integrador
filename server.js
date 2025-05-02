const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();


const PORT = process.env.PORT || 3000;


app.post('/guardar', (req, res) => {
  const nuevaPartida = req.body;

  // Leer el archivo de ranking
  fs.readFile(path.join(__dirname, 'ranking.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo de ranking');

    let ranking = [];
    try {
      ranking = JSON.parse(data);
    } catch (parseError) {
      console.log('Archivo corrupto o vacío. Reiniciando ranking.json');
    }

    // Agregar la nueva partida al ranking
    ranking.push(nuevaPartida);

    // Ordenar el ranking por puntaje descendente
    ranking.sort((a, b) => b.puntaje - a.puntaje);

    // Escribir el nuevo ranking en el archivo
    fs.writeFile(
      path.join(__dirname, 'ranking.json'),
      JSON.stringify(ranking, null, 2),
      (err) => {
        if (err) return res.status(500).send('Error al guardar el archivo de ranking');
        res.status(200).send('Partida guardada exitosamente');
      }
    );
  });
});

app.get('/ranking', (req, res) => {
  fs.readFile(path.join(__dirname, 'ranking.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el ranking');
    try {
      const ranking = JSON.parse(data);
      res.json(ranking);
    } catch (parseError) {
      res.status(500).send('Error al procesar los datos del ranking');
    }
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

