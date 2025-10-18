import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Service d'authentification
 */
class AuthService {
  /**
   * Connexion utilisateur
   */
  async login(email: string, password: string) {
    // Récupérer l'utilisateur avec ses rôles et permissions
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new Error('ACCOUNT_DISABLED');
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Extraire les rôles et permissions
    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`)
    );

    // Générer les tokens
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles,
        permissions,
      },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Sauvegarder la session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        permissions,
      },
    };
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(refreshToken: string) {
    await prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshAccessToken(refreshToken: string) {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';

    try {
      // Vérifier le refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
        userId: string;
        email: string;
      };

      // Vérifier que la session existe
      const session = await prisma.session.findFirst({
        where: {
          userId: decoded.userId,
          refreshToken,
        },
      });

      if (!session) {
        throw new Error('INVALID_REFRESH_TOKEN');
      }

      // Récupérer l'utilisateur avec rôles et permissions
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.isActive) {
        throw new Error('USER_NOT_FOUND');
      }

      // Extraire les rôles et permissions
      const roles = user.roles.map((ur) => ur.role.name);
      const permissions = user.roles.flatMap((ur) =>
        ur.role.permissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`)
      );

      // Générer un nouveau access token
      const accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          roles,
          permissions,
        },
        JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      return { accessToken };
    } catch (error) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }
  }

  /**
   * Récupérer un utilisateur par son ID avec ses rôles et permissions
   * MÉTHODE AJOUTÉE POUR /auth/me
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                permissions: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        resource: true,
                        action: true,
                        description: true,
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
      throw new Error('USER_NOT_FOUND');
    }

    // Formater les rôles et permissions
    const roles = user.roles.map((ur) => ur.role);
    const permissions = roles.flatMap((role) =>
      role.permissions.map((rp) => rp.permission)
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      roles: roles.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
      })),
      permissions: permissions.map((p) => ({
        id: p.id,
        resource: p.resource,
        action: p.action,
        description: p.description,
      })),
    };
  }
}

// Export de l'instance (pour utilisation directe)
export const authService = new AuthService();

// Export de la classe (pour d'autres usages comme repositories)
export { AuthService };