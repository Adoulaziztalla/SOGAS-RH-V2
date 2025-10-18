import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface EmployeeFilters {
  search?: string;
  status?: string;
  departmentId?: string;
  positionId?: string;
  page?: number;
  limit?: number;
}

/**
 * Récupère la liste des employés avec filtres et pagination
 */
export async function getEmployees(filters: EmployeeFilters = {}) {
  const {
    search,
    status,
    departmentId,
    positionId,
    page = 1,
    limit = 50,
  } = filters;

  const skip = (page - 1) * limit;

  // Construction des conditions de recherche
  const where: Prisma.EmployeeWhereInput = {
    ...(status && { status }),
    ...(departmentId && { departmentId }),
    ...(positionId && { positionId }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeCode: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  // ✅ Requête avec include optionnel (vérifie si les tables existent)
  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      // Note: Décommentez ces lignes quand les tables Position et Department seront créées
      // include: {
      //   position: {
      //     select: {
      //       id: true,
      //       name: true,
      //     },
      //   },
      //   department: {
      //     select: {
      //       id: true,
      //       name: true,
      //     },
      //   },
      // },
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    success: true,
    data: {
      employees,
      total,
      page,
      limit,
    },
  };
}

/**
 * Récupère un employé par son ID
 */
export async function getEmployeeById(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    // Note: Décommentez ces lignes quand les tables seront créées
    // include: {
    //   position: true,
    //   department: true,
    //   site: true,
    //   service: true,
    //   team: true,
    // },
  });

  if (!employee) {
    throw new Error('Employé non trouvé');
  }

  return {
    success: true,
    data: {
      employee,
    },
  };
}

/**
 * Crée un nouvel employé
 */
export async function createEmployee(data: Prisma.EmployeeCreateInput) {
  const employee = await prisma.employee.create({
    data,
  });

  return {
    success: true,
    data: {
      employee,
    },
  };
}

/**
 * Met à jour un employé existant
 */
export async function updateEmployee(
  id: string,
  data: Prisma.EmployeeUpdateInput
) {
  const employee = await prisma.employee.update({
    where: { id },
    data,
  });

  return {
    success: true,
    data: {
      employee,
    },
  };
}

/**
 * Supprime un employé (soft delete)
 */
export async function deleteEmployee(id: string) {
  const employee = await prisma.employee.update({
    where: { id },
    data: {
      isActive: false,
      status: 'TERMINATED',
    },
  });

  return {
    success: true,
    data: {
      employee,
    },
  };
}

/**
 * Supprime définitivement un employé (hard delete)
 */
export async function hardDeleteEmployee(id: string) {
  await prisma.employee.delete({
    where: { id },
  });

  return {
    success: true,
    message: 'Employé supprimé définitivement',
  };
}