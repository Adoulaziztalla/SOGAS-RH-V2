import { prisma } from '../lib/prisma';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { HashService } from '../services/hash.service';
import type {
  UserRecord,
  UserRepository,
  SessionRecord,
  SessionStore,
  RevocationStore,
} from '../services/auth.service';
import type { PermissionName } from '../types/auth';

/**
 * Prisma-backed implementation of UserRepository
 */
export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        roleLinks: {
          select: {
            roleId: true,
            role: {
              select: {
                rolePerms: {
                  select: {
                    permission: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Extract roleIds
    const roleIds = user.roleLinks.map((link) => link.roleId);

    // Extract unique permissions from all roles
    const permissionsSet = new Set<PermissionName>();
    user.roleLinks.forEach((link) => {
      link.role.rolePerms.forEach((rp) => {
        permissionsSet.add(rp.permission.name as PermissionName);
      });
    });
    const permissions = Array.from(permissionsSet);

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      roleIds,
      permissions,
    };
  }
}

/**
 * Prisma-backed implementation of SessionStore
 */
export class PrismaSessionStore implements SessionStore {
  async create(userId: string, refreshJti: string): Promise<SessionRecord> {
    const session = await prisma.session.create({
      data: {
        userId,
        currentRefreshJti: refreshJti,
      },
      select: {
        id: true,
        userId: true,
        currentRefreshJti: true,
        createdAt: true,
        revokedAt: true,
      },
    });

    return {
      id: session.id,
      userId: session.userId,
      currentRefreshJti: session.currentRefreshJti,
      createdAt: session.createdAt,
      revokedAt: session.revokedAt ?? undefined,
    };
  }

  async get(sessionId: string): Promise<SessionRecord | null> {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        currentRefreshJti: true,
        createdAt: true,
        revokedAt: true,
      },
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      userId: session.userId,
      currentRefreshJti: session.currentRefreshJti,
      createdAt: session.createdAt,
      revokedAt: session.revokedAt ?? undefined,
    };
  }

  async setRefreshJti(sessionId: string, newJti: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { currentRefreshJti: newJti },
    });
  }

  async revoke(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}

/**
 * Prisma-backed implementation of RevocationStore
 */
export class PrismaRevocationStore implements RevocationStore {
  async isRevoked(jti: string): Promise<boolean> {
    const revokedToken = await prisma.revokedToken.findUnique({
      where: { jti },
    });
    return !!revokedToken;
  }

  async revoke(jti: string): Promise<void> {
    await prisma.revokedToken.upsert({
      where: { jti },
      create: { jti },
      update: {},
    });
  }
}

/**
 * Factory function to build an AuthService with Prisma-backed repositories
 * Includes TokenService and HashService
 */
export function buildPrismaAuthService(): AuthService {
  const repos: UserRepository = new PrismaUserRepository();
  const sessions: SessionStore = new PrismaSessionStore();
  const revocations: RevocationStore = new PrismaRevocationStore();
  const tokenService = new TokenService();
  const hashService = new HashService();

  return new AuthService({
    userRepository: repos,
    sessionStore: sessions,
    revocationStore: revocations,
    tokenService,
    hashService,
  });
}