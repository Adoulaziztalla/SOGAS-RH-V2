import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';

/**
 * Controller pour l'authentification
 */
export class AuthController {
  /**
   * Login - Connexion utilisateur
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email et mot de passe requis',
          },
        });
        return;
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: {
          code: error.message || 'LOGIN_FAILED',
          message: 'Échec de la connexion',
        },
      });
    }
  }

  /**
   * Logout - Déconnexion utilisateur
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.status(200).json({
        success: true,
        message: 'Déconnexion réussie',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Échec de la déconnexion',
        },
      });
    }
  }

  /**
   * Refresh - Rafraîchir le token
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REFRESH_TOKEN',
            message: 'Refresh token requis',
          },
        });
        return;
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: 'Échec du rafraîchissement',
        },
      });
    }
  }

  /**
   * Get Current User - Récupérer l'utilisateur connecté
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Non authentifié',
          },
        });
        return;
      }

      const user = await authService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_USER_FAILED',
          message: 'Impossible de récupérer l\'utilisateur',
        },
      });
    }
  }
}

export const authController = new AuthController();