import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Mail, Briefcase, Phone } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';

/**
 * Page de liste des employés SOGAS-RH V2.0
 */
export default function EmployeeListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useEmployees({ search: searchTerm, limit: 50 });

  // États de chargement
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-secondary-600">Chargement des employés...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-900">Erreur de chargement</h3>
        <p className="mt-2 text-sm text-red-700">
          Impossible de charger la liste des employés. Veuillez réessayer.
        </p>
      </div>
    );
  }

  const employees = data?.employees || [];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Employés</h1>
          <p className="mt-1 text-sm text-secondary-600">
            {data?.total || 0} employé{(data?.total || 0) > 1 ? 's' : ''} au total
          </p>
        </div>

        <Link
          to="/employees/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un employé</span>
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Rechercher un employé (nom, prénom, matricule...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-secondary-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Tableau des employés */}
      {employees.length === 0 ? (
        <div className="rounded-lg border border-secondary-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100">
            <Briefcase className="h-6 w-6 text-secondary-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-secondary-900">
            Aucun employé trouvé
          </h3>
          <p className="mt-2 text-sm text-secondary-600">
            {searchTerm
              ? 'Aucun résultat ne correspond à votre recherche.'
              : 'Commencez par ajouter votre premier employé.'}
          </p>
          {!searchTerm && (
            <Link
              to="/employees/new"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un employé</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-secondary-200 bg-white shadow-sm">
          {/* Version Desktop - Tableau */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-700">
                    Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-700">
                    Nom complet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-700">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-700">
                    Poste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-700">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-700">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-secondary-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 bg-white">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-secondary-900">
                      {employee.matricule}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {employee.prenom} {employee.nom}
                        </div>
                        <div className="text-sm text-secondary-500">{employee.email}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Phone className="h-4 w-4" />
                        <span>{employee.telephone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-900">
                      {employee.poste}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-900">
                      {employee.departement}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          employee.statut === 'ACTIF'
                            ? 'bg-green-100 text-green-800'
                            : employee.statut === 'INACTIF'
                            ? 'bg-red-100 text-red-800'
                            : employee.statut === 'SUSPENDU'
                            ? 'bg-orange-100 text-orange-800'
                            : employee.statut === 'CONGE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {employee.statut}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link
                        to={`/employees/${employee.id}`}
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        Voir détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Version Mobile - Cards */}
          <div className="lg:hidden divide-y divide-secondary-200">
            {employees.map((employee) => (
              <Link
                key={employee.id}
                to={`/employees/${employee.id}`}
                className="block p-4 hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-secondary-900">
                        {employee.prenom} {employee.nom}
                      </h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          employee.statut === 'ACTIF'
                            ? 'bg-green-100 text-green-800'
                            : employee.statut === 'INACTIF'
                            ? 'bg-red-100 text-red-800'
                            : employee.statut === 'SUSPENDU'
                            ? 'bg-orange-100 text-orange-800'
                            : employee.statut === 'CONGE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {employee.statut}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-500 mb-2">
                      Matricule: {employee.matricule}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-secondary-600">
                        <Briefcase className="h-3 w-3" />
                        <span>{employee.poste} • {employee.departement}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-secondary-600">
                        <Mail className="h-3 w-3" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-secondary-600">
                        <Phone className="h-3 w-3" />
                        <span>{employee.telephone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}