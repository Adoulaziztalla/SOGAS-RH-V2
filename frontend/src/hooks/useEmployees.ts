import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as employeesApi from '@/api/employees.api';
import type { EmployeeFormData, EmployeeFilters } from '@/types/employee.types';

/**
 * Query keys pour React Query
 */
const QUERY_KEYS = {
  employees: ['employees'] as const,
  employeesList: (filters?: EmployeeFilters) => ['employees', 'list', filters] as const,
  employeeDetail: (id: string) => ['employees', 'detail', id] as const,
};

/**
 * Hook pour récupérer la liste des employés avec filtres
 * @param filters - Filtres optionnels
 */
export function useEmployees(filters?: EmployeeFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.employeesList(filters),
    queryFn: () => employeesApi.getEmployees(filters),
    select: (response) => {
      // ✅ TRANSFORMATION : Mapper les champs anglais → français
      const transformedEmployees = response.data.employees.map((emp: any) => ({
        // Garder tous les champs originaux
        ...emp,
        // Ajouter les champs en français pour compatibilité avec le frontend
        matricule: emp.employeeCode,
        nom: emp.lastName,
        prenom: emp.firstName,
        nomComplet: `${emp.firstName} ${emp.lastName}`,
        telephone: emp.phone,
        email: emp.email,
        // ✅ MODIFICATION : Utiliser les noms des relations au lieu des IDs
        poste: emp.position?.name || 'Non assigné',
        departement: emp.department?.name || 'Non assigné',
        statut: emp.status,
      }));

      return {
        employees: transformedEmployees,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      };
    },
  });
}

/**
 * Hook pour récupérer un employé par son ID
 * @param id - ID de l'employé
 */
export function useEmployee(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.employeeDetail(id),
    queryFn: () => employeesApi.getEmployeeById(id),
    select: (response) => {
      const emp = response.data.employee;
      // Appliquer la même transformation pour un employé individuel
      return {
        ...emp,
        matricule: emp.employeeCode,
        nom: emp.lastName,
        prenom: emp.firstName,
        nomComplet: `${emp.firstName} ${emp.lastName}`,
        telephone: emp.phone,
        email: emp.email,
        // ✅ MODIFICATION : Utiliser les noms des relations
        poste: emp.position?.name || 'Non assigné',
        departement: emp.department?.name || 'Non assigné',
        site: emp.site?.name || 'Non assigné',
        service: emp.service?.name || 'Non assigné',
        equipe: emp.team?.name || 'Non assignée',
        statut: emp.status,
      };
    },
    enabled: !!id,
  });
}

/**
 * Hook pour créer un nouvel employé
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeFormData) => employeesApi.createEmployee(data),
    onSuccess: () => {
      // Invalider toutes les listes d'employés pour forcer le rafraîchissement
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
    },
  });
}

/**
 * Hook pour mettre à jour un employé existant
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeFormData> }) =>
      employeesApi.updateEmployee(id, data),
    onSuccess: (response, variables) => {
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      
      // Invalider le détail de l'employé mis à jour
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employeeDetail(variables.id) });
    },
  });
}

/**
 * Hook pour supprimer un employé
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeesApi.deleteEmployee(id),
    onSuccess: (response, id) => {
      // Invalider toutes les listes d'employés
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      
      // Supprimer l'entrée du détail du cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.employeeDetail(id) });
    },
  });
}