// backend/prisma/seed.ts
import { PrismaClient, Gender, EmployeeStatus } from '@prisma/client';
import { seedOrganization } from './seeds/organization.seed';
import { seedAuth } from './seeds/auth.seed';

const prisma = new PrismaClient();

// ============================================
// HELPERS
// ============================================

function generateValidNIN(dateOfBirth: Date, gender: Gender): string {
  const year = dateOfBirth.getFullYear();
  const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0');
  const day = String(dateOfBirth.getDate()).padStart(2, '0');
  
  const firstDigit = gender === 'FEMALE' ? 
    [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)] : 
    [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)];
  
  const randomDigits = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
  return `${year}${month}${day}${firstDigit}${randomDigits}`;
}

function generateBirthDate(): Date {
  const today = new Date();
  const minAge = 18;
  const maxAge = 65;
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  
  const birthYear = today.getFullYear() - age;
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1;
  
  return new Date(birthYear, birthMonth, birthDay);
}

function generateHireDate(dateOfBirth: Date): Date {
  const minYearsAfterBirth = 18;
  const maxYearsAfterBirth = 40;
  
  const yearsToAdd = Math.floor(Math.random() * (maxYearsAfterBirth - minYearsAfterBirth)) + minYearsAfterBirth;
  const hireDate = new Date(dateOfBirth);
  hireDate.setFullYear(hireDate.getFullYear() + yearsToAdd);
  
  const today = new Date();
  if (hireDate > today) {
    hireDate.setFullYear(today.getFullYear() - 1);
  }
  
  return hireDate;
}

function generateRIB(): string {
  const randomDigits = Array.from({ length: 20 }, () => 
    Math.floor(Math.random() * 10)
  ).join('');
  return `SN08${randomDigits}`;
}

function generateCNI(): string {
  // Format CNI sénégalais : 1 2 YYYY XXXXX (13 chiffres)
  const year = 1980 + Math.floor(Math.random() * 30);
  const randomDigits = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `12${year}${randomDigits}`;
}

function generateNINEA(): string {
  // Format NINEA : 7 chiffres
  return String(Math.floor(1000000 + Math.random() * 9000000));
}

function generateIPM(): string {
  // Format IPM : 9 chiffres
  return String(Math.floor(100000000 + Math.random() * 900000000));
}

// ============================================
// DONNÉES DE RÉFÉRENCE
// ============================================

const PRENOMS_MASCULINS = [
  'Mamadou', 'Moussa', 'Ibrahima', 'Abdoulaye', 'Cheikh', 
  'Omar', 'Ousmane', 'Amadou', 'Modou', 'Alioune',
  'Babacar', 'Samba', 'Pape', 'Youssou', 'Momar'
];

const PRENOMS_FEMININS = [
  'Fatou', 'Aïssatou', 'Mariama', 'Aminata', 'Ndèye',
  'Awa', 'Khady', 'Coumba', 'Sokhna', 'Binta',
  'Astou', 'Maimouna', 'Rokhaya', 'Yacine', 'Seynabou'
];

const NOMS_FAMILLE = [
  'Diop', 'Ndiaye', 'Fall', 'Sow', 'Sy', 'Ba', 'Diallo', 'Kane',
  'Sarr', 'Thiam', 'Gueye', 'Diouf', 'Mbaye', 'Faye', 'Ndour',
  'Cissé', 'Seck', 'Touré', 'Dieng', 'Samb'
];

const VILLES_SENEGAL = [
  'Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès',
  'Mbour', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Touba'
];

const QUARTIERS = [
  'Plateau', 'Médina', 'Fann', 'Mermoz', 'Sacré-Cœur',
  'Ouakam', 'Almadies', 'Point E', 'HLM', 'Liberté',
  'Dieuppeul', 'Grand Yoff', 'Parcelles Assainies'
];

const REGIONS = [
  'Dakar', 'Thiès', 'Diourbel', 'Fatick', 'Kaolack',
  'Saint-Louis', 'Louga', 'Tambacounda', 'Kolda', 'Ziguinchor'
];

