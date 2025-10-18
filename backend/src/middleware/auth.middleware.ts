import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extension du type Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        roles: string[];
        permissions: string[];
      };
    }
  }
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token dans le header Authorization
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token manquant ou invalide',
        },
      });
      return;
    }

    // Extraire le token (enlever "Bearer ")
    const token = authHeader.substring(7);

    // Vérifier le token
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

    if (!JWT_ACCESS_SECRET) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Configuration JWT manquante',
        },
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as {
      userId: string;
      email: string;
      roles: string[];
      permissions: string[];
    };

    // Injecter les informations de l'utilisateur dans req.user
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token expiré',
        },
      });
      return;
    }

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token invalide',
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Erreur d\'authentification',
      },
    });
  }
};

/**
 * Middleware de vérification de permission
 */
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Non authentifié',
        },
      });
      return;
    }

    if (!req.user.permissions.includes(permission)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Permission insuffisante',
        },
      });
      return;
    }

    next();
  };
};