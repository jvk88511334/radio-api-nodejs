// src/index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('service opérationnel sur port ' + PORT);
});

const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
