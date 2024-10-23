// src/utils/textNormalizer.js

function normalizeToAscii(text) {
  return text
    // Correction des caractères mal encodés
    .replace(/Ã¢/g, 'a')    // â mal encodé
    .replace(/Ã¨/g, 'e')    // è mal encodé
    .replace(/Ã©/g, 'e')    // é mal encodé
    .replace(/Ãª/g, 'e')    // ê mal encodé
    .replace(/Ã«/g, 'e')    // ë mal encodé
    .replace(/Ã®/g, 'i')    // î mal encodé
    .replace(/Ã¯/g, 'i')    // ï mal encodé
    .replace(/Ã´/g, 'o')    // ô mal encodé
    .replace(/Ã¶/g, 'o')    // ö mal encodé
    .replace(/Ã¹/g, 'u')    // ù mal encodé
    .replace(/Ã»/g, 'u')    // û mal encodé
    .replace(/Ã¼/g, 'u')    // ü mal encodé
    .replace(/Ã§/g, 'c')    // ç mal encodé
    .replace(/Ã/g, 'a')     // Ã seul
    // Traitement du nÂ° et variantes
    .replace(/nÂ°(\d+)/g, 'n$1')    // nÂ° suivi d'un nombre
    .replace(/([nN])°(\d+)/g, '$1$2')    // n° ou N° suivi d'un nombre
    .replace(/([nN])º(\d+)/g, '$1$2')    // nº ou Nº suivi d'un nombre
    .replace(/([nN])[°º⁰₀]A?\s*(\d+)/g, '$1$2') // autres variantes avec A optionnel
    // Caractères accentués standards
    .replace(/[\u00C0-\u00C5]/g, 'A') // À, Á, Â, Ã, Ä, Å
    .replace(/[\u00C8-\u00CB]/g, 'E') // È, É, Ê, Ë
    .replace(/[\u00CC-\u00CF]/g, 'I') // Ì, Í, Î, Ï
    .replace(/[\u00D2-\u00D6]/g, 'O') // Ò, Ó, Ô, Õ, Ö
    .replace(/[\u00D9-\u00DC]/g, 'U') // Ù, Ú, Û, Ü
    .replace(/[\u00E0-\u00E5]/g, 'a') // à, á, â, ã, ä, å
    .replace(/[\u00E8-\u00EB]/g, 'e') // è, é, ê, ë
    .replace(/[\u00EC-\u00EF]/g, 'i') // ì, í, î, ï
    .replace(/[\u00F2-\u00F6]/g, 'o') // ò, ó, ô, õ, ö
    .replace(/[\u00F9-\u00FC]/g, 'u') // ù, ú, û, ü
    .replace(/[\u00FD\u00FF]/g, 'y')  // ý, ÿ
    .replace(/[\u00C7]/g, 'C')        // Ç
    .replace(/[\u00E7]/g, 'c')        // ç
    .replace(/[\u00D1]/g, 'N')        // Ñ
    .replace(/[\u00F1]/g, 'n')        // ñ
    // Remplacer tous les autres caractères non-ASCII, en gardant l'apostrophe
    .replace(/[^a-zA-Z0-9\s\-.,!?()']/g, '')
    // Nettoyer les espaces multiples
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  normalizeToAscii
};
