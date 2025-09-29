/**
 * ========================================
 * NIN VALIDATOR - SOGAS-RH V2.0
 * ========================================
 * 
 * Validator pour le Numéro d'Identification Nationale (NIN) sénégalais.
 * 
 * FORMAT NIN SÉNÉGALAIS :
 * - 13 chiffres consécutifs
 * - Position 1 : Sexe (1 = homme, 2 = femme)
 * - Positions 2-3 : Année de naissance (00-99)
 * - Positions 4-5 : Mois de naissance (01-12)
 * - Positions 6-13 : Numéro unique (8 chiffres)
 * 
 * EXEMPLES VALIDES :
 * - 1950312345678 (Homme né en mars 1995)
 * - 2880523456789 (Femme née en mai 1988)
 * - 1001101234567 (Homme né en novembre 2000)
 * 
 * @module validators/ninValidator
 * @version 1.0
 * @date 2025-09-29
 */

// ========================================
// CONSTANTES
// ========================================

const NIN_LENGTH = 13;
const NIN_REGEX = /^[0-9]{13}$/;

const VALID_SEX_CODES = ['1', '2']; // 1 = Homme, 2 = Femme
const VALID_MONTHS = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12'
];

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Extrait les composants du NIN
 * @param {string} nin - NIN à analyser
 * @returns {object} Composants du NIN (sexe, année, mois, numéro)
 */
function parseNIN(nin) {
  return {
    sexCode: nin.charAt(0),           // Position 1
    yearCode: nin.substring(1, 3),    // Positions 2-3
    monthCode: nin.substring(3, 5),   // Positions 4-5
    uniqueNumber: nin.substring(5, 13) // Positions 6-13
  };
}

/**
 * Détermine le sexe à partir du code
 * @param {string} sexCode - Code sexe (1 ou 2)
 * @returns {string|null} 'MALE', 'FEMALE' ou null
 */
function getSexFromCode(sexCode) {
  if (sexCode === '1') return 'MALE';
  if (sexCode === '2') return 'FEMALE';
  return null;
}

/**
 * Calcule l'année de naissance complète
 * @param {string} yearCode - Code année (00-99)
 * @returns {number} Année complète (1900-2099)
 */
function getFullYear(yearCode) {
  const year = parseInt(yearCode, 10);
  const currentYear = new Date().getFullYear();
  const currentYearShort = currentYear % 100;
  
  // Si l'année est <= année actuelle, on suppose 2000+
  // Sinon, on suppose 1900+
  // Exemple : en 2025, "25" → 2025, "26" → 1926
  if (year <= currentYearShort) {
    return 2000 + year;
  } else {
    return 1900 + year;
  }
}

// ========================================
// FONCTION PRINCIPALE DE VALIDATION
// ========================================

/**
 * Valide un NIN sénégalais
 * 
 * @param {string} nin - NIN à valider
 * @param {object} options - Options de validation
 * @param {boolean} options.strict - Mode strict (validation structure complète)
 * @returns {object} Résultat de validation
 * @returns {boolean} result.valid - true si valide
 * @returns {string} result.error - Message d'erreur si invalide
 * @returns {object} result.data - Données extraites si valide (sexe, année, mois)
 * 
 * @example
 * const result = validateNIN('1950312345678');
 * if (result.valid) {
 *   console.log('NIN valide:', result.data);
 * } else {
 *   console.error('Erreur:', result.error);
 * }
 */
function validateNIN(nin, options = {}) {
  const { strict = true } = options;
  
  // Validation 1 : Présence du NIN
  if (!nin) {
    return {
      valid: false,
      error: 'Le NIN est requis',
      code: 'NIN_REQUIRED'
    };
  }
  
  // Validation 2 : Type de données
  if (typeof nin !== 'string') {
    return {
      valid: false,
      error: 'Le NIN doit être une chaîne de caractères',
      code: 'NIN_INVALID_TYPE'
    };
  }
  
  // Validation 3 : Longueur exacte
  if (nin.length !== NIN_LENGTH) {
    return {
      valid: false,
      error: `Le NIN doit contenir exactement ${NIN_LENGTH} chiffres (actuellement ${nin.length})`,
      code: 'NIN_INVALID_LENGTH'
    };
  }
  
  // Validation 4 : Format (uniquement des chiffres)
  if (!NIN_REGEX.test(nin)) {
    return {
      valid: false,
      error: 'Le NIN doit contenir uniquement des chiffres (0-9)',
      code: 'NIN_INVALID_FORMAT'
    };
  }
  
  // Si mode non strict, on s'arrête ici
  if (!strict) {
    return {
      valid: true,
      data: null
    };
  }
  
  // MODE STRICT : Validation de la structure
  const components = parseNIN(nin);
  
  // Validation 5 : Code sexe valide (1 ou 2)
  if (!VALID_SEX_CODES.includes(components.sexCode)) {
    return {
      valid: false,
      error: `Code sexe invalide (${components.sexCode}). Doit être 1 (homme) ou 2 (femme)`,
      code: 'NIN_INVALID_SEX_CODE'
    };
  }
  
  // Validation 6 : Code mois valide (01-12)
  if (!VALID_MONTHS.includes(components.monthCode)) {
    return {
      valid: false,
      error: `Code mois invalide (${components.monthCode}). Doit être entre 01 et 12`,
      code: 'NIN_INVALID_MONTH'
    };
  }
  
  // Validation 7 : Année cohérente (pas dans le futur)
  const birthYear = getFullYear(components.yearCode);
  const currentYear = new Date().getFullYear();
  
  if (birthYear > currentYear) {
    return {
      valid: false,
      error: `Année de naissance invalide (${birthYear}). Ne peut pas être dans le futur`,
      code: 'NIN_INVALID_YEAR'
    };
  }
  
  // Validation 8 : Âge minimum (par exemple, minimum 14 ans pour travailler)
  const age = currentYear - birthYear;
  const MIN_AGE = 14;
  
  if (age < MIN_AGE) {
    return {
      valid: false,
      error: `Âge minimum non atteint (${age} ans). Minimum requis : ${MIN_AGE} ans`,
      code: 'NIN_AGE_TOO_YOUNG'
    };
  }
  
  // Validation 9 : Âge maximum raisonnable (par exemple, maximum 90 ans)
  const MAX_AGE = 90;
  
  if (age > MAX_AGE) {
    return {
      valid: false,
      error: `Âge invalide (${age} ans). Maximum autorisé : ${MAX_AGE} ans`,
      code: 'NIN_AGE_TOO_OLD'
    };
  }
  
  // ✅ NIN VALIDE
  return {
    valid: true,
    data: {
      sexCode: components.sexCode,
      sex: getSexFromCode(components.sexCode),
      yearCode: components.yearCode,
      birthYear: birthYear,
      monthCode: components.monthCode,
      birthMonth: parseInt(components.monthCode, 10),
      uniqueNumber: components.uniqueNumber,
      age: age
    }
  };
}

