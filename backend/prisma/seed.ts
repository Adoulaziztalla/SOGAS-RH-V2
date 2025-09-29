import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ROLES, PERMISSIONS } from '../src/types/auth';

const prisma = new PrismaClient();

// Configuration
const ADMIN_EMAIL = 'admin@sogas.local';
const ADMIN_PASS = 'Admin@123';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

async function main(): Promise<void> {
  console.log('🌱 Démarrage du seed de la base de données...\n');

  try {
    // ==========================================
    // 1) Créer tous les rôles
    // ==========================================
    console.log('📋 Création des rôles...');
    const rolesData = Object.values(ROLES).map((name) => ({ name }));
    const rolesResult = await prisma.role.createMany({
      data: rolesData,
      skipDuplicates: true,
    });
    console.log(`✅ ${rolesResult.count} rôle(s) créé(s)\n`);

    // ==========================================
    // 2) Créer toutes les permissions
    // ==========================================
    console.log('🔐 Création des permissions...');
    const permissionsData = Object.values(PERMISSIONS).map((name) => ({ name }));
    const permissionsResult = await prisma.permission.createMany({
      data: permissionsData,
      skipDuplicates: true,
    });
    console.log(`✅ ${permissionsResult.count} permission(s) créée(s)\n`);

    // ==========================================
    // 3) Récupérer les IDs des rôles et permissions
    // ==========================================
    console.log('🔍 Récupération des IDs...');
    const allRoles = await prisma.role.findMany();
    const allPermissions = await prisma.permission.findMany();

    const roleIdsByName = new Map(
      allRoles.map((role) => [role.name, role.id])
    );
    const permIdsByName = new Map(
      allPermissions.map((perm) => [perm.name, perm.id])
    );
    console.log(`✅ ${roleIdsByName.size} rôles et ${permIdsByName.size} permissions indexés\n`);

    // ==========================================
    // 4) Lier toutes les permissions au rôle ADMIN_TECH
    // ==========================================
    console.log('🔗 Attribution des permissions au rôle ADMIN_TECH...');
    const adminTechRoleId = roleIdsByName.get(ROLES.ADMIN_TECH);
    
    if (!adminTechRoleId) {
      throw new Error(`Rôle ${ROLES.ADMIN_TECH} introuvable`);
    }

    const rolePermissionsData = Object.values(PERMISSIONS).map((permName) => {
      const permissionId = permIdsByName.get(permName);
      if (!permissionId) {
        throw new Error(`Permission ${permName} introuvable`);
      }
      return {
        roleId: adminTechRoleId,
        permissionId,
      };
    });

    const rolePermsResult = await prisma.rolePermission.createMany({
      data: rolePermissionsData,
      skipDuplicates: true,
    });
    console.log(`✅ ${rolePermsResult.count} permission(s) attribuée(s)\n`);

    // ==========================================
    // 5) Créer/Mettre à jour l'utilisateur admin
    // ==========================================
    console.log('👤 Création de l\'utilisateur admin...');
    const passwordHash = await bcrypt.hash(ADMIN_PASS, SALT_ROUNDS);

    const adminUser = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        passwordHash,
        updatedAt: new Date(),
      },
      create: {
        email: ADMIN_EMAIL,
        passwordHash,
        firstName: 'Admin',
        lastName: 'Système',
        isActive: true,
      },
    });
    console.log(`✅ Utilisateur admin créé/mis à jour (ID: ${adminUser.id})\n`);

    // ==========================================
    // 6) Lier l'admin au rôle ADMIN_TECH
    // ==========================================
    console.log('🔗 Attribution du rôle ADMIN_TECH à l\'admin...');
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminTechRoleId,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminTechRoleId,
      },
    });
    console.log('✅ Rôle attribué\n');

    console.log('✨ Seed terminé avec succès !');
    console.log('\n📊 Résumé :');
    console.log(`   - Rôles : ${roleIdsByName.size}`);
    console.log(`   - Permissions : ${permIdsByName.size}`);
    console.log(`   - Admin : ${ADMIN_EMAIL}`);

  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ==========================================
// COMMENT LANCER LE SEED
// ==========================================
// Option A (recommandée) :
//   Ajouter dans package.json :
//   "prisma": {
//     "seed": "tsx prisma/seed.ts"
//   }
//   Puis lancer : npx prisma db seed
//
// Option B (direct) :
//   npx tsx prisma/seed.ts