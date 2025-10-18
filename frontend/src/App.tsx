import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages d'authentification
import LoginPage from './pages/auth/LoginPage';

// Pages du dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Pages employés
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import EmployeeFormPage from './pages/employees/EmployeeFormPage';

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />

            {/* Routes protégées avec layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Employés - ORDRE CRUCIAL pour éviter les conflits de routing */}
                <Route path="/employees/new" element={<EmployeeFormPage />} />
                <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                <Route path="/employees" element={<EmployeeListPage />} />

                {/* Redirection par défaut */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>

            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;