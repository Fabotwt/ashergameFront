import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Transactions } from './pages/Transactions';
import { Affiliates } from './pages/Affiliates';
import { DirectRecharge } from './pages/DirectRecharge';
import { Withdrawal } from './pages/Withdrawal';
import { AdminUsers } from './pages/AdminUsers';
import { Settings } from './pages/Settings';
import { AdminGames } from './pages/AdminGames';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Games } from './pages/Games';
import { GameDetail } from './pages/GameDetail';
import { Toaster, toast } from 'react-hot-toast';

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: string[] }> = ({ children, roles }) => {
  const { isAuthenticated, user, isLoadingAuth } = useAuthStore();
  
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <h2 className="text-xl font-semibold mt-4">Chargement de l'authentification...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuthStore();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AuthRedirector: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user && user.enabled === false) {
      toast.error('Votre compte a été désactivé. Veuillez contacter le support.', { duration: 6000 });
      logout();
      navigate('/login');
    }
  }, [user, isAuthenticated, logout, navigate]);

  return null; // This component does not render anything
}

function App() {
  return (
    <Router>
      <AuthRedirector />
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            border: '1px solid #4b4b4b',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 5000,
          },
        }}
      />
      <div className="min-h-screen bg-base-100 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />

            {/* Public routes that are always accessible */}
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetail />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/affiliates" 
              element={
                <ProtectedRoute roles={['player']}>
                  <Affiliates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recharge" 
              element={
                <ProtectedRoute roles={['player', 'cashier']}>
                  <DirectRecharge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/withdrawal" 
              element={
                <ProtectedRoute roles={['player']}>
                  <Withdrawal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/games" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminGames />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
