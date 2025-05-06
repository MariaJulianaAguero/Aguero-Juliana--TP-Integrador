const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();


const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));


app.post('/partidas', (req, res) => {
  const nueva = req.body;

  // Leer y parsear el ranking
  const file = path.join(__dirname, 'rankingData.json');
  let ranking = [];
  if (fs.existsSync(file)) {
    ranking = JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  ranking.push(nueva);

  ranking.sort((a, b) => {
    if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
    return a.tiempoTotal - b.tiempoTotal;
  });

  const top20 = ranking.slice(0, 20);
  fs.writeFileSync(file, JSON.stringify(top20, null, 2));

  res.status(201).json({ message: 'Partida guardada', top20 });
});

app.get('/ranking', (req, res) => {
  const file = path.join(__dirname, 'rankingData.json');

  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo ranking.json' });
    }

    try {
      const ranking = JSON.parse(data); // Asegúrate de que el archivo ranking.json esté bien formado
      res.json(ranking);
    } catch (err) {
      return res.status(500).json({ error: 'Error al procesar los datos del ranking' });
    }
  });
});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

});

