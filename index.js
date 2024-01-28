require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración Básica
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Para analizar cuerpos JSON

// Almacenamiento en memoria para las URL
const urlDatabase = {};
let shortUrlCounter = 1;

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Tu primer punto final de la API
app.get('/api/hello', function(req, res) {
  res.json({ greeting: '¡Hola desde la API!' });
});

// Punto final para acortar URL
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.original_url;

  // Verifica si la URL es válida
  const urlRegex = new RegExp('^(http|https)://[^ "]+$');
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'URL inválida' });
  }

  // Acorta la URL
  const shortUrl = shortUrlCounter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Punto final para redirigir las URL cortas a las originales
app.get('/api/shorturl/:shortUrl', function(req, res) {
  const shortUrl = req.params.shortUrl;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'URL corta no encontrada' });
  }
});

app.listen(port, function() {
  console.log(`Escuchando en el puerto ${port}`);
});