import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  onClose?: () => void;
}

/**
 * Sidebar de navigation pour SOGAS-RH V2.0
 * Affiche le menu principal de l'application
 */
export default function Sidebar({ onClose }: SidebarProps) {
  const menuItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Tableau de bord',
    },
    {
      to: '/employees',
      icon: Users,
      label: 'Employés',
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-secondary-200 shadow-sm">
      {/* Header avec logo et bouton fermer (mobile) */}
      <div className="flex h-16 items-center justify-between border-b border-secondary-200 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white font-bold text-sm">
            SG
          </div>
          <div>
            <h2 className="text-sm font-semibold text-secondary-900">SOGAS-RH</h2>
            <p className="text-xs text-secondary-500">v2.0</p>
          </div>
        </div>

        {/* Bouton fermer pour mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-secondary-500 hover:bg-secondary-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'h-5 w-5 flex-shrink-0',
                        isActive ? 'text-primary-600' : 'text-secondary-500'
                      )}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-secondary-200 p-4">
        <p className="text-xs text-center text-secondary-500">
          © 2024 SOGAS
        </p>
      </div>
    </div>
  );
}