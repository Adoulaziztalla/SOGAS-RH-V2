import { prisma } from './src/lib/prisma.js';

async function test() {
  console.log('🔍 Test connexion Prisma...');
  
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✅ Prisma OK - Utilisateurs:', users.length);
  } catch (error) {
    console.error('❌ Erreur Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();