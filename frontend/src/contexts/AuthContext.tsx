import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginCredentials, AuthContextType } from '@/types/auth.types';
import * as authApi from '@/api/auth.api';

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props du Provider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification pour SOGAS-RH V2.0
 * Gère l'état de connexion, login, logout et persistance
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialisation - Récupération user depuis localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        // Nettoyage en cas d'erreur
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Connexion utilisateur
   * @param credentials - Email et mot de passe
   * @returns Promise<void>
   * Note: La navigation doit être gérée par le composant appelant
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await authApi.login(credentials);

      if (response.success) {
        const { accessToken, refreshToken, user: userData } = response.data;

        // Sauvegarde dans localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Mise à jour de l'état
        setUser(userData);

        // ✅ La navigation sera gérée par le composant LoginPage
      } else {
        throw new Error(response.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Déconnexion utilisateur
   * Note: La navigation doit être gérée par le composant appelant
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Appel API logout
      await authApi.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyage localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Mise à jour de l'état
      setUser(null);
      setIsLoading(false);

      // ✅ La navigation sera gérée par le composant appelant
    }
  };

  /**
   * Rafraîchissement du token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      await authApi.refreshAccessToken();
    } catch (error) {
      console.error('Erreur lors du refresh token:', error);
      
      // En cas d'échec, nettoyage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns AuthContextType
 * @throws Error si utilisé hors du AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  return context;
}