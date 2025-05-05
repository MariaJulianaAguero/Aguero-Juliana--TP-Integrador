const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


app.post('/partidas', (req, res) => {
  const nueva = req.body;

  // Leer y parsear el ranking
  const file = path.join(__dirname, 'ranking.json');
  if (fs.existsSync(file)) {
    ranking = JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  // Agregar, ordenar y recortar
  ranking.push(nueva);
  ranking.sort((a, b) => {
    if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
    return a.tiempoTotal - b.tiempoTotal;
  });
  const top20 = ranking.slice(0, 20);

  
  fs.writeFileSync(file, JSON.stringify(top20, null, 2));

  // Va a devolver un archivo JSON con el ranking actualizado
  res.status(201).json({ message: 'Partida guardada', top20 });
});

app.get('/ranking', (req, res) => {
  const file = path.join(__dirname, 'ranking.json');
  if (fs.existsSync(file)) {
    const ranking = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(ranking);
  } else {
    res.json([]);
  }
});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

