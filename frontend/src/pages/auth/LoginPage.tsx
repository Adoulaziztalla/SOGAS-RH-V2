import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginCredentials } from '@/types/auth.types';

/**
 * Page de connexion SOGAS-RH V2.0
 */
export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // ✅ Appel de la fonction login
      await login(data);
      
      // ✅ Navigation explicite après login réussi
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setErrorMessage('Email ou mot de passe incorrect. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card principale */}
        <div className="rounded-lg bg-white px-8 py-10 shadow-xl">
          {/* Logo et titre */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-white">
              <span className="text-2xl font-bold">SG</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-secondary-900">
              SOGAS-RH
            </h2>
            <p className="mt-2 text-sm text-secondary-600">
              Système de gestion RH et Paie v2.0
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Message d'erreur global */}
            {errorMessage && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}

            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-700"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide',
                  },
                })}
                className="mt-1 block w-full rounded-md border border-secondary-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="votre.email@sogas.sn"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Le mot de passe est requis',
                  minLength: {
                    value: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères',
                  },
                })}
                className="mt-1 block w-full rounded-md border border-secondary-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Informations de test */}
          <div className="mt-6 rounded-md bg-secondary-50 border border-secondary-200 p-4">
            <p className="text-xs font-medium text-secondary-700">Compte de test :</p>
            <p className="mt-1 text-xs text-secondary-600">
              Email: <span className="font-mono">admin@sogas.sn</span>
            </p>
            <p className="text-xs text-secondary-600">
              Mot de passe: <span className="font-mono">Admin@123</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-secondary-600">
          © 2024 SOGAS - Tous droits réservés
        </p>
      </div>
    </div>
  );
}