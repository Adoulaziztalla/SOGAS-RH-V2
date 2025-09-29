import jwt from 'jsonwebtoken';
import type { PermissionName } from '../types/auth';

/**
 * Token Service - Handles JWT generation and verification
 */
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(config?: {
    accessSecret?: string;
    refreshSecret?: string;
    accessExpiresIn?: string;
    refreshExpiresIn?: string;
  }) {
    this.accessSecret = config?.accessSecret || process.env.JWT_ACCESS_SECRET || 'access-secret-change-me';
    this.refreshSecret = config?.refreshSecret || process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-me';
    this.accessExpiresIn = config?.accessExpiresIn || process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    this.refreshExpiresIn = config?.refreshExpiresIn || process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    // Warn if using default secrets in production
    if (process.env.NODE_ENV === 'production') {
      if (this.accessSecret.includes('change-me') || this.refreshSecret.includes('change-me')) {
        console.warn('⚠️  WARNING: Using default JWT secrets in production!');
      }
    }
  }

  /**
   * Generate an access token (short-lived)
   */
  generateAccessToken(payload: {
    userId: string;
    email: string;
    roleIds: string[];
    permissions: PermissionName[];
  }): string {
    return jwt.sign(
      {
        sub: payload.userId,
        email: payload.email,
        roleIds: payload.roleIds,
        permissions: payload.permissions,
        type: 'access',
      },
      this.accessSecret,
      {
        expiresIn: this.accessExpiresIn,
        issuer: 'sogas-rh',
        audience: 'sogas-rh-api',
      }
    );
  }

  /**
   * Generate a refresh token (long-lived)
   */
  generateRefreshToken(payload: {
    userId: string;
    sessionId: string;
    jti: string;
  }): string {
    return jwt.sign(
      {
        sub: payload.userId,
        sessionId: payload.sessionId,
        jti: payload.jti,
        type: 'refresh',
      },
      this.refreshSecret,
      {
        expiresIn: this.refreshExpiresIn,
        issuer: 'sogas-rh',
        audience: 'sogas-rh-api',
      }
    );
  }

  /**
   * Verify and decode an access token
   */
  verifyAccessToken(token: string): {
    userId: string;
    email: string;
    roleIds: string[];
    permissions: PermissionName[];
  } {
    try {
      const decoded = jwt.verify(token, this.accessSecret, {
        issuer: 'sogas-rh',
        audience: 'sogas-rh-api',
      }) as any;

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return {
        userId: decoded.sub,
        email: decoded.email,
        roleIds: decoded.roleIds || [],
        permissions: decoded.permissions || [],
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('INVALID_TOKEN');
      }
      throw error;
    }
  }

  /**
   * Verify and decode a refresh token
   */
  verifyRefreshToken(token: string): {
    userId: string;
    sessionId: string;
    jti: string;
  } {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        issuer: 'sogas-rh',
        audience: 'sogas-rh-api',
      }) as any;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return {
        userId: decoded.sub,
        sessionId: decoded.sessionId,
        jti: decoded.jti,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('INVALID_TOKEN');
      }
      throw error;
    }
  }

  /**
   * Decode a token without verification (for debugging only)
   */
  decode(token: string): any {
    return jwt.decode(token);
  }
}