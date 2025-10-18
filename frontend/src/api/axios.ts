import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Instance Axios configurée pour SOGAS-RH V2.0
// Le proxy Vite redirige /api/* et /auth/* vers http://localhost:3000
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur Request - Ajout du token Authorization
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur Response - Gestion erreurs et refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Erreur 401 - Token expiré
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Pas de refresh token - Redirection vers login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Tentative de refresh du token
        const response = await axios.post('/auth/refresh', {
          refreshToken,
        });

        if (response.data.success) {
          const { accessToken } = response.data.data;
          
          // Sauvegarde du nouveau token
          localStorage.setItem('accessToken', accessToken);
          
          // Mise à jour du header de la requête originale
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          // Rejeu de la requête originale
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Échec du refresh - Déconnexion
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;