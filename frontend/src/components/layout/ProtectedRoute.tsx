import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Composant de protection des routes
 * Vérifie l'authentification avant d'afficher le contenu
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Affichage du loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-secondary-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirection vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Affichage des routes enfants via Outlet
  return <Outlet />;
}