import api from './axios';
import type {
  Employee,
  EmployeeFormData,
  EmployeeListResponse,
  EmployeeDetailResponse,
  CreateEmployeeResponse,
  UpdateEmployeeResponse,
  DeleteEmployeeResponse,
  EmployeeFilters,
} from '@/types/employee.types';

/**
 * Client API pour la gestion des employés SOGAS-RH V2.0
 * Toutes les routes passent par le proxy Vite vers http://localhost:3000
 */

/**
 * Récupère la liste des employés avec filtres optionnels
 * @param filters - Paramètres de filtrage et pagination
 * @returns Liste paginée d'employés
 */
export const getEmployees = async (filters?: EmployeeFilters): Promise<EmployeeListResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.departement) params.append('departement', filters.departement);
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.typeContrat) params.append('typeContrat', filters.typeContrat);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const response = await api.get<EmployeeListResponse>(
      `/api/employees${params.toString() ? `?${params.toString()}` : ''}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    throw error;
  }
};

/**
 * Récupère un employé par son ID
 * @param id - ID de l'employé
 * @returns Détails de l'employé
 */
export const getEmployeeById = async (id: string): Promise<EmployeeDetailResponse> => {
  try {
    const response = await api.get<EmployeeDetailResponse>(`/api/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'employé ${id}:`, error);
    throw error;
  }
};

/**
 * Crée un nouvel employé
 * @param data - Données du nouvel employé
 * @returns Employé créé
 */
export const createEmployee = async (data: EmployeeFormData): Promise<CreateEmployeeResponse> => {
  try {
    const response = await api.post<CreateEmployeeResponse>('/api/employees', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    throw error;
  }
};

/**
 * Met à jour un employé existant
 * @param id - ID de l'employé
 * @param data - Données à mettre à jour
 * @returns Employé mis à jour
 */
export const updateEmployee = async (
  id: string,
  data: Partial<EmployeeFormData>
): Promise<UpdateEmployeeResponse> => {
  try {
    const response = await api.put<UpdateEmployeeResponse>(`/api/employees/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'employé ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un employé
 * @param id - ID de l'employé à supprimer
 * @returns Confirmation de suppression
 */
export const deleteEmployee = async (id: string): Promise<DeleteEmployeeResponse> => {
  try {
    const response = await api.delete<DeleteEmployeeResponse>(`/api/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'employé ${id}:`, error);
    throw error;
  }
};