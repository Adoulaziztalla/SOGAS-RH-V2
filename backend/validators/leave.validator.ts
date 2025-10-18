// ============================================
// VALIDATORS - MODULE CONGÉS
// ============================================
// Fichier : backend/src/validators/leave.validator.ts
// ============================================

import { Request, Response, NextFunction } from 'express';

// ============================================
// HELPER : Validation des erreurs
// ============================================

interface ValidationError {
  field: string;
  message: string;
}

const sendValidationError = (res: Response, errors: ValidationError[]) => {
  return res.status(400).json({
    success: false,
    error: 'Erreur de validation',
    errors
  });
};

// ============================================
// VALIDATORS - LEAVE TYPE
// ============================================

export const validateCreateLeaveType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: ValidationError[] = [];
  const { name, code, isPaid, requiresApproval, maxDaysPerRequest, color } = req.body;

  // Validation : name obligatoire
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Le nom est obligatoire' });
  } else if (name.length > 100) {
    errors.push({ field: 'name', message: 'Le nom ne peut pas dépasser 100 caractères' });
  }

  // Validation : code obligatoire et format
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    errors.push({ field: 'code', message: 'Le code est obligatoire' });
  } else if (!/^[A-Z_]+$/.test(code)) {
    errors.push({
      field: 'code',
      message: 'Le code doit contenir uniquement des lettres majuscules et underscores'
    });
  } else if (code.length > 50) {
    errors.push({ field: 'code', message: 'Le code ne peut pas dépasser 50 caractères' });
  }

  // Validation : isPaid (optionnel, boolean)
  if (isPaid !== undefined && typeof isPaid !== 'boolean') {
    errors.push({ field: 'isPaid', message: 'isPaid doit être un booléen' });
  }

  // Validation : requiresApproval (optionnel, boolean)
  if (requiresApproval !== undefined && typeof requiresApproval !== 'boolean') {
    errors.push({
      field: 'requiresApproval',
      message: 'requiresApproval doit être un booléen'
    });
  }

  // Validation : maxDaysPerRequest (optionnel, number positif)
  if (maxDaysPerRequest !== undefined) {
    if (typeof maxDaysPerRequest !== 'number' || maxDaysPerRequest <= 0) {
      errors.push({
        field: 'maxDaysPerRequest',
        message: 'maxDaysPerRequest doit être un nombre positif'
      });
    }
  }

  // Validation : color (optionnel, format hex)
  if (color !== undefined && color !== null) {
    if (typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      errors.push({
        field: 'color',
        message: 'La couleur doit être au format hexadécimal (#RRGGBB)'
      });
    }
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  next();
};

export const validateUpdateLeaveType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: ValidationError[] = [];
  const { name, code, isPaid, requiresApproval, maxDaysPerRequest, color } = req.body;

  // Validation : au moins un champ doit être fourni
  if (
    name === undefined &&
    code === undefined &&
    isPaid === undefined &&
    requiresApproval === undefined &&
    maxDaysPerRequest === undefined &&
    color === undefined
  ) {
    errors.push({
      field: 'general',
      message: 'Au moins un champ doit être fourni pour la mise à jour'
    });
  }

  // Si name fourni, valider
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Le nom ne peut pas être vide' });
    } else if (name.length > 100) {
      errors.push({ field: 'name', message: 'Le nom ne peut pas dépasser 100 caractères' });
    }
  }

  // Si code fourni, valider
  if (code !== undefined) {
    if (typeof code !== 'string' || code.trim().length === 0) {
      errors.push({ field: 'code', message: 'Le code ne peut pas être vide' });
    } else if (!/^[A-Z_]+$/.test(code)) {
      errors.push({
        field: 'code',
        message: 'Le code doit contenir uniquement des lettres majuscules et underscores'
      });
    }
  }

  // Autres validations similaires au create...
  if (isPaid !== undefined && typeof isPaid !== 'boolean') {
    errors.push({ field: 'isPaid', message: 'isPaid doit être un booléen' });
  }

  if (requiresApproval !== undefined && typeof requiresApproval !== 'boolean') {
    errors.push({
      field: 'requiresApproval',
      message: 'requiresApproval doit être un booléen'
    });
  }

  if (maxDaysPerRequest !== undefined && maxDaysPerRequest <= 0) {
    errors.push({
      field: 'maxDaysPerRequest',
      message: 'maxDaysPerRequest doit être un nombre positif'
    });
  }

  if (color !== undefined && color !== null && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    errors.push({
      field: 'color',
      message: 'La couleur doit être au format hexadécimal (#RRGGBB)'
    });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  next();
};

// ============================================
// VALIDATORS - LEAVE BALANCE
// ============================================

