import { Users, Briefcase, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Page Dashboard - Vue d'ensemble SOGAS-RH V2.0
 */
export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Employés actifs',
      value: '248',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12 ce mois',
    },
    {
      title: 'Contrats en cours',
      value: '186',
      icon: Briefcase,
      color: 'bg-green-500',
      change: '+8 ce mois',
    },
    {
      title: 'Congés en attente',
      value: '23',
      icon: Calendar,
      color: 'bg-yellow-500',
      change: '5 cette semaine',
    },
    {
      title: 'Masse salariale',
      value: '42.8M',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+3.2% vs mois dernier',
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Bienvenue, {user?.prenom} {user?.nom}
        </h1>
        <p className="mt-1 text-sm text-secondary-600">
          Voici un aperçu de l'activité RH de votre entreprise
        </p>
      </div>

      {/* Statistiques en grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="overflow-hidden rounded-lg bg-white shadow-sm border border-secondary-200 transition-shadow hover:shadow-md"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`rounded-lg p-3 ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-secondary-600">
                        {stat.title}
                      </dt>
                      <dd className="mt-1 flex items-baseline">
                        <div className="text-2xl font-semibold text-secondary-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-secondary-500">{stat.change}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section informations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activités récentes */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Activités récentes
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-green-500" />
              <div>
                <p className="text-secondary-900">
                  Nouvel employé ajouté : <span className="font-medium">Marie Diop</span>
                </p>
                <p className="text-xs text-secondary-500">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500" />
              <div>
                <p className="text-secondary-900">
                  Contrat renouvelé : <span className="font-medium">Amadou Fall</span>
                </p>
                <p className="text-xs text-secondary-500">Il y a 5 heures</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-yellow-500" />
              <div>
                <p className="text-secondary-900">
                  Demande de congé en attente : <span className="font-medium">Fatou Sall</span>
                </p>
                <p className="text-xs text-secondary-500">Hier à 14h30</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Actions rapides
          </h2>
          <div className="mt-4 space-y-3">
            <button className="flex w-full items-center gap-3 rounded-md border border-secondary-200 px-4 py-3 text-left text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50">
              <Users className="h-5 w-5 text-primary-600" />
              <span>Ajouter un employé</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-md border border-secondary-200 px-4 py-3 text-left text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50">
              <Briefcase className="h-5 w-5 text-primary-600" />
              <span>Gérer les contrats</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-md border border-secondary-200 px-4 py-3 text-left text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50">
              <Calendar className="h-5 w-5 text-primary-600" />
              <span>Valider les congés</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}