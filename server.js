const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
app.use(cors());
app.use(express.json());
const app = express();


const PORT = process.env.PORT || 3000;


app.post('/partidas', (req, res) => {
  const nueva = req.body;

  // Leer y parsear el ranking
  const file = path.join(__dirname, 'ranking.json');
  let ranking = JSON.parse(fs.readFileSync(file, 'utf8'));

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
  const ranking = JSON.parse(fs.readFileSync(path.join(__dirname, 'ranking.json'), 'utf8'));
  res.json(ranking);
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

