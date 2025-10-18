import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';

/**
 * Layout principal de l'application SOGAS-RH V2.0
 * Contient la sidebar, le header et la zone de contenu
 */
export default function MainLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-secondary-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile - Overlay */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-secondary-900/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-secondary-200 bg-white px-4 shadow-sm lg:px-6">
          {/* Bouton menu mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-secondary-600 hover:bg-secondary-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Titre - caché sur mobile */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-secondary-900">
              SOGAS-RH V2.0
            </h1>
          </div>

          {/* User info et logout */}
          <div className="flex items-center gap-4">
            {/* Info utilisateur */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <p className="font-medium text-secondary-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-secondary-500">{user?.role}</p>
              </div>
            </div>

            {/* Bouton logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md bg-secondary-100 px-3 py-2 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Zone de contenu avec scroll */}
        <main className="flex-1 overflow-y-auto bg-secondary-50 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}