import { buildApp } from './app.js';

/**
 * Point d'entrée de l'application
 * Initialise et démarre le serveur Express
 * 
 * Variables d'environnement :
 * - PORT : Port d'écoute du serveur (défaut: 3000)
 * - NODE_ENV : Environnement d'exécution (development/production)
 */

// Configuration du port
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Construction de l'application
const app = buildApp();

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('==========================================');
  console.log(`🚀 Server running in ${NODE_ENV} mode`);
  console.log(`📍 Listening on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/auth`);
  console.log('==========================================');
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});