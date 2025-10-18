import { Router } from 'express';
import { employeesController } from '../controllers/employees.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

/**
 * Construit et retourne le router des routes employés
 */
export function buildEmployeesRoutes(): Router {
  const router = Router();

  // Toutes les routes employés nécessitent l'authentification
  router.use(requireAuth);

  /**
   * @route   GET /api/employees
   * @desc    Récupérer la liste des employés
   * @access  Private
   */
  router.get('/', employeesController.getEmployees.bind(employeesController));

  /**
   * @route   GET /api/employees/:id
   * @desc    Récupérer un employé par son ID
   * @access  Private
   */
  router.get('/:id', employeesController.getEmployeeById.bind(employeesController));

  /**
   * @route   POST /api/employees
   * @desc    Créer un nouvel employé
   * @access  Private
   */
  router.post('/', employeesController.createEmployee.bind(employeesController));

  /**
   * @route   PUT /api/employees/:id
   * @desc    Mettre à jour un employé
   * @access  Private
   */
  router.put('/:id', employeesController.updateEmployee.bind(employeesController));

  /**
   * @route   DELETE /api/employees/:id
   * @desc    Supprimer un employé
   * @access  Private
   */
  router.delete('/:id', employeesController.deleteEmployee.bind(employeesController));

  return router;
}