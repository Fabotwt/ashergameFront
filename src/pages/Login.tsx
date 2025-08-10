import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Gamepad2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Envoyer la requête à l'API backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      // Gestion du succès
      if (data.status === 'success') {
        // Stocker le token d'authentification avec structure complète
        const { token } = data.data;
        localStorage.setItem('authToken', token.token);
        localStorage.setItem('tokenType', token.type);
        
        // Optionnel: stocker les autres propriétés du token si nécessaire
        if (token.abilities) {
          localStorage.setItem('tokenAbilities', JSON.stringify(token.abilities));
        }
        if (token.expiresAt) {
          localStorage.setItem('tokenExpiresAt', token.expiresAt);
        }
        
        // Connexion locale avec le store
        const success = await login(email, password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Erreur lors de la connexion locale');
        }
      } 
      // Gestion des erreurs avec le format { errors: [{ message: "..." }] }
      else if (data.errors && Array.isArray(data.errors)) {
        // Extraire le premier message d'erreur
        const errorMessage = data.errors[0]?.message || 'Erreur de connexion';
        setError(errorMessage);
      }
      // Gestion du format d'erreur alternatif { status: 'error', message: '...' }
      else if (data.status === 'error') {
        setError(data.message || 'Erreur de connexion');
      }
      // Format de réponse inattendu
      else {
        setError('Réponse inattendue du serveur');
      }
    } catch (err) {
      console.error('Erreur API:', err);
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-4">
      <div className="card w-full max-w-md bg-base-200 shadow-2xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary">Connexion</h1>
            <p className="text-base-content/70 mt-2">Connectez-vous à votre compte Ashergame</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="input input-bordered w-full pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mot de passe</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="label cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                <span className="label-text ml-2">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="link link-primary text-sm">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="divider">ou</div>

          <div className="text-center">
            <p className="text-base-content/70">
              Pas encore de compte ?{' '}
              <Link to="/register" className="link link-primary font-medium">
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-base-300 rounded-lg">
            <p className="text-sm font-medium mb-2">Comptes de démonstration :</p>
            <div className="text-xs space-y-1 text-base-content/70">
              <p><strong>Admin:</strong> admin@ashergame.com</p>
              <p><strong>Caissier:</strong> cashier@ashergame.com</p>
              <p><strong>Joueur:</strong> player@ashergame.com</p>
              <p className="text-primary">Mot de passe: n'importe lequel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