export const validateCreateLeaveBalance = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: ValidationError[] = [];
  const { employeeId, leaveTypeId, year, totalDays } = req.body;

  // Validation : employeeId obligatoire
  if (!employeeId || typeof employeeId !== 'string') {
    errors.push({ field: 'employeeId', message: 'employeeId est obligatoire' });
  }

  // Validation : leaveTypeId obligatoire
  if (!leaveTypeId || typeof leaveTypeId !== 'string') {
    errors.push({ field: 'leaveTypeId', message: 'leaveTypeId est obligatoire' });
  }

  // Validation : year obligatoire et valide
  if (!year || typeof year !== 'number') {
    errors.push({ field: 'year', message: 'year est obligatoire et doit être un nombre' });
  } else {
    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 10) {
      errors.push({
        field: 'year',
        message: `L'année doit être entre 2000 et ${currentYear + 10}`
      });
    }
  }

  // Validation : totalDays obligatoire et positif
  if (totalDays === undefined || totalDays === null) {
    errors.push({ field: 'totalDays', message: 'totalDays est obligatoire' });
  } else if (typeof totalDays !== 'number' || totalDays < 0) {
    errors.push({ field: 'totalDays', message: 'totalDays doit être un nombre positif' });
  } else if (totalDays > 365) {
    errors.push({
      field: 'totalDays',
      message: 'totalDays ne peut pas dépasser 365 jours'
    });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  next();
};

export const validateInitializeBalances = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: ValidationError[] = [];
  const { employeeId, year, balances } = req.body;

  // Validation : employeeId obligatoire
  if (!employeeId || typeof employeeId !== 'string') {
    errors.push({ field: 'employeeId', message: 'employeeId est obligatoire' });
  }

  // Validation : year obligatoire
  if (!year || typeof year !== 'number') {
    errors.push({ field: 'year', message: 'year est obligatoire' });
  }

  // Validation : balances obligatoire et tableau
  if (!balances || !Array.isArray(balances) || balances.length === 0) {
    errors.push({
      field: 'balances',
      message: 'balances est obligatoire et doit être un tableau non vide'
    });
  } else {
    // Valider chaque balance
    balances.forEach((balance, index) => {
      if (!balance.leaveTypeId) {
        errors.push({
          field: `balances[${index}].leaveTypeId`,
          message: 'leaveTypeId est obligatoire'
        });
      }
      if (balance.totalDays === undefined || balance.totalDays < 0) {
        errors.push({
          field: `balances[${index}].totalDays`,
          message: 'totalDays doit être un nombre positif'
        });
      }
    });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  next();
};

// ============================================
// VALIDATORS - LEAVE REQUEST
// ============================================

export const validateCreateLeaveRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: ValidationError[] = [];
  const { employeeId, leaveTypeId, startDate, endDate, reason } = req.body;

  // Validation : employeeId obligatoire
  if (!employeeId || typeof employeeId !== 'string') {
    errors.push({ field: 'employeeId', message: 'employeeId est obligatoire' });
  }

  // Validation : leaveTypeId obligatoire
  if (!leaveTypeId || typeof leaveTypeId !== 'string') {
    errors.push({ field: 'leaveTypeId', message: 'leaveTypeId est obligatoire' });
  }

  // Validation : startDate obligatoire et format date
  if (!startDate) {
    errors.push({ field: 'startDate', message: 'startDate est obligatoire' });
  } else {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      errors.push({ field: 'startDate', message: 'startDate doit être une date valide' });
    }
  }

  // Validation : endDate obligatoire et format date
  if (!endDate) {
    errors.push({ field: 'endDate', message: 'endDate est obligatoire' });
  } else {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      errors.push({ field: 'endDate', message: 'endDate doit être une date valide' });
    }
  }

  // Validation : startDate < endDate
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      if (start > end) {
        errors.push({
          field: 'dates',
          message: 'La date de début doit être antérieure à la date de fin'
        });
      }
    }
  }

  // Validation : reason (optionnel, string)
  if (reason !== undefined && typeof reason !== 'string') {
    errors.push({ field: 'reason', message: 'reason doit être une chaîne de caractères' });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  next();
};

export const validateUpdateLeaveRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: ValidationError[] = [];
  const { startDate, endDate, reason } = req.body;

  // Validation : au moins un champ doit être fourni
  if (startDate === undefined && endDate === undefined && reason === undefined) {
    errors.push({
      field: 'general',
      message: 'Au moins un champ doit être fourni pour la mise à jour'
    });
  }

  // Si startDate fourni, valider
  if (startDate !== undefined) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      errors.push({ field: 'startDate', message: 'startDate doit être une date valide' });
    }
  }

  // Si endDate fourni, valider
  if (endDate !== undefined) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      errors.push({ field: 'endDate', message: 'endDate doit être une date valide' });
    }
  }

  // Si les deux dates sont fournies, valider la cohérence
  if (startDate !== undefined && endDate !== undefined) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      if (start > end) {
        errors.push({
          field: 'dates',
          message: 'La date de début doit être antérieure à la date de fin'
        });
      }
    }
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  next();
};

export const validateApproveReject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: ValidationError[] = [];
  const { reviewNotes } = req.body;

  // reviewNotes optionnel pour approbation, mais si fourni doit être string
  if (reviewNotes !== undefined && typeof reviewNotes !== 'string') {
    errors.push({
      field: 'reviewNotes',
      message: 'reviewNotes doit être une chaîne de caractères'
    });
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  next();
};