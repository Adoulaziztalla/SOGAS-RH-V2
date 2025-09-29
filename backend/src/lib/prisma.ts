import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client
 * 
 * En développement, le hot-reload peut créer plusieurs instances de PrismaClient.
 * Ce pattern garantit une seule instance réutilisée entre les reloads.
 * 
 * En production, une nouvelle instance est créée à chaque démarrage.
 */

// Type augmenté pour le global
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Instance Prisma Client
 * Réutilise l'instance globale en développement pour éviter les fuites mémoire
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// En développement, stocker l'instance dans global pour réutilisation
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Déconnexion propre de Prisma
 * Utile pour les tests et l'arrêt gracieux de l'application
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}