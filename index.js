const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

// Almacenar las URL en memoria
const urlDatabase = {};

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  const randomNumber = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;

  // Validar la URL
  const urlChecker = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!originalUrl.match(urlChecker)) {
    res.json({ error: 'invalid url' });
  }

  // Almacenar la URL corta en la base de datos
  urlDatabase[randomNumber] = originalUrl;
  res.json({ original_url: originalUrl, short_url: randomNumber });
});

app.get('/api/shorturl/:shortUrl', function(req, res) {
  const shortUrl = req.params.shortUrl;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'URL corta no encontrada' });
  }
});

app.listen(port, function() {
  console.log(`Escuchando en el puerto ${port}`);
});