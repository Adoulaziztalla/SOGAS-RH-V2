// Types pour l'authentification SOGAS-RH V2.0

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  message?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}