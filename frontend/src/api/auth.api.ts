import api from './axios';
import type { LoginCredentials, LoginResponse, RefreshTokenResponse } from '@/types/auth.types';

/**
 * Client API pour l'authentification SOGAS-RH V2.0
 * Toutes les routes passent par le proxy Vite vers http://localhost:3000
 */

/**
 * Connexion utilisateur
 * @param credentials - Email et mot de passe
 * @returns Données utilisateur et tokens JWT
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Déconnexion utilisateur
 * Envoie le refreshToken au backend pour invalidation
 */
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
    
    // Nettoyage du localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    
    // Nettoyage du localStorage même en cas d'erreur
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    throw error;
  }
};

/**
 * Rafraîchissement du token d'accès
 * @returns Nouveau accessToken
 */
export const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }
    
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    
    if (response.data.success) {
      const { accessToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    }
    
    throw new Error('Échec du rafraîchissement du token');
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    
    // Nettoyage en cas d'échec
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    throw error;
  }
};