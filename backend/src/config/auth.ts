/**
 * Configuration de l'authentification SOGAS-RH V2.0
 * 
 * ⚠️  SÉCURITÉ CRITIQUE ⚠️
 * Ce fichier ne doit JAMAIS logguer les valeurs des secrets JWT.
 * Seuls les avertissements de configuration non sensibles sont autorisés.
 * 
 * @module AuthConfig
 * @version 1.0.0
 * @author SOGAS-RH Team
 */

/**
 * Convertit une chaîne en boolean de façon sûre
 * @param value - Valeur string à convertir
 * @returns boolean - true si "true", false sinon
 */
function toBool(value: string | undefined): boolean {
  return value?.toLowerCase() === 'true';
}

/**
 * Convertit une chaîne en nombre entier avec valeur par défaut
 * @param value - Valeur string à convertir
 * @param defaultValue - Valeur par défaut si conversion échoue
 * @returns number - Nombre entier parsé ou valeur par défaut
 */
function toInt(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse une durée au format "15m", "2h", "7d" en millisecondes
 * @param duration - Durée au format string (ex: "15m", "2h", "30d")
 * @returns number - Durée en millisecondes
 */
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([mhd])$/);
  if (!match) {
    throw new Error(`Format de durée invalide: ${duration}. Utilisez "15m", "2h", "30d"`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'm': return value * 60 * 1000;          // minutes → ms
    case 'h': return value * 60 * 60 * 1000;     // heures → ms
    case 'd': return value * 24 * 60 * 60 * 1000; // jours → ms
    default:
      throw new Error(`Unité de temps non supportée: ${unit}`);
  }
}

// Lecture des variables d'environnement
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '30d';
const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS;
const MFA_ENABLED = process.env.MFA_ENABLED;

// Validation des secrets obligatoires
if (!JWT_ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET est obligatoire dans les variables d\'environnement');
}

if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET est obligatoire dans les variables d\'environnement');
}

if (JWT_ACCESS_SECRET === JWT_REFRESH_SECRET) {
  throw new Error('JWT_ACCESS_SECRET et JWT_REFRESH_SECRET doivent être différents pour la sécurité');
}

// Avertissements de configuration (valeurs non sensibles uniquement)
if (!process.env.JWT_ACCESS_EXPIRES) {
  console.warn('⚠️  JWT_ACCESS_EXPIRES non défini — usage valeur par défaut: 15m');
}

if (!process.env.JWT_REFRESH_EXPIRES) {
  console.warn('⚠️  JWT_REFRESH_EXPIRES non défini — usage valeur par défaut: 30d');
}

if (!process.env.BCRYPT_SALT_ROUNDS) {
  console.warn('⚠️  BCRYPT_SALT_ROUNDS non défini — usage valeur par défaut: 12');
}

if (!process.env.MFA_ENABLED) {
  console.warn('⚠️  MFA_ENABLED non défini — usage valeur par défaut: false');
}

/**
 * Configuration complète de l'authentification SOGAS-RH
 * Objet immuable contenant tous les paramètres d'authentification
 */
export const authConfig = {
  /**
   * Version de la configuration (pour migration future)
   */
  configVersion: '1.0.0',

  /**
   * Secret pour signer les JWT access tokens
   * @internal Ne jamais logguer cette valeur
   */
  jwtAccessSecret: JWT_ACCESS_SECRET,

  /**
   * Secret pour signer les JWT refresh tokens  
   * @internal Ne jamais logguer cette valeur
   */
  jwtRefreshSecret: JWT_REFRESH_SECRET,

  /**
   * Durée de vie des access tokens
   * @example "15m", "2h", "1d"
   * @default "15m"
   */
  jwtAccessExpires: JWT_ACCESS_EXPIRES,

  /**
   * Durée de vie des refresh tokens
   * @example "7d", "30d", "90d" 
   * @default "30d"
   */
  jwtRefreshExpires: JWT_REFRESH_EXPIRES,

  /**
   * Durée de vie des access tokens en millisecondes
   * Calculée automatiquement depuis jwtAccessExpires
   */
  jwtAccessExpiresMs: parseDuration(JWT_ACCESS_EXPIRES),

  /**
   * Durée de vie des refresh tokens en millisecondes
   * Calculée automatiquement depuis jwtRefreshExpires
   */
  jwtRefreshExpiresMs: parseDuration(JWT_REFRESH_EXPIRES),

  /**
   * Nombre de rounds pour le hashage bcrypt des mots de passe
   * @minimum 10
   * @recommended 12
   * @default 12
   */
  bcryptSaltRounds: toInt(BCRYPT_SALT_ROUNDS, 12),

  /**
   * Activation de l'authentification multi-facteurs (MFA)
   * @default false
   */
  mfaEnabled: toBool(MFA_ENABLED),

  /**
   * Délai de verrouillage après échecs de connexion (minutes)
   * @default 30
   */
  lockoutDurationMinutes: 30,

  /**
   * Nombre maximum de tentatives de connexion échouées
   * @default 5
   */
  maxFailedAttempts: 5,

  /**
   * Durée de session inactive avant déconnexion automatique (minutes)
   * @default 120
   */
  sessionTimeoutMinutes: 120,

  /**
   * Nom du cookie pour stocker le refresh token
   * @default "sogas_refresh_token"
   */
  refreshTokenCookieName: 'sogas_refresh_token',

  /**
   * Options du cookie refresh token
   */
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: parseDuration(JWT_REFRESH_EXPIRES),
    path: '/api/auth'
  }
} as const;

/**
 * Type inféré de la configuration d'authentification
 * Utilisé pour le typage strict dans l'application
 */
export type AuthConfig = typeof authConfig;

/*
 * QUICK CHECK - Exemple d'usage:
 * 
 * import { authConfig } from '../config/auth.js';
 * 
 * // ✅ Utilisation correcte
 * const accessTokenExpiry = authConfig.jwtAccessExpiresMs;
 * const saltRounds = authConfig.bcryptSaltRounds;
 * 
 * // ✅ Sécurisé - secrets disponibles mais non loggués
 * const accessSecret = authConfig.jwtAccessSecret; // OK pour JWT.sign()
 * 
 * // ❌ À éviter absolument
 * console.log(authConfig.jwtAccessSecret); // JAMAIS faire ça !
 * 
 * // ✅ Debug sûr
 * console.log('Config version:', authConfig.configVersion);
 * console.log('MFA activé:', authConfig.mfaEnabled);
 * console.log('Durée access token:', authConfig.jwtAccessExpires);
 */