import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';
import type { PermissionName } from '../types/auth';

// Token service instance (singleton)
const tokenService = new TokenService();

/**
 * User payload attached to request after authentication
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  roleIds: string[];
  permissions: PermissionName[];
}

// Augment Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Main authentication middleware
 * Verifies JWT Access Token presence and validity
 * Injects claims into req.user
 */
export function requireAuth() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
        return;
      }

      // Parse token (tolerant to spaces and case)
      const parts = authHeader.trim().split(/\s+/);

      if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid authorization format',
        });
        return;
      }

      const token = parts[1];

      if (!token) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Token missing',
        });
        return;
      }

      // Verify token via TokenService
      const payload = tokenService.verifyAccessToken(token);

      // Inject claims into req.user
      req.user = {
        userId: payload.userId,
        email: payload.email,
        roleIds: payload.roleIds,
        permissions: payload.permissions,
      };

      next();
    } catch (error: any) {
      // Map TokenService errors to HTTP codes
      if (error.message === 'TOKEN_EXPIRED') {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Token expired',
        });
        return;
      }

      if (error.message === 'INVALID_TOKEN') {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token',
        });
        return;
      }

      // Any other error = invalid token
      console.error('Auth middleware error:', error);
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication failed',
      });
    }
  };
}

/**
 * Role verification middleware
 * Verifies that the user has at least one of the required roles
 * @param roleIds - List of authorized role IDs
 */
export function requireRole(...roleIds: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check for req.user presence (must be called after requireAuth)
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    // Check if user has at least one of the required roles
    const userRoleIds = req.user.roleIds;

    const hasRole = roleIds.some((roleId) => userRoleIds.includes(roleId));

    if (!hasRole) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}

/**
 * Permission verification middleware
 * Verifies that the user has at least one of the required permissions (ANY mode)
 * @param permissions - List of required permissions
 */
export function requirePermission(...permissions: PermissionName[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check for req.user presence (must be called after requireAuth)
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    // Check if user has at least one of the permissions (ANY mode)
    const userPermissions = req.user.permissions;

    const hasPermission = permissions.some((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}

/**
 * Permission verification middleware (ALL mode)
 * Verifies that the user has ALL of the required permissions
 * @param permissions - List of required permissions
 */
export function requireAllPermissions(...permissions: PermissionName[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    const userPermissions = req.user.permissions;

    const hasAllPermissions = permissions.every((perm) => userPermissions.includes(perm));

    if (!hasAllPermissions) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
}