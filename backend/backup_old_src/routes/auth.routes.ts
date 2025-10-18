import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

/**
 * Construit et retourne le router des routes d'authentification
 */
export function buildAuthRoutes(): Router {
  const router = Router();

  /**
   * @route   POST /auth/login
   * @desc    Connexion utilisateur
   * @access  Public
   */
  router.post('/login', authController.login.bind(authController));

  /**
   * @route   POST /auth/logout
   * @desc    Déconnexion utilisateur
   * @access  Public
   */
  router.post('/logout', authController.logout.bind(authController));

  /**
   * @route   POST /auth/refresh
   * @desc    Rafraîchir le token d'accès
   * @access  Public
   */
  router.post('/refresh', authController.refresh.bind(authController));

  /**
   * @route   GET /auth/me
   * @desc    Récupérer l'utilisateur connecté
   * @access  Private (requireAuth)
   */
  router.get('/me', requireAuth, authController.getCurrentUser.bind(authController));

  return router;
}