// ========================================
// SEEDS - ORGANIZATION MODULE
// ========================================
// Fichier : prisma/seeds/organization.seed.ts
// Description : Données par défaut pour le module Organisation

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedOrganization() {
  console.log('🌱 Seeding Organization Module...');

  // ========================================
  // 1. SITES (ÉTABLISSEMENTS)
  // ========================================
  console.log('📍 Creating Sites...');

  const sites = await Promise.all([
    prisma.site.upsert({
      where: { code: 'DKR-001' },
      update: {},
      create: {
        code: 'DKR-001',
        name: 'Siège Social Dakar',
        description: 'Siège social principal de l\'entreprise',
        address: 'Avenue Cheikh Anta Diop',
        city: 'Dakar',
        region: 'Dakar',
        country: 'Sénégal',
        phone: '+221 33 123 45 67',
        email: 'siege@entreprise.sn',
        isActive: true,
      },
    }),
    prisma.site.upsert({
      where: { code: 'THS-001' },
      update: {},
      create: {
        code: 'THS-001',
        name: 'Agence Thiès',
        description: 'Agence régionale de Thiès',
        address: 'Route de Dakar',
        city: 'Thiès',
        region: 'Thiès',
        country: 'Sénégal',
        phone: '+221 33 951 12 34',
        email: 'thies@entreprise.sn',
        isActive: true,
      },
    }),
    prisma.site.upsert({
      where: { code: 'STL-001' },
      update: {},
      create: {
        code: 'STL-001',
        name: 'Centre Saint-Louis',
        description: 'Centre opérationnel de Saint-Louis',
        address: 'Quartier Nord',
        city: 'Saint-Louis',
        region: 'Saint-Louis',
        country: 'Sénégal',
        phone: '+221 33 961 23 45',
        email: 'stlouis@entreprise.sn',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${sites.length} sites créés`);

  // ========================================
  // 2. DEPARTMENTS (DÉPARTEMENTS)
  // ========================================
  console.log('📁 Creating Departments...');

  const departments = await Promise.all([
    // Siège Dakar
    prisma.department.upsert({
      where: { code: 'DIR-GEN' },
      update: {},
      create: {
        siteId: sites[0].id,
        code: 'DIR-GEN',
        name: 'Direction Générale',
        description: 'Direction générale de l\'entreprise',
        isActive: true,
      },
    }),
    prisma.department.upsert({
      where: { code: 'RH-DKR' },
      update: {},
      create: {
        siteId: sites[0].id,
        code: 'RH-DKR',
        name: 'Ressources Humaines',
        description: 'Département RH - Siège',
        isActive: true,
      },
    }),
    prisma.department.upsert({
      where: { code: 'FIN-DKR' },
      update: {},
      create: {
        siteId: sites[0].id,
        code: 'FIN-DKR',
        name: 'Finance et Comptabilité',
        description: 'Département Finance - Siège',
        isActive: true,
      },
    }),
    prisma.department.upsert({
      where: { code: 'IT-DKR' },
      update: {},
      create: {
        siteId: sites[0].id,
        code: 'IT-DKR',
        name: 'Informatique',
        description: 'Département IT - Siège',
        isActive: true,
      },
    }),
    // Agence Thiès
    prisma.department.upsert({
      where: { code: 'OPS-THS' },
      update: {},
      create: {
        siteId: sites[1].id,
        code: 'OPS-THS',
        name: 'Opérations Thiès',
        description: 'Département opérationnel - Thiès',
        isActive: true,
      },
    }),
    // Saint-Louis
    prisma.department.upsert({
      where: { code: 'OPS-STL' },
      update: {},
      create: {
        siteId: sites[2].id,
        code: 'OPS-STL',
        name: 'Opérations Saint-Louis',
        description: 'Département opérationnel - Saint-Louis',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${departments.length} départements créés`);

  // ========================================
  // 3. SERVICES
  // ========================================
  console.log('🔧 Creating Services...');

  const services = await Promise.all([
    // RH Services
    prisma.service.upsert({
      where: { code: 'RH-REC' },
      update: {},
      create: {
        departmentId: departments[1].id,
        code: 'RH-REC',
        name: 'Recrutement',
        description: 'Service recrutement et intégration',
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { code: 'RH-PAY' },
      update: {},
      create: {
        departmentId: departments[1].id,
        code: 'RH-PAY',
        name: 'Paie et Administration',
        description: 'Service paie et administration du personnel',
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { code: 'RH-FOR' },
      update: {},
      create: {
        departmentId: departments[1].id,
        code: 'RH-FOR',
        name: 'Formation',
        description: 'Service formation et développement',
        isActive: true,
      },
    }),
    // Finance Services
    prisma.service.upsert({
      where: { code: 'FIN-CPT' },
      update: {},
      create: {
        departmentId: departments[2].id,
        code: 'FIN-CPT',
        name: 'Comptabilité',
        description: 'Service comptabilité générale',
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { code: 'FIN-TRE' },
      update: {},
      create: {
        departmentId: departments[2].id,
        code: 'FIN-TRE',
        name: 'Trésorerie',
        description: 'Service trésorerie et cash management',
        isActive: true,
      },
    }),
    // IT Services
    prisma.service.upsert({
      where: { code: 'IT-DEV' },
      update: {},
      create: {
        departmentId: departments[3].id,
        code: 'IT-DEV',
        name: 'Développement',
        description: 'Service développement logiciel',
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { code: 'IT-SUP' },
      update: {},
      create: {
        departmentId: departments[3].id,
        code: 'IT-SUP',
        name: 'Support Technique',
        description: 'Service support et maintenance',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${services.length} services créés`);

  // ========================================
  // 4. TEAMS (ÉQUIPES)
  // ========================================
  console.log('👥 Creating Teams...');

  const teams = await Promise.all([
    // IT Dev Teams
    prisma.team.upsert({
      where: { code: 'DEV-FE' },
      update: {},
      create: {
        serviceId: services[5].id,
        code: 'DEV-FE',
        name: 'Frontend Team',
        description: 'Équipe développement frontend',
        isActive: true,
      },
    }),
    prisma.team.upsert({
      where: { code: 'DEV-BE' },
      update: {},
      create: {
        serviceId: services[5].id,
        code: 'DEV-BE',
        name: 'Backend Team',
        description: 'Équipe développement backend',
        isActive: true,
      },
    }),
    prisma.team.upsert({
      where: { code: 'DEV-QA' },
      update: {},
      create: {
        serviceId: services[5].id,
        code: 'DEV-QA',
        name: 'Quality Assurance',
        description: 'Équipe qualité et tests',
        isActive: true,
      },
    }),
    // Support Team
    prisma.team.upsert({
      where: { code: 'SUP-L1' },
      update: {},
      create: {
        serviceId: services[6].id,
        code: 'SUP-L1',
        name: 'Support Niveau 1',
        description: 'Équipe support premier niveau',
        isActive: true,
      },
    }),
    // Équipe transversale (sans service)
    prisma.team.upsert({
      where: { code: 'PROJ-ALPHA' },
      update: {},
      create: {
        serviceId: null,
        code: 'PROJ-ALPHA',
        name: 'Projet Alpha',
        description: 'Équipe projet transversale',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${teams.length} équipes créées`);

  // ========================================
  // 5. POSITIONS (POSTES/FONCTIONS)
  // ========================================
  console.log('💼 Creating Positions...');

  const positions = await Promise.all([
    // Management
    prisma.position.upsert({
      where: { code: 'POS-DG' },
      update: {},
      create: {
        code: 'POS-DG',
        title: 'Directeur Général',
        description: 'Direction générale de l\'entreprise',
        level: 'Direction',
        category: 'Cadre Supérieur',
        isActive: true,
      },
    }),
    prisma.position.upsert({
      where: { code: 'POS-MGR' },
      update: {},
      create: {
        code: 'POS-MGR',
        title: 'Manager',
        description: 'Responsable d\'équipe ou de service',
        level: 'Management',
        category: 'Cadre',
        isActive: true,
      },
    }),
    // RH
    prisma.position.upsert({
      where: { code: 'POS-DRH' },
      update: {},
      create: {
        code: 'POS-DRH',
        title: 'Directeur des Ressources Humaines',
        description: 'Direction du département RH',
        level: 'Direction',
        category: 'Cadre Supérieur',
        isActive: true,
      },
    }),
    prisma.position.upsert({
      where: { code: 'POS-RRH' },
      update: {},
      create: {
        code: 'POS-RRH',
        title: 'Responsable RH',
        description: 'Gestion des ressources humaines',
        level: 'Management',
        category: 'Cadre',
        isActive: true,
      },
    }),
    prisma.position.upsert({
      where: { code: 'POS-CHG' },
      update: {},
      create: {
        code: 'POS-CHG',
        title: 'Chargé RH',
        description: 'Assistant ressources humaines',
        level: 'Exécution',
        category: 'Agent de Maîtrise',
        isActive: true,
      },
    }),
    // IT
    prisma.position.upsert({
      where: { code: 'POS-CTO' },
      update: {},
      create: {
        code: 'POS-CTO',
        title: 'Directeur Technique',
        description: 'Direction technique et IT',
        level: 'Direction',
        category: 'Cadre Supérieur',
        isActive: true,
      },
    }),
    prisma.position.upsert({
      where: { code: 'POS-DEV' },
      update: {},
      create: {
        code: 'POS-DEV',
        title: 'Développeur',
        description: 'Développeur logiciel',
        level: 'Exécution',
        category: 'Cadre',
        isActive: true,
      },
    }),
    prisma.position.upsert({
      where: { code: 'POS-SRD' },
      update: {},
      create: {
        code: 'POS-SRD',
        title: 'Développeur Senior',
        description: 'Développeur confirmé',
        level: 'Senior',
        category: 'Cadre',
        isActive: true,
      },
    }),
    prisma.position.upsert({
      where: { code: 'POS-TLD' },
      update: {},
      create: {
        code: 'POS-TLD',
        title: 'Tech Lead',
        description: 'Responsable technique d\'équipe',
        level: 'Management',
        category: 'Cadre',
        isActive: true,
      },
    }),
    // Finance
    prisma.position.upsert({
      where: { code: 'POS-DAF' },
      update: {},
      create: {
        code: 'POS-DAF',
        title: 'Directeur Administratif et Financier',
        description: 'Direction administrative et financière',
        level: 'Direction',
        category: 'Cadre Supérieur',
        isActive: true,
      },
    }),
    prisma.position.upsert({
      where: { code: 'POS-CPT' },
      update: {},
      create: {
        code: 'POS-CPT',
        title: 'Comptable',
        description: 'Gestionnaire comptable',
        level: 'Exécution',
        category: 'Agent de Maîtrise',
        isActive: true,
      },
    }),
    // Support
    prisma.position.upsert({
      where: { code: 'POS-SUP' },
      update: {},
      create: {
        code: 'POS-SUP',
        title: 'Technicien Support',
        description: 'Support technique informatique',
        level: 'Exécution',
        category: 'Employé',
        isActive: true,
      },
    }),
    // Autres
    prisma.position.upsert({
      where: { code: 'POS-AST' },
      update: {},
      create: {
        code: 'POS-AST',
        title: 'Assistant',
        description: 'Assistant administratif',
        level: 'Exécution',
        category: 'Employé',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${positions.length} postes créés`);

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n✅ Organization Module Seeding Complete!');
  console.log(`   📍 ${sites.length} Sites`);
  console.log(`   📁 ${departments.length} Departments`);
  console.log(`   🔧 ${services.length} Services`);
  console.log(`   👥 ${teams.length} Teams`);
  console.log(`   💼 ${positions.length} Positions`);
  console.log('');
}