import { Request, Response } from 'express';
import * as employeesService from '../services/employees.service.js';

/**
 * Contrôleur pour la gestion des employés
 */
class EmployeesController {
  /**
   * Récupérer la liste des employés avec filtres et pagination
   */
  async getEmployees(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        status,
        departmentId,
        positionId,
        page = '1',
        limit = '50',
      } = req.query;

      const filters = {
        search: search as string | undefined,
        status: status as string | undefined,
        departmentId: departmentId as string | undefined,
        positionId: positionId as string | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };

      const result = await employeesService.getEmployees(filters);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des employés',
      });
    }
  }

  /**
   * Récupérer un employé par son ID
   */
  async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await employeesService.getEmployeeById(id);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'employé:', error);
      
      if ((error as Error).message === 'Employé non trouvé') {
        res.status(404).json({
          success: false,
          message: 'Employé non trouvé',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'employé',
      });
    }
  }

  /**
   * Créer un nouvel employé
   */
  async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeData = req.body;

      const result = await employeesService.createEmployee(employeeData);

      res.status(201).json(result);
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'employé',
      });
    }
  }

  /**
   * Mettre à jour un employé
   */
  async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const employeeData = req.body;

      const result = await employeesService.updateEmployee(id, employeeData);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      
      if ((error as Error).message === 'Employé non trouvé') {
        res.status(404).json({
          success: false,
          message: 'Employé non trouvé',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'employé',
      });
    }
  }

  /**
   * Supprimer un employé
   */
  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await employeesService.deleteEmployee(id);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'employé',
      });
    }
  }
}

export const employeesController = new EmployeesController();