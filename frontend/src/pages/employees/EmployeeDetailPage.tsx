import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee, useDeleteEmployee } from '@/hooks/useEmployees';
import { useState } from 'react';

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'infos' | 'documents' | 'contrats' | 'historique'>('infos');
  
  const { data: employee, isLoading, error } = useEmployee(id || '');
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = async () => {
    if (!id) return;
    
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'employé ${employee?.nomComplet} ?`
    );
    
    if (confirmed) {
      try {
        await deleteEmployee.mutateAsync(id);
        navigate('/employees');
      } catch (err) {
        alert('Erreur lors de la suppression de l\'employé');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-600">Employé non trouvé</p>
          <button
            onClick={() => navigate('/employees')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{employee.nomComplet}</h1>
              <p className="text-gray-600 mt-1">{employee.matricule}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/employees/${id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
              
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-6">
              {/* Photo de profil */}
              <div className="flex-shrink-0">
                {employee.profilePicture ? (
                  <img
                    src={employee.profilePicture}
                    alt={employee.nomComplet}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-gray-200">
                    <span className="text-4xl font-bold text-blue-600">
                      {employee.prenom?.[0]}{employee.nom?.[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Poste</p>
                  <p className="font-semibold text-gray-900">{employee.poste}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Département</p>
                  <p className="font-semibold text-gray-900">{employee.departement}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Statut</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.statut === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    employee.statut === 'ONBOARDING' ? 'bg-blue-100 text-blue-800' :
                    employee.statut === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {employee.statut}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date d'embauche</p>
                  <p className="font-semibold text-gray-900">
                    {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('infos')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'infos'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Informations personnelles
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('contrats')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'contrats'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Contrats
              </button>
              <button
                onClick={() => setActiveTab('historique')}
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'historique'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Historique
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'infos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Identité */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Identité</h3>
                  <div className="space-y-3">
                    <InfoRow label="Prénom" value={employee.firstName} />
                    <InfoRow label="Nom" value={employee.lastName} />
                    <InfoRow label="Nom de jeune fille" value={employee.maidenName} />
                    <InfoRow label="Genre" value={employee.gender === 'MALE' ? 'Masculin' : 'Féminin'} />
                    <InfoRow label="Date de naissance" value={employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A'} />
                    <InfoRow label="Nationalité" value={employee.nationality} />
                    <InfoRow label="Statut matrimonial" value={employee.maritalStatus} />
                    <InfoRow label="Nombre d'enfants" value={employee.numberOfChildren} />
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                  <div className="space-y-3">
                    <InfoRow label="Email" value={employee.email} />
                    <InfoRow label="Téléphone" value={employee.phone} />
                    <InfoRow label="Téléphone secondaire" value={employee.phoneSecondary} />
                    <InfoRow label="WhatsApp" value={employee.phoneWhatsApp} />
                    <InfoRow label="Adresse ligne 1" value={employee.addressLine1} />
                    <InfoRow label="Adresse ligne 2" value={employee.addressLine2} />
                    <InfoRow label="Ville" value={employee.city} />
                    <InfoRow label="Région" value={employee.region} />
                    <InfoRow label="Code postal" value={employee.postalCode} />
                  </div>
                </div>

                {/* Documents administratifs */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents administratifs</h3>
                  <div className="space-y-3">
                    <InfoRow label="NIN" value={employee.nin} />
                    <InfoRow label="Numéro CNI" value={employee.cniNumber} />
                    <InfoRow label="Expiration CNI" value={employee.cniExpiry ? new Date(employee.cniExpiry).toLocaleDateString('fr-FR') : 'N/A'} />
                    <InfoRow label="NINEA" value={employee.nineaNumber} />
                    <InfoRow label="IPM" value={employee.ipmNumber} />
                    <InfoRow label="RIB" value={employee.rib} />
                  </div>
                </div>

                {/* Contact d'urgence */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact d'urgence</h3>
                  <div className="space-y-3">
                    <InfoRow label="Nom" value={employee.emergencyContactName} />
                    <InfoRow label="Téléphone" value={employee.emergencyContactPhone} />
                  </div>
                </div>

                {/* Organisation */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Organisation</h3>
                  <div className="space-y-3">
                    <InfoRow label="Site" value={employee.site} />
                    <InfoRow label="Département" value={employee.departement} />
                    <InfoRow label="Service" value={employee.service} />
                    <InfoRow label="Équipe" value={employee.equipe} />
                    <InfoRow label="Poste" value={employee.poste} />
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates importantes</h3>
                  <div className="space-y-3">
                    <InfoRow label="Date d'embauche" value={employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('fr-FR') : 'N/A'} />
                    <InfoRow label="Créé le" value={employee.createdAt ? new Date(employee.createdAt).toLocaleDateString('fr-FR') : 'N/A'} />
                    <InfoRow label="Modifié le" value={employee.updatedAt ? new Date(employee.updatedAt).toLocaleDateString('fr-FR') : 'N/A'} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents</h3>
                <p className="text-gray-600">Cette section sera disponible prochainement</p>
              </div>
            )}

            {activeTab === 'contrats' && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contrats</h3>
                <p className="text-gray-600">Cette section sera disponible prochainement</p>
              </div>
            )}

            {activeTab === 'historique' && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Historique</h3>
                <p className="text-gray-600">Cette section sera disponible prochainement</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant helper pour afficher une ligne d'information
function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">
        {value || 'N/A'}
      </span>
    </div>
  );
}