// ==========================================
// RÔLES DU SYSTÈME
// ==========================================
export const ROLES = {
  ADMIN_TECH: 'ADMIN_TECH',
  ADMIN_RH: 'ADMIN_RH',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  CONSULTANT: 'CONSULTANT',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ==========================================
// PERMISSIONS DU SYSTÈME
// ==========================================
export const PERMISSIONS = {
  // Gestion des utilisateurs
  USER_CREATE: 'USER_CREATE',
  USER_READ: 'USER_READ',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  USER_MANAGE_ROLES: 'USER_MANAGE_ROLES',

  // Gestion des employés
  EMPLOYEE_CREATE: 'EMPLOYEE_CREATE',
  EMPLOYEE_READ: 'EMPLOYEE_READ',
  EMPLOYEE_UPDATE: 'EMPLOYEE_UPDATE',
  EMPLOYEE_DELETE: 'EMPLOYEE_DELETE',
  EMPLOYEE_EXPORT: 'EMPLOYEE_EXPORT',

  // Gestion des contrats
  CONTRACT_CREATE: 'CONTRACT_CREATE',
  CONTRACT_READ: 'CONTRACT_READ',
  CONTRACT_UPDATE: 'CONTRACT_UPDATE',
  CONTRACT_DELETE: 'CONTRACT_DELETE',
  CONTRACT_APPROVE: 'CONTRACT_APPROVE',

  // Gestion des absences
  ABSENCE_CREATE: 'ABSENCE_CREATE',
  ABSENCE_READ: 'ABSENCE_READ',
  ABSENCE_UPDATE: 'ABSENCE_UPDATE',
  ABSENCE_DELETE: 'ABSENCE_DELETE',
  ABSENCE_APPROVE: 'ABSENCE_APPROVE',
  ABSENCE_REJECT: 'ABSENCE_REJECT',

  // Gestion des présences
  ATTENDANCE_CREATE: 'ATTENDANCE_CREATE',
  ATTENDANCE_READ: 'ATTENDANCE_READ',
  ATTENDANCE_UPDATE: 'ATTENDANCE_UPDATE',
  ATTENDANCE_DELETE: 'ATTENDANCE_DELETE',
  ATTENDANCE_EXPORT: 'ATTENDANCE_EXPORT',

  // Gestion de la paie
  PAYROLL_CREATE: 'PAYROLL_CREATE',
  PAYROLL_READ: 'PAYROLL_READ',
  PAYROLL_UPDATE: 'PAYROLL_UPDATE',
  PAYROLL_DELETE: 'PAYROLL_DELETE',
  PAYROLL_PROCESS: 'PAYROLL_PROCESS',
  PAYROLL_EXPORT: 'PAYROLL_EXPORT',

  // Gestion des documents
  DOCUMENT_CREATE: 'DOCUMENT_CREATE',
  DOCUMENT_READ: 'DOCUMENT_READ',
  DOCUMENT_UPDATE: 'DOCUMENT_UPDATE',
  DOCUMENT_DELETE: 'DOCUMENT_DELETE',
  DOCUMENT_DOWNLOAD: 'DOCUMENT_DOWNLOAD',

  // Gestion des départements
  DEPARTMENT_CREATE: 'DEPARTMENT_CREATE',
  DEPARTMENT_READ: 'DEPARTMENT_READ',
  DEPARTMENT_UPDATE: 'DEPARTMENT_UPDATE',
  DEPARTMENT_DELETE: 'DEPARTMENT_DELETE',

  // Gestion des postes
  POSITION_CREATE: 'POSITION_CREATE',
  POSITION_READ: 'POSITION_READ',
  POSITION_UPDATE: 'POSITION_UPDATE',
  POSITION_DELETE: 'POSITION_DELETE',

  // Administration système
  SYSTEM_CONFIG: 'SYSTEM_CONFIG',
  SYSTEM_BACKUP: 'SYSTEM_BACKUP',
  SYSTEM_LOGS: 'SYSTEM_LOGS',
  SYSTEM_AUDIT: 'SYSTEM_AUDIT',

  // Rapports et statistiques
  REPORT_VIEW: 'REPORT_VIEW',
  REPORT_EXPORT: 'REPORT_EXPORT',
  ANALYTICS_VIEW: 'ANALYTICS_VIEW',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ==========================================
// INTERFACES JWT
// ==========================================
export interface JwtPayload {
  userId: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ==========================================
// HELPERS DE VÉRIFICATION
// ==========================================
export function hasRole(userRoles: Role[], requiredRole: Role): boolean {
  return userRoles.includes(requiredRole);
}

export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyRole(userRoles: Role[], requiredRoles: Role[]): boolean {
  return requiredRoles.some((role) => userRoles.includes(role));
}

export function hasAllRoles(userRoles: Role[], requiredRoles: Role[]): boolean {
  return requiredRoles.every((role) => userRoles.includes(role));
}

export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
}