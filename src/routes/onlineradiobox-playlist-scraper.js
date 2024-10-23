// src/routes/radio.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { normalizeToAscii } = require('../utils/normalize-to-ascii');

router.get('/country/:countryCode/radioname/:radioFullName', async (req, res) => {
  const radioName = req.params.radioFullName.toLowerCase();
  const countryCode = req.params.countryCode.toLowerCase();

  try {
    const url = `https://onlineradiobox.com/${countryCode}/${radioName}/playlist/`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Tableau temporaire pour stocker toutes les entrées
    const tempPlaylist = [];

    // Compteur pour les occurrences de chaque titre
    const trackOccurrences = {};

    // Collecte initiale des données
    $('table.tablelist-schedule tbody tr').each((index, element) => {
      const time = $(element).find('.tablelist-schedule__time .time--schedule').text().trim();
      const trackInfo = normalizeToAscii($(element).find('.track_history_item').text().trim());

      if (trackInfo) {
        tempPlaylist.push({
          time: time,
          track: trackInfo
        });

        // Compte les occurrences de chaque titre
        trackOccurrences[trackInfo] = (trackOccurrences[trackInfo] || 0) + 1;
      }
    });

    // Trouve les titres qui apparaissent fréquemment (probablement des slogans)
    const totalTracks = tempPlaylist.length;
    const frequentTracks = new Set();
    const FREQUENCY_THRESHOLD = 0.1; // 10% du total des titres

    for (const [track, count] of Object.entries(trackOccurrences)) {
      if (count / totalTracks > FREQUENCY_THRESHOLD) {
        frequentTracks.add(track);
      }
    }

    // Filtre la playlist pour exclure les titres fréquents
    const filteredPlaylist = tempPlaylist.filter(item => !frequentTracks.has(item.track));

    res.json({
      radioName: radioName,
      playlist: filteredPlaylist,
      removedTracks: Array.from(frequentTracks)
    });

  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des données de playlist',
      details: error.message
    });
  }
});

module.exports = router;