const STATUTS_MATRIMONIAUX = [
  'Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)'
];

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🌱 Démarrage du seed SOGAS-RH V2.0 (Enrichi)\n');

  // Nettoyage
  console.log('🧹 Nettoyage des employés existants...');
  await prisma.employee.deleteMany({});
  console.log('✅ Nettoyage terminé\n');

  const employeesData = [];

  // Génération de 20 employés
  for (let i = 0; i < 20; i++) {
    const gender: Gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
    const firstName = gender === 'MALE' ? 
      PRENOMS_MASCULINS[Math.floor(Math.random() * PRENOMS_MASCULINS.length)] :
      PRENOMS_FEMININS[Math.floor(Math.random() * PRENOMS_FEMININS.length)];
    const lastName = NOMS_FAMILLE[Math.floor(Math.random() * NOMS_FAMILLE.length)];
    
    const dateOfBirth = generateBirthDate();
    const hireDate = generateHireDate(dateOfBirth);
    const nin = generateValidNIN(dateOfBirth, gender);
    
    // CNI expiration : 5-10 ans après aujourd'hui
    const cniExpiry = new Date();
    cniExpiry.setFullYear(cniExpiry.getFullYear() + 5 + Math.floor(Math.random() * 5));
    
    const statusRandom = Math.random();
    let status: EmployeeStatus = 'ACTIVE';
    if (statusRandom > 0.9) status = 'ONBOARDING';
    else if (statusRandom > 0.85) status = 'SUSPENDED';
    else if (statusRandom > 0.8) status = 'RESIGNED';
    
    const city = VILLES_SENEGAL[Math.floor(Math.random() * VILLES_SENEGAL.length)];
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const quartier = QUARTIERS[Math.floor(Math.random() * QUARTIERS.length)];
    
    const prenom1 = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nom1 = lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    employeesData.push({
      // Code employé
      employeeCode: `EMP${String(i + 1).padStart(4, '0')}`,
      
      // Identité
      firstName,
      lastName,
      middleName: Math.random() > 0.7 ? PRENOMS_MASCULINS[Math.floor(Math.random() * 5)] : null,
      maidenName: gender === 'FEMALE' && Math.random() > 0.6 ? NOMS_FAMILLE[Math.floor(Math.random() * NOMS_FAMILLE.length)] : null,
      gender,
      
      // Contacts
      email: `${prenom1}.${nom1}@sogas.sn`,
      phone: `+221 77 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}`,
      phoneSecondary: Math.random() > 0.5 ? `+221 78 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}` : null,
      phoneWhatsApp: `+221 77 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}`,
      
      // Données civiles
      nin,
      cniNumber: generateCNI(),
      cniExpiry,
      nineaNumber: Math.random() > 0.7 ? generateNINEA() : null,
      ipmNumber: generateIPM(),
      nationality: 'Sénégalaise',
      maritalStatus: STATUTS_MATRIMONIAUX[Math.floor(Math.random() * STATUTS_MATRIMONIAUX.length)],
      numberOfChildren: Math.floor(Math.random() * 5),
      dependentsCount: Math.floor(Math.random() * 3),
      
      // Adresse
      addressLine1: `${Math.floor(Math.random() * 500) + 1} ${quartier}`,
      addressLine2: Math.random() > 0.6 ? `Appartement ${Math.floor(Math.random() * 20) + 1}` : null,
      city,
      region,
      country: 'Sénégal',
      postalCode: `${Math.floor(10000 + Math.random() * 90000)}`,
      
      // Contacts d'urgence
      emergencyContactName: `${PRENOMS_MASCULINS[Math.floor(Math.random() * 5)]} ${NOMS_FAMILLE[Math.floor(Math.random() * 5)]}`,
      emergencyContactPhone: `+221 78 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}`,
      
      // Bancaire
      rib: generateRIB(),
      
      // Dates
      dateOfBirth,
      hireDate,
      
      // Profil
      profilePicture: Math.random() > 0.7 ? `/uploads/profiles/${prenom1}_${nom1}.jpg` : null,
      
      // Statut
      status,
      isActive: status === 'ACTIVE' || status === 'ONBOARDING',
    });
  }

  console.log('📝 Création des employés enrichis...\n');
  let createdCount = 0;

  for (const employeeData of employeesData) {
    try {
      await prisma.employee.create({
        data: employeeData,
      });
      createdCount++;
      console.log(`  ✓ ${employeeData.firstName} ${employeeData.lastName} (${employeeData.employeeCode}) - CNI: ${employeeData.cniNumber}`);
    } catch (error: any) {
      console.error(`  ✗ Erreur pour ${employeeData.firstName} ${employeeData.lastName}:`, error.message);
    }
  }

  console.log(`\n✅ Seed terminé : ${createdCount}/20 employés créés`);
  
  const stats = await prisma.employee.groupBy({
    by: ['status'],
    _count: true,
  });
  
  console.log('\n📊 Statistiques par statut :');
  stats.forEach(stat => {
    console.log(`  - ${stat.status}: ${stat._count} employé(s)`);
  });

  const total = await prisma.employee.count();
  console.log(`\n📈 Total employés en base : ${total}`);
  
  // Seed Organisation
  await seedOrganization();
  
  // ✨ Seed Authentication (Users, Roles, Permissions)
  await seedAuth();
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });