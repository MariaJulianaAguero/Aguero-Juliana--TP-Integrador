const express = require('express');
const path = require('path');

const app = express();


const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const fs = require('fs');
app.use(express.json());

// Ruta para guardar una partida
app.post('/partida', (req, res) => {
  const nuevaPartida = req.body;

  fs.readFile('partidas.json', 'utf8', (err, data) => {
    let partidas = [];
    if (!err && data) {
      partidas = JSON.parse(data);
    }

    partidas.push(nuevaPartida);

    fs.writeFile('partidas.json', JSON.stringify(partidas, null, 2), err => {
      if (err) return res.status(500).json({ mensaje: 'Error al guardar partida' });
      res.json({ mensaje: 'Partida guardada exitosamente' });
    });
  });
});

// Muestra el top 20
app.get('/ranking', (req, res) => {
  fs.readFile('partidas.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ mensaje: 'Error al leer el ranking' });

    let partidas = JSON.parse(data);

    // Ordena: primero por puntaje, luego correctas, luego tiempo
    partidas.sort((a, b) => {
      if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
      if (b.correctas !== a.correctas) return b.correctas - a.correctas;
      return a.tiempoTotal - b.tiempoTotal; // menor tiempo es mejor
    });

    res.json(partidas.slice(0, 20));
  });
});