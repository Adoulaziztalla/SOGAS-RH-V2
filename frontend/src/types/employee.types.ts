// Types pour la gestion des employés SOGAS-RH V2.0

export interface Employee {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  adresse: string;
  situationMatrimoniale: string;
  nombreEnfants: number;
  numeroSecuriteSociale?: string;
  
  // Informations professionnelles
  dateEmbauche: string;
  poste: string;
  departement: string;
  service?: string;
  typeContrat: string;
  statut: string;
  salaireBase: number;
  
  // Relations
  managerId?: string;
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  adresse: string;
  situationMatrimoniale: string;
  nombreEnfants: number;
  numeroSecuriteSociale?: string;
  
  dateEmbauche: string;
  poste: string;
  departement: string;
  service?: string;
  typeContrat: string;
  statut: string;
  salaireBase: number;
  managerId?: string;
}

export interface EmployeeListResponse {
  success: boolean;
  data: {
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface EmployeeDetailResponse {
  success: boolean;
  data: {
    employee: Employee;
  };
  message?: string;
}

export interface CreateEmployeeResponse {
  success: boolean;
  data: {
    employee: Employee;
  };
  message?: string;
}

export interface UpdateEmployeeResponse {
  success: boolean;
  data: {
    employee: Employee;
  };
  message?: string;
}

export interface DeleteEmployeeResponse {
  success: boolean;
  message?: string;
}

// Filtres et paramètres de recherche
export interface EmployeeFilters {
  search?: string;
  departement?: string;
  statut?: string;
  typeContrat?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Enums et constantes
export const STATUT_EMPLOYE = {
  ACTIF: 'ACTIF',
  INACTIF: 'INACTIF',
  SUSPENDU: 'SUSPENDU',
  CONGE: 'CONGE',
} as const;

export const TYPE_CONTRAT = {
  CDI: 'CDI',
  CDD: 'CDD',
  STAGE: 'STAGE',
  CONSULTATION: 'CONSULTATION',
} as const;

export const SITUATION_MATRIMONIALE = {
  CELIBATAIRE: 'CELIBATAIRE',
  MARIE: 'MARIE',
  DIVORCE: 'DIVORCE',
  VEUF: 'VEUF',
} as const;

export type StatutEmploye = typeof STATUT_EMPLOYE[keyof typeof STATUT_EMPLOYE];
export type TypeContrat = typeof TYPE_CONTRAT[keyof typeof TYPE_CONTRAT];
export type SituationMatrimoniale = typeof SITUATION_MATRIMONIALE[keyof typeof SITUATION_MATRIMONIALE];