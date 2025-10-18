// backend/prisma/seeds/auth.seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedAuth() {
  console.log('\n🔐 Seeding Authentication Module...\n');

  // 1. Nettoyer les données existantes
  console.log('🧹 Nettoyage...');
  await prisma.userRole.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
  console.log('✅ Nettoyage terminé\n');

  // 2. Créer les permissions (selon schéma exact)
  console.log('📋 Creating permissions...');
  
  const permissions = [
    // Employees
    { resource: 'employees', action: 'read', description: 'Lecture des employés' },
    { resource: 'employees', action: 'create', description: 'Création d\'employés' },
    { resource: 'employees', action: 'update', description: 'Modification d\'employés' },
    { resource: 'employees', action: 'delete', description: 'Suppression d\'employés' },
    
    // Organization
    { resource: 'organization', action: 'read', description: 'Lecture de l\'organisation' },
    { resource: 'organization', action: 'write', description: 'Gestion de l\'organisation' },
    
    // Users
    { resource: 'users', action: 'read', description: 'Lecture des utilisateurs' },
    { resource: 'users', action: 'write', description: 'Gestion des utilisateurs' },
    
    // Roles
    { resource: 'roles', action: 'read', description: 'Lecture des rôles' },
    { resource: 'roles', action: 'write', description: 'Gestion des rôles' },
    
    // Leaves
    { resource: 'leaves', action: 'read', description: 'Lecture des congés' },
    { resource: 'leaves', action: 'write', description: 'Gestion des congés' },
    { resource: 'leaves', action: 'approve', description: 'Approbation des congés' },
  ];

  const createdPermissions = [];
  for (const perm of permissions) {
    const permission = await prisma.permission.create({
      data: perm,
    });
    createdPermissions.push(permission);
    console.log(`  ✓ ${perm.resource}:${perm.action}`);
  }

  console.log(`✅ ${createdPermissions.length} permissions créées\n`);

  // 3. Créer les rôles (selon schéma exact)
  console.log('👥 Creating roles...');

  const adminRole = await prisma.role.create({
    data: {
      name: 'Administrateur',
      description: 'Accès complet au système',
      isActive: true,
    },
  });
  console.log('  ✓ Administrateur role created');

  const managerRole = await prisma.role.create({
    data: {
      name: 'Manager',
      description: 'Gestionnaire avec droits limités',
      isActive: true,
    },
  });
  console.log('  ✓ Manager role created');

  const employeeRole = await prisma.role.create({
    data: {
      name: 'Employé',
      description: 'Accès basique employé',
      isActive: true,
    },
  });
  console.log('  ✓ Employé role created\n');

  // 4. Assigner toutes les permissions au rôle Admin
  console.log('🔗 Assigning permissions to Administrateur role...');

  for (const permission of createdPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log(`✅ ${createdPermissions.length} permissions assignées\n`);

  // 5. Assigner permissions limitées au Manager
  console.log('🔗 Assigning permissions to Manager role...');

  const managerPermissions = createdPermissions.filter(p => 
    p.action === 'read' || 
    (p.resource === 'employees' && p.action === 'update') ||
    (p.resource === 'leaves' && p.action === 'approve')
  );

  for (const permission of managerPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: managerRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log(`✅ ${managerPermissions.length} permissions assignées\n`);

  // 6. Assigner permissions basiques à Employee
  console.log('🔗 Assigning permissions to Employé role...');

  const employeePermissions = createdPermissions.filter(p => 
    p.resource === 'employees' && p.action === 'read'
  );

  for (const permission of employeePermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: employeeRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log(`✅ ${employeePermissions.length} permission(s) assignée(s)\n`);

  // 7. Créer l'utilisateur Admin
  console.log('👤 Creating admin user...');

  // Trouver le premier employé actif
  const adminEmployee = await prisma.employee.findFirst({
    where: { status: 'ACTIVE' },
  });

  if (!adminEmployee) {
    throw new Error('❌ Aucun employé actif trouvé ! Exécutez d\'abord le seed des employés.');
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  // Créer le User (SANS userId - c'est Employee qui a userId)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@sogas.sn',
      username: 'admin',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'SOGAS',
      isActive: true,
    },
  });
  console.log('  ✓ Admin user created:', adminUser.email);

  // Mettre à jour l'employé pour lier au user
  await prisma.employee.update({
    where: { id: adminEmployee.id },
    data: { userId: adminUser.id },
  });
  console.log('  ✓ Employee linked to user');

  // 8. Assigner le rôle Admin
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });
  console.log('  ✓ Administrateur role assigned\n');

  // 9. Créer un utilisateur Manager (optionnel)
  const managerEmployee = await prisma.employee.findFirst({
    where: { 
      status: 'ACTIVE',
      id: { not: adminEmployee.id },
    },
  });

  if (managerEmployee) {
    const managerPassword = await bcrypt.hash('Manager@123', 10);

    // Créer le User (SANS userId)
    const managerUser = await prisma.user.create({
      data: {
        email: managerEmployee.email || `manager@sogas.sn`,
        username: managerEmployee.email?.split('@')[0] || 'manager',
        passwordHash: managerPassword,
        firstName: managerEmployee.firstName,
        lastName: managerEmployee.lastName,
        isActive: true,
      },
    });

    // Lier l'employé au user
    await prisma.employee.update({
      where: { id: managerEmployee.id },
      data: { userId: managerUser.id },
    });

    await prisma.userRole.create({
      data: {
        userId: managerUser.id,
        roleId: managerRole.id,
      },
    });
    console.log('👤 Manager user created:', managerUser.email, '| Password: Manager@123\n');
  }

  // 10. Statistiques finales
  const totalUsers = await prisma.user.count();
  const totalRoles = await prisma.role.count();
  const totalPermissions = await prisma.permission.count();

  console.log('📊 Statistiques finales :');
  console.log(`  - Utilisateurs : ${totalUsers}`);
  console.log(`  - Rôles : ${totalRoles}`);
  console.log(`  - Permissions : ${totalPermissions}`);

  console.log('\n🎉 Authentication Module Seeding Complete!\n');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│  📧 IDENTIFIANTS DE CONNEXION          │');
  console.log('├─────────────────────────────────────────┤');
  console.log('│  Email    : admin@sogas.sn              │');
  console.log('│  Password : Admin@123                   │');
  console.log('└─────────────────────────────────────────┘\n');
}