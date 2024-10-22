// src/entrypoint.js
const express = require('express');
const app = express();
// routes files
const radioPlaylist = require('./routes/onlineradiobox-playlist-scraper');
const radioLastSongPlayed = require('./routes/onlineradiobox-lasttitle-played');

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/playlist', radioPlaylist);
app.use('/lastsong', radioLastSongPlayed);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'API Radio fonctionnelle',
    endpoints: {
      playlist: '/playlist/country/:countryCode/radioname/:radioFullName',
      lastsong: 'lastsong/country/:countryCode/radioname/:radioFullName'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Exemple d'utilisation: http://localhost:${PORT}/playlist/country/fr/radioname/abclounge`);
});
