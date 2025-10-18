// ========================================
// VALIDATORS - ORGANIZATION MODULE
// ========================================
// Fichier : src/validators/organization.validator.ts
// Description : Validation des données pour le module Organisation

import { z } from 'zod';

// ========================================
// SITE VALIDATORS
// ========================================

export const createSiteSchema = z.object({
  code: z
    .string()
    .min(1, 'Le code est requis')
    .regex(/^[A-Z]{3}-\d{3}$/, 'Format invalide. Attendu: XXX-XXX (ex: DKR-001)'),
  name: z.string().min(1, 'Le nom est requis').max(255, 'Maximum 255 caractères'),
  description: z.string().max(1000, 'Maximum 1000 caractères').optional(),
  address: z.string().max(500, 'Maximum 500 caractères').optional(),
  city: z.string().max(100, 'Maximum 100 caractères').optional(),
  region: z.string().max(100, 'Maximum 100 caractères').optional(),
  country: z.string().max(100, 'Maximum 100 caractères').optional(),
  phone: z.string().max(20, 'Maximum 20 caractères').optional(),
  email: z.string().email('Email invalide').optional(),
  isActive: z.boolean().optional(),
});

export const updateSiteSchema = z.object({
  code: z
    .string()
    .regex(/^[A-Z]{3}-\d{3}$/, 'Format invalide. Attendu: XXX-XXX (ex: DKR-001)')
    .optional(),
  name: z.string().min(1, 'Le nom ne peut pas être vide').max(255).optional(),
  description: z.string().max(1000).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email('Email invalide').optional(),
  isActive: z.boolean().optional(),
});

// ========================================
// DEPARTMENT VALIDATORS
// ========================================

export const createDepartmentSchema = z.object({
  siteId: z.string().cuid('ID de site invalide').optional(),
  code: z.string().min(1, 'Le code est requis').max(50, 'Maximum 50 caractères'),
  name: z.string().min(1, 'Le nom est requis').max(255, 'Maximum 255 caractères'),
  description: z.string().max(1000, 'Maximum 1000 caractères').optional(),
  managerId: z.string().cuid('ID de manager invalide').optional(),
  isActive: z.boolean().optional(),
});

export const updateDepartmentSchema = z.object({
  siteId: z.string().cuid('ID de site invalide').optional().nullable(),
  code: z.string().min(1, 'Le code ne peut pas être vide').max(50).optional(),
  name: z.string().min(1, 'Le nom ne peut pas être vide').max(255).optional(),
  description: z.string().max(1000).optional(),
  managerId: z.string().cuid('ID de manager invalide').optional().nullable(),
  isActive: z.boolean().optional(),
});

export const changeDepartmentManagerSchema = z.object({
  managerId: z.string().cuid('ID de manager invalide').nullable(),
});

// ========================================
// SERVICE VALIDATORS
// ========================================

export const createServiceSchema = z.object({
  departmentId: z.string().cuid('ID de département invalide'),
  code: z.string().min(1, 'Le code est requis').max(50, 'Maximum 50 caractères'),
  name: z.string().min(1, 'Le nom est requis').max(255, 'Maximum 255 caractères'),
  description: z.string().max(1000, 'Maximum 1000 caractères').optional(),
  managerId: z.string().cuid('ID de manager invalide').optional(),
  isActive: z.boolean().optional(),
});

export const updateServiceSchema = z.object({
  departmentId: z.string().cuid('ID de département invalide').optional(),
  code: z.string().min(1, 'Le code ne peut pas être vide').max(50).optional(),
  name: z.string().min(1, 'Le nom ne peut pas être vide').max(255).optional(),
  description: z.string().max(1000).optional(),
  managerId: z.string().cuid('ID de manager invalide').optional().nullable(),
  isActive: z.boolean().optional(),
});

export const changeServiceManagerSchema = z.object({
  managerId: z.string().cuid('ID de manager invalide').nullable(),
});

// ========================================
// TEAM VALIDATORS
// ========================================

export const createTeamSchema = z.object({
  serviceId: z.string().cuid('ID de service invalide').optional(),
  code: z.string().min(1, 'Le code est requis').max(50, 'Maximum 50 caractères'),
  name: z.string().min(1, 'Le nom est requis').max(255, 'Maximum 255 caractères'),
  description: z.string().max(1000, 'Maximum 1000 caractères').optional(),
  leaderId: z.string().cuid('ID de leader invalide').optional(),
  isActive: z.boolean().optional(),
});

export const updateTeamSchema = z.object({
  serviceId: z.string().cuid('ID de service invalide').optional().nullable(),
  code: z.string().min(1, 'Le code ne peut pas être vide').max(50).optional(),
  name: z.string().min(1, 'Le nom ne peut pas être vide').max(255).optional(),
  description: z.string().max(1000).optional(),
  leaderId: z.string().cuid('ID de leader invalide').optional().nullable(),
  isActive: z.boolean().optional(),
});

export const changeTeamLeaderSchema = z.object({
  leaderId: z.string().cuid('ID de leader invalide').nullable(),
});

export const assignTeamToServiceSchema = z.object({
  serviceId: z.string().cuid('ID de service invalide'),
});

// ========================================
// POSITION VALIDATORS
// ========================================

export const createPositionSchema = z.object({
  code: z
    .string()
    .min(1, 'Le code est requis')
    .regex(/^POS-[A-Z0-9]{3,}$/, 'Format invalide. Attendu: POS-XXX (ex: POS-001, POS-MGR)'),
  title: z.string().min(1, 'Le titre est requis').max(255, 'Maximum 255 caractères'),
  description: z.string().max(1000, 'Maximum 1000 caractères').optional(),
  level: z.string().max(100, 'Maximum 100 caractères').optional(),
  category: z.string().max(100, 'Maximum 100 caractères').optional(),
  isActive: z.boolean().optional(),
});

export const updatePositionSchema = z.object({
  code: z
    .string()
    .regex(/^POS-[A-Z0-9]{3,}$/, 'Format invalide. Attendu: POS-XXX (ex: POS-001, POS-MGR)')
    .optional(),
  title: z.string().min(1, 'Le titre ne peut pas être vide').max(255).optional(),
  description: z.string().max(1000).optional(),
  level: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});

export const bulkCreatePositionsSchema = z.object({
  positions: z
    .array(createPositionSchema)
    .min(1, 'Au moins un poste est requis')
    .max(100, 'Maximum 100 postes à la fois'),
});

// ========================================
// QUERY VALIDATORS
// ========================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export const siteQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
});

export const departmentQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  siteId: z.string().cuid().optional(),
  managerId: z.string().cuid().optional(),
});

export const serviceQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  departmentId: z.string().cuid().optional(),
  managerId: z.string().cuid().optional(),
});

export const teamQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  serviceId: z.string().cuid().optional(),
  leaderId: z.string().cuid().optional(),
});

export const positionQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  level: z.string().optional(),
  category: z.string().optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().min(2, 'Minimum 2 caractères'),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const activeOnlyQuerySchema = z.object({
  activeOnly: z.enum(['true', 'false']).optional().default('true'),
});

// ========================================
// ID VALIDATORS
// ========================================

export const idParamSchema = z.object({
  id: z.string().cuid('ID invalide'),
});

export const codeParamSchema = z.object({
  code: z.string().min(1, 'Code invalide'),
});

// ========================================
// VALIDATION HELPER
// ========================================

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
}