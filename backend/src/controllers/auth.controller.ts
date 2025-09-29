import type { Request, Response } from 'express';
import type { AuthService } from '../services/auth.service';

/**
 * Factory to create authentication controller
 * @param deps - Injected dependencies (authService)
 * @returns Object containing login, refresh, logout handlers
 * 
 * Quick check - Injection in routes:
 * ```typescript
 * const authController = buildAuthController({ authService });
 * router.post('/login', authController.login);
 * router.post('/refresh', authController.refresh);
 * router.post('/logout', authController.logout);
 * ```
 */
export function buildAuthController(deps: { authService: AuthService }) {
  /**
   * User login handler
   * POST /auth/login
   * Body: { email: string, password: string }
   * Response: 200 { tokens, user } | 401 INVALID_CREDENTIALS | 400 BAD_REQUEST
   */
  async function login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({
          code: 'BAD_REQUEST',
          message: 'Email and password are required',
        });
        return;
      }

      // Call authentication service
      const result = await deps.authService.loginWithPassword(email, password);

      // Return success response
      res.status(200).json({
        tokens: result.tokens,
        user: result.user,
      });
    } catch (error: any) {
      // Handle specific authentication errors
      if (error.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        });
        return;
      }

      // Generic error response (don't leak internal details)
      console.error('Login error:', error);
      res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Authentication failed',
      });
    }
  }

  /**
   * Token refresh handler
   * POST /auth/refresh
   * Body: { refreshToken: string }
   * Response: 200 { accessToken, refreshToken } | 401 TOKEN_EXPIRED/TOKEN_REVOKED | 400 BAD_REQUEST
   */
  async function refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      // Validate required field
      if (!refreshToken || typeof refreshToken !== 'string') {
        res.status(400).json({
          code: 'BAD_REQUEST',
          message: 'Refresh token is required',
        });
        return;
      }

      // Call token refresh service
      const result = await deps.authService.refreshTokens(refreshToken);

      // Return new tokens
      res.status(200).json({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error: any) {
      // Handle specific token errors
      if (error.message === 'TOKEN_EXPIRED') {
        res.status(401).json({
          code: 'TOKEN_EXPIRED',
          message: 'Refresh token expired',
        });
        return;
      }

      if (error.message === 'TOKEN_REVOKED' || error.message === 'SESSION_REVOKED') {
        res.status(401).json({
          code: 'TOKEN_REVOKED',
          message: 'Token has been revoked',
        });
        return;
      }

      if (error.message === 'TOKEN_REUSE_DETECTED') {
        res.status(401).json({
          code: 'TOKEN_REUSE_DETECTED',
          message: 'Token reuse detected - session revoked',
        });
        return;
      }

      if (error.message === 'INVALID_TOKEN') {
        res.status(401).json({
          code: 'INVALID_TOKEN',
          message: 'Invalid refresh token',
        });
        return;
      }

      // Generic error response
      console.error('Token refresh error:', error);
      res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Token refresh failed',
      });
    }
  }

  /**
   * User logout handler
   * POST /auth/logout
   * Body: { sessionId?: string, refreshToken?: string } (at least one required)
   * Response: 200 { success: true } (idempotent) | 400 BAD_REQUEST
   */
  async function logout(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, refreshToken } = req.body;

      // Validation: at least one identifier required
      if (!sessionId && !refreshToken) {
        res.status(400).json({
          code: 'BAD_REQUEST',
          message: 'Either sessionId or refreshToken is required',
        });
        return;
      }

      // Validate types if present
      if (sessionId && typeof sessionId !== 'string') {
        res.status(400).json({
          code: 'BAD_REQUEST',
          message: 'Invalid sessionId format',
        });
        return;
      }

      if (refreshToken && typeof refreshToken !== 'string') {
        res.status(400).json({
          code: 'BAD_REQUEST',
          message: 'Invalid refreshToken format',
        });
        return;
      }

      // Call logout service (idempotent)
      if (refreshToken) {
        await deps.authService.logoutWithToken(refreshToken);
      } else if (sessionId) {
        await deps.authService.logout(sessionId);
      }

      // Always return success (idempotent)
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      // Even on error, return success (idempotent logout)
      console.error('Logout error:', error);
      res.status(200).json({
        success: true,
      });
    }
  }

  return {
    login,
    refresh,
    logout,
  };
}