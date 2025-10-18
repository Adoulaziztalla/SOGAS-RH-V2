import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useEmployee, useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees';

interface EmployeeFormData {
  employeeCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  maidenName?: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
  phone: string;
  phoneSecondary?: string;
  phoneWhatsApp?: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  numberOfChildren: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  nin?: string;
  cniNumber?: string;
  cniExpiry?: string;
  nineaNumber?: string;
  ipmNumber?: string;
  rib?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  hireDate: string;
  status: string;
}

export default function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: employee, isLoading: isLoadingEmployee } = useEmployee(id || '', { enabled: isEditMode });
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    defaultValues: {
      gender: 'MALE',
      maritalStatus: 'Célibataire',
      numberOfChildren: 0,
      nationality: 'Sénégalaise',
      status: 'ACTIVE',
    },
  });

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (isEditMode && employee) {
      reset({
        employeeCode: employee.employeeCode,
        firstName: employee.firstName,
        middleName: employee.middleName || '',
        lastName: employee.lastName,
        maidenName: employee.maidenName || '',
        gender: employee.gender,
        email: employee.email,
        phone: employee.phone,
        phoneSecondary: employee.phoneSecondary || '',
        phoneWhatsApp: employee.phoneWhatsApp || '',
        dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
        nationality: employee.nationality,
        maritalStatus: employee.maritalStatus,
        numberOfChildren: employee.numberOfChildren || 0,
        addressLine1: employee.addressLine1,
        addressLine2: employee.addressLine2 || '',
        city: employee.city,
        region: employee.region,
        postalCode: employee.postalCode,
        nin: employee.nin || '',
        cniNumber: employee.cniNumber || '',
        cniExpiry: employee.cniExpiry ? new Date(employee.cniExpiry).toISOString().split('T')[0] : '',
        nineaNumber: employee.nineaNumber || '',
        ipmNumber: employee.ipmNumber || '',
        rib: employee.rib || '',
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactPhone: employee.emergencyContactPhone || '',
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
        status: employee.status,
      });
    }
  }, [employee, isEditMode, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // Conversion des dates
      const formattedData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
        cniExpiry: data.cniExpiry ? new Date(data.cniExpiry).toISOString() : undefined,
        hireDate: data.hireDate ? new Date(data.hireDate).toISOString() : undefined,
        numberOfChildren: Number(data.numberOfChildren),
      };

      if (isEditMode && id) {
        await updateEmployee.mutateAsync({ id, data: formattedData });
        alert('Employé modifié avec succès !');
      } else {
        await createEmployee.mutateAsync(formattedData);
        alert('Employé créé avec succès !');
      }

      navigate('/employees');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'employé');
    }
  };

  if (isEditMode && isLoadingEmployee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la liste
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Modifier un employé' : 'Ajouter un employé'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Modifiez les informations de l\'employé' : 'Remplissez les informations du nouvel employé'}
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Identité */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Identité</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matricule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matricule <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('employeeCode', { required: 'Le matricule est requis' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="EMP0001"
                />
                {errors.employeeCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.employeeCode.message}</p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('firstName', { required: 'Le prénom est requis' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              {/* Deuxième prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deuxième prénom</label>
                <input
                  type="text"
                  {...register('middleName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Le nom est requis' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              {/* Nom de jeune fille */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de jeune fille</label>
                <input
                  type="text"
                  {...register('maidenName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender', { required: 'Le genre est requis' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MALE">Masculin</option>
                  <option value="FEMALE">Féminin</option>
                </select>
              </div>

              {/* Date de naissance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth', { required: 'La date de naissance est requise' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>

              {/* Nationalité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                <input
                  type="text"
                  {...register('nationality')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Statut matrimonial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut matrimonial</label>
                <select
                  {...register('maritalStatus')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf(ve)">Veuf(ve)</option>
                </select>
              </div>

              {/* Nombre d'enfants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants</label>
                <input
                  type="number"
                  min="0"
                  {...register('numberOfChildren')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Le téléphone est requis' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+221 77 123 45 67"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Téléphone secondaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone secondaire</label>
                <input
                  type="tel"
                  {...register('phoneSecondary')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  {...register('phoneWhatsApp')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Adresse ligne 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse ligne 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('addressLine1', { required: 'L\'adresse est requise' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.addressLine1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                )}
              </div>

              {/* Adresse ligne 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse ligne 2</label>
                <input
                  type="text"
                  {...register('addressLine2')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('city', { required: 'La ville est requise' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* Région */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('region', { required: 'La région est requise' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.region && (
                  <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
                )}
              </div>

              {/* Code postal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('postalCode', { required: 'Le code postal est requis' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section Documents administratifs */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents administratifs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIN</label>
                <input
                  type="text"
                  {...register('nin')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* CNI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro CNI</label>
                <input
                  type="text"
                  {...register('cniNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* CNI Expiration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration CNI</label>
                <input
                  type="date"
                  {...register('cniExpiry')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* NINEA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NINEA</label>
                <input
                  type="text"
                  {...register('nineaNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* IPM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro IPM</label>
                <input
                  type="text"
                  {...register('ipmNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* RIB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RIB</label>
                <input
                  type="text"
                  {...register('rib')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section Contact d'urgence */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact d'urgence</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du contact</label>
                <input
                  type="text"
                  {...register('emergencyContactName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone du contact</label>
                <input
                  type="tel"
                  {...register('emergencyContactPhone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section Emploi */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations d'emploi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date d'embauche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'embauche <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('hireDate', { required: 'La date d\'embauche est requise' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.hireDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.hireDate.message}</p>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">Actif</option>
                  <option value="ONBOARDING">En intégration</option>
                  <option value="SUSPENDED">Suspendu</option>
                  <option value="RESIGNED">Démissionné</option>
                  <option value="TERMINATED">Licencié</option>
                </select>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pb-6">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditMode ? 'Mettre à jour' : 'Créer l\'employé'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}