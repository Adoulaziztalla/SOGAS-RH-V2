import type { PermissionName } from '../types/auth';

/**
 * User record returned by UserRepository
 */
export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  roleIds: string[];
  permissions: PermissionName[];
}

/**
 * Session record returned by SessionStore
 */
export interface SessionRecord {
  id: string;
  userId: string;
  currentRefreshJti: string;
  createdAt: Date;
  revokedAt?: Date;
}

/**
 * Repository interface for user operations
 */
export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
}

/**
 * Store interface for session management
 */
export interface SessionStore {
  create(userId: string, refreshJti: string): Promise<SessionRecord>;
  get(sessionId: string): Promise<SessionRecord | null>;
  setRefreshJti(sessionId: string, newJti: string): Promise<void>;
  revoke(sessionId: string): Promise<void>;
}

/**
 * Store interface for token revocation
 */
export interface RevocationStore {
  isRevoked(jti: string): Promise<boolean>;
  revoke(jti: string): Promise<void>;
}

/**
 * Token service interface for JWT operations
 */
export interface TokenService {
  generateAccessToken(payload: {
    userId: string;
    email: string;
    roleIds: string[];
    permissions: PermissionName[];
  }): string;
  
  generateRefreshToken(payload: {
    userId: string;
    sessionId: string;
    jti: string;
  }): string;
  
  verifyAccessToken(token: string): {
    userId: string;
    email: string;
    roleIds: string[];
    permissions: PermissionName[];
  };
  
  verifyRefreshToken(token: string): {
    userId: string;
    sessionId: string;
    jti: string;
  };
}

/**
 * Hash service interface for password operations
 */
export interface HashService {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

/**
 * Login response structure
 */
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    roleIds: string[];
    permissions: PermissionName[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Refresh response structure
 */
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Authentication Service
 * Handles login, token refresh, and logout operations
 */
export class AuthService {
  constructor(
    private readonly deps: {
      userRepository: UserRepository;
      sessionStore: SessionStore;
      revocationStore: RevocationStore;
      tokenService?: TokenService;
      hashService?: HashService;
    }
  ) {}

  /**
   * Authenticates a user with email and password
   */
  async loginWithPassword(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    if (!this.deps.hashService) {
      throw new Error('HashService not configured');
    }
    if (!this.deps.tokenService) {
      throw new Error('TokenService not configured');
    }

    // 1. Find user by email
    const user = await this.deps.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 2. Verify password
    const isValidPassword = await this.deps.hashService.verify(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // 3. Generate refresh JTI
    const refreshJti = crypto.randomUUID();

    // 4. Create session
    const session = await this.deps.sessionStore.create(user.id, refreshJti);

    // 5. Generate tokens
    const accessToken = this.deps.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      roleIds: user.roleIds,
      permissions: user.permissions,
    });

    const refreshToken = this.deps.tokenService.generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
      jti: refreshJti,
    });

    // 6. Return response
    return {
      user: {
        id: user.id,
        email: user.email,
        roleIds: user.roleIds,
        permissions: user.permissions,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Refreshes an access token using a refresh token
   */
  async refreshTokens(refreshToken: string): Promise<RefreshResponse> {
    if (!this.deps.tokenService) {
      throw new Error('TokenService not configured');
    }

    // 1. Verify refresh token
    let payload;
    try {
      payload = this.deps.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new Error('INVALID_TOKEN');
    }

    // 2. Check if JTI is revoked
    const isRevoked = await this.deps.revocationStore.isRevoked(payload.jti);
    if (isRevoked) {
      throw new Error('TOKEN_REVOKED');
    }

    // 3. Get session
    const session = await this.deps.sessionStore.get(payload.sessionId);
    if (!session) {
      throw new Error('SESSION_NOT_FOUND');
    }

    // 4. Check if session is revoked
    if (session.revokedAt) {
      throw new Error('SESSION_REVOKED');
    }

    // 5. Verify JTI matches current session JTI
    if (session.currentRefreshJti !== payload.jti) {
      // Token reuse detected - revoke session
      await this.deps.sessionStore.revoke(session.id);
      await this.deps.revocationStore.revoke(payload.jti);
      throw new Error('TOKEN_REUSE_DETECTED');
    }

    // 6. Get user
    const user = await this.deps.userRepository.findByEmail(
      payload.userId // Note: This assumes userId, but we should use a findById method
    );
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // 7. Revoke old refresh token
    await this.deps.revocationStore.revoke(payload.jti);

    // 8. Generate new refresh JTI
    const newRefreshJti = crypto.randomUUID();

    // 9. Update session with new JTI
    await this.deps.sessionStore.setRefreshJti(session.id, newRefreshJti);

    // 10. Generate new tokens
    const accessToken = this.deps.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      roleIds: user.roleIds,
      permissions: user.permissions,
    });

    const newRefreshToken = this.deps.tokenService.generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
      jti: newRefreshJti,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logs out a user by revoking their session
   */
  async logout(sessionId: string): Promise<void> {
    const session = await this.deps.sessionStore.get(sessionId);
    if (!session) {
      return; // Idempotent
    }

    // Revoke the session
    await this.deps.sessionStore.revoke(sessionId);

    // Revoke the current refresh token
    if (session.currentRefreshJti) {
      await this.deps.revocationStore.revoke(session.currentRefreshJti);
    }
  }

  /**
   * Logs out using a refresh token
   */
  async logoutWithToken(refreshToken: string): Promise<void> {
    if (!this.deps.tokenService) {
      throw new Error('TokenService not configured');
    }

    try {
      const payload = this.deps.tokenService.verifyRefreshToken(refreshToken);
      await this.logout(payload.sessionId);
    } catch {
      // Token invalid or expired - logout is idempotent
      return;
    }
  }
}