const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

//To know radioname go to onlineradiobox and check url when you go to playlist
router.get('/country/:countryCode/radioname/:radioFullName', async (req, res) => {
  const radioName = req.params.radioFullName.toLowerCase();
  const countryCode = req.params.countryCode.toLowerCase();

  try {
    const url = `https://onlineradiobox.com/${countryCode}/${radioName}/playlist/`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Récupérer les 10 premiers titres pour analyse
    const recentTracks = [];
    const trackOccurrences = {};

    // Collecter les titres récents et compter leurs occurrences
    $('table.tablelist-schedule tbody tr').each((index, element) => {
      if (index >= 10) return false; // Limiter à 10 entrées pour l'analyse

      const time = $(element).find('.tablelist-schedule__time .time--schedule').text().trim();
      const trackInfo = $(element).find('.track_history_item').text().trim();

      if (trackInfo) {
        recentTracks.push({
          time: time,
          track: trackInfo
        });
        trackOccurrences[trackInfo] = (trackOccurrences[trackInfo] || 0) + 1;
      }
    });

    // Identifier les titres répétitifs (slogans)
    const FREQUENCY_THRESHOLD = 0.2; // 20% pour une fenêtre plus petite
    const frequentTracks = new Set();
    const totalTracks = recentTracks.length;

    for (const [track, count] of Object.entries(trackOccurrences)) {
      if (count / totalTracks > FREQUENCY_THRESHOLD) {
        frequentTracks.add(track);
      }
    }

    // Trouver le dernier titre non répétitif
    let lastValidTrack = null;
    for (const track of recentTracks) {
      if (!frequentTracks.has(track.track)) {
        lastValidTrack = track;
        break;
      }
    }

    if (!lastValidTrack) {
      res.status(404).json({
        error: 'Aucun titre valide trouvé',
        radioName: radioName,
        removedTracks: Array.from(frequentTracks)
      });
    } else {
      res.json({
        radioName: radioName,
        lastTrack: {
          time: lastValidTrack.time,
          title: lastValidTrack.track
        },
        removedTracks: Array.from(frequentTracks)
      });
    }

  } catch (error) {
    console.error('Erreur lors de la récupération du dernier titre:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du dernier titre',
      details: error.message
    });
  }
});

module.exports = router;
