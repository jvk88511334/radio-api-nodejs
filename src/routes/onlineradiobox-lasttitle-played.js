const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const {normalizeToAscii} = require("../utils/normalize-to-ascii");

router.get('/country/:countryCode/radioname/:radioFullName', async (req, res) => {
  const radioName = req.params.radioFullName.toLowerCase();
  const countryCode = req.params.countryCode.toLowerCase();

  try {
    const url = `https://onlineradiobox.com/${countryCode}/${radioName}/playlist/`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Récupérer les titres pour analyse
    const recentTracks = [];
    const trackOccurrences = {};
    let totalAnalyzedTracks = 0;

    // Première passe : collecter les occurrences pour identifier les slogans
    $('table.tablelist-schedule tbody tr').each((index, element) => {
      if (index >= 20) return false; // Augmenté à 20 pour avoir plus de contexte

      const trackInfo = normalizeToAscii($(element).find('.track_history_item').text().trim());
      if (trackInfo) {
        trackOccurrences[trackInfo] = (trackOccurrences[trackInfo] || 0) + 1;
        totalAnalyzedTracks++;
      }
    });

    // Identifier les slogans basés sur la fréquence
    const FREQUENCY_THRESHOLD = 0.2;
    const slogans = new Set();

    for (const [track, count] of Object.entries(trackOccurrences)) {
      if (count / totalAnalyzedTracks > FREQUENCY_THRESHOLD) {
        slogans.add(track);
      }
    }

    // Deuxième passe : collecter les titres avec leur timing
    $('table.tablelist-schedule tbody tr').each((index, element) => {
      if (index >= 20) return false;

      const time = $(element).find('.tablelist-schedule__time .time--schedule').text().trim();
      const trackInfo = normalizeToAscii($(element).find('.track_history_item').text().trim());

      if (trackInfo) {
        recentTracks.push({
          time: time,
          track: trackInfo,
          isSlogan: slogans.has(trackInfo)
        });
      }
    });

    // Trouver le dernier titre non-slogan
    let validTrack = null;
    let foundValidTrack = false;

    for (let i = 0; i < recentTracks.length && !foundValidTrack; i++) {
      const currentTrack = recentTracks[i];

      if (!currentTrack.isSlogan) {
        validTrack = {
          time: currentTrack.time,
          title: currentTrack.track
        };
        foundValidTrack = true;
      }
    }

    if (!validTrack) {
      res.status(404).json({
        error: 'Aucun titre valide trouvé',
        radioName: radioName,
        country: countryCode,
        slogans: Array.from(slogans)
      });
    } else {
      res.json({
        radioName: radioName,
        country: countryCode,
        lastTrack: validTrack,
        slogans: Array.from(slogans)
      });
    }

  } catch (error) {
    console.error('Erreur lors de la récupération du dernier titre:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du dernier titre',
      details: error.message,
      radioName: radioName,
      country: countryCode
    });
  }
});

module.exports = router;
