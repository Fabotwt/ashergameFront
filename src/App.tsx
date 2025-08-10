import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: string[] }> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-100 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
                <ProtectedRoute roles={['player']}>
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;