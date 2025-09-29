import { Router } from 'express';
import { buildAuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import type { AuthService } from '../services/auth.service.js';

/**
 * Factory pour créer le router d'authentification
 * @param deps - Dépendances injectées (authService)
 * @returns Router Express configuré avec les routes /auth
 * 
 * Quick check - Intégration dans app.ts :
 * ```typescript
 * import { buildAuthRoutes } from './routes/auth.routes';
 * 
 * const authService = new AuthService(db, tokenService, hashService);
 * const authRouter = buildAuthRoutes({ authService });
 * app.use('/auth', authRouter);
 * ```
 */
export function buildAuthRoutes(deps: { authService: AuthService }): Router {
  // 1) Construire le controller avec injection de dépendances
  const { login, refresh, logout } = buildAuthController({
    authService: deps.authService
  });

  // 2) Créer le router Express
  const router = Router();

  // 3) Définir les routes d'authentification
  
  /**
   * POST /auth/login
   * Connexion utilisateur avec email/password
   * Body: { email: string, password: string }
   * Public (pas d'authentification requise)
   */
  router.post('/login', login);

  /**
   * POST /auth/refresh
   * Rafraîchissement des tokens d'accès
   * Body: { refreshToken: string }
   * Public (pas d'authentification requise)
   */
  router.post('/refresh', refresh);

  /**
   * POST /auth/logout
   * Déconnexion utilisateur (révocation de session)
   * Body: { sessionId?: string, refreshToken?: string }
   * Protégé (authentification requise)
   */
  router.post('/logout', requireAuth(), logout);

  // 4) Retourner le router configuré
  return router;
}