// ========================================
// FONCTIONS COMPLÉMENTAIRES
// ========================================

/**
 * Masque un NIN pour affichage sécurisé
 * @param {string} nin - NIN à masquer
 * @param {number} visibleChars - Nombre de caractères visibles au début (défaut: 0)
 * @returns {string} NIN masqué (ex: ***********78)
 * 
 * @example
 * maskNIN('1950312345678')      // "***********78"
 * maskNIN('1950312345678', 1)   // "1**********78"
 * maskNIN('1950312345678', 3)   // "195********78"
 */
function maskNIN(nin, visibleChars = 0) {
  if (!nin || typeof nin !== 'string') {
    return '';
  }
  
  if (nin.length !== NIN_LENGTH) {
    return nin; // Retourner tel quel si format invalide
  }
  
  const visibleStart = nin.substring(0, visibleChars);
  const visibleEnd = nin.substring(nin.length - 2); // 2 derniers chiffres
  const maskedMiddle = '*'.repeat(NIN_LENGTH - visibleChars - 2);
  
  return visibleStart + maskedMiddle + visibleEnd;
}

/**
 * Génère un NIN aléatoire valide (pour tests uniquement)
 * ⚠️ NE PAS utiliser en production
 * 
 * @param {string} sex - 'MALE' ou 'FEMALE'
 * @param {number} birthYear - Année de naissance (optionnelle)
 * @returns {string} NIN généré
 * 
 * @example
 * generateRandomNIN('MALE', 1990)  // "1900712345678"
 */
function generateRandomNIN(sex = 'MALE', birthYear = null) {
  // Sexe
  const sexCode = sex === 'MALE' ? '1' : '2';
  
  // Année (2 derniers chiffres)
  let year;
  if (birthYear) {
    year = String(birthYear % 100).padStart(2, '0');
  } else {
    const randomYear = Math.floor(Math.random() * 70) + 1950; // 1950-2019
    year = String(randomYear % 100).padStart(2, '0');
  }
  
  // Mois (01-12)
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  
  // Numéro unique (8 chiffres)
  const uniqueNumber = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  
  return sexCode + year + month + uniqueNumber;
}

/**
 * Normalise un NIN (supprime espaces, tirets, etc.)
 * @param {string} nin - NIN à normaliser
 * @returns {string} NIN normalisé
 * 
 * @example
 * normalizeNIN('1 950 31 23 456 78')  // "1950312345678"
 * normalizeNIN('1-950-31-23-456-78')  // "1950312345678"
 */
function normalizeNIN(nin) {
  if (!nin || typeof nin !== 'string') {
    return '';
  }
  
  // Supprimer tous les caractères non-numériques
  return nin.replace(/\D/g, '');
}

// ========================================
// EXPORTS
// ========================================

module.exports = {
  validateNIN,
  maskNIN,
  generateRandomNIN,
  normalizeNIN,
  parseNIN,
  getSexFromCode,
  getFullYear,
  
  // Constantes (utiles pour les tests)
  NIN_LENGTH,
  NIN_REGEX,
  VALID_SEX_CODES,
  VALID_MONTHS
};

// ========================================
// EXEMPLES D'UTILISATION
// ========================================

/*
// Exemple 1 : Validation simple
const { validateNIN } = require('./validators/ninValidator');

const result = validateNIN('1950312345678');
if (result.valid) {
  console.log('✅ NIN valide');
  console.log('Sexe:', result.data.sex);
  console.log('Année de naissance:', result.data.birthYear);
  console.log('Âge:', result.data.age);
} else {
  console.error('❌ NIN invalide:', result.error);
}

// Exemple 2 : Masquage pour affichage
const { maskNIN } = require('./validators/ninValidator');

const nin = '1950312345678';
console.log('NIN complet:', nin);           // 1950312345678
console.log('NIN masqué:', maskNIN(nin));    // ***********78
console.log('NIN masqué (1 char):', maskNIN(nin, 1)); // 1**********78

// Exemple 3 : Normalisation
const { normalizeNIN, validateNIN } = require('./validators/ninValidator');

const ninWithSpaces = '1 950 31 23 456 78';
const normalized = normalizeNIN(ninWithSpaces);  // "1950312345678"
const result = validateNIN(normalized);

// Exemple 4 : Génération pour tests
const { generateRandomNIN } = require('./validators/ninValidator');

const testNIN = generateRandomNIN('MALE', 1990);
console.log('NIN de test:', testNIN);  // "1900712345678"
*/