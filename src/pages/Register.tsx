import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Gamepad2, Phone, MapPin, Gift } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    referralCode: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(null);
  
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWarning('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est requis');
      setLoading(false);
      return;
    }
    
    try {
      // Préparer les données pour l'API backend
      const apiPayload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        username: formData.username,
        referralCode: formData.referralCode || undefined
      };

      // Envoyer la requête à l'API backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();

      // Gérer les différents statuts de réponse
      if (data.status === 'success') {
        setSuccess(data.message || 'Inscription réussie avec succès !');
        
        // Extraire les données utilisateur et compte de la réponse
        const { user, account } = data.data;
        
        // Créer l'utilisateur localement avec les données du backend
        const success = await register(
          user.email || formData.email, 
          formData.password, 
          user.name || formData.name, 
          'player',
          user.phone || formData.phone,
          user.country || formData.country,
          user.referralCode || formData.referralCode
        );
        
        if (success) {
          // Attendre un peu pour que l'utilisateur voie le message de succès
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setError('Erreur lors de la création du compte local');
        }
      } else if (data.status === 'error') {
        setError(data.message || 'Erreur lors de la création du compte');
      } else if (data.status === 'warning') {
        setWarning(data.message || 'Avertissement lors de l\'inscription');
        
        // En cas d'avertissement, on peut quand même procéder si des données sont fournies
        if (data.data && data.data.user) {
          const { user, account } = data.data;
          
          const success = await register(
            user.email || formData.email, 
            formData.password, 
            user.name || formData.name, 
            'player',
            user.phone || formData.phone,
            user.country || formData.country,
            user.referralCode || formData.referralCode
          );
          
          if (success) {
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          }
        }
      } else {
        // Statut inconnu
        setError('Réponse inattendue du serveur');
      }
    } catch (err) {
      console.error('Erreur API:', err);
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setFormData({
      ...formData,
      referralCode: code,
    });

    // Validation du code de parrainage (simulation)
    if (code.length > 0) {
      // Simuler la validation du code
      setTimeout(() => {
        // Codes valides pour la démo
        const validCodes = ['ASHERGAME2025', 'WELCOME50', 'BONUS100', 'FRIEND20'];
        setReferralCodeValid(validCodes.includes(code.toUpperCase()));
      }, 500);
    } else {
      setReferralCodeValid(null);
    }
  };

  const countries = [
    { code: 'FR', name: 'France' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'CA', name: 'Canada' },
    { code: 'MA', name: 'Maroc' },
    { code: 'TN', name: 'Tunisie' },
    { code: 'DZ', name: 'Algérie' },
    { code: 'SN', name: 'Sénégal' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'CM', name: 'Cameroun' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-4">
      <div className="card w-full max-w-2xl bg-base-200 shadow-2xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary">Inscription</h1>
            <p className="text-base-content/70 mt-2">Créez votre compte Ashergame</p>
          </div>

          {/* Messages d'état */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {warning && (
            <div className="alert alert-warning mb-4">
              <span>{warning}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nom complet</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    className="input input-bordered w-full pl-10"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nom d'utilisateur</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    placeholder="Votre nom d'utilisateur"
                    className="input input-bordered w-full pl-10"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Numéro de téléphone</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+33 6 12 34 56 78"
                    className="input input-bordered w-full pl-10"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Pays</span>
                </label>
                <div className="relative">
                  <select
                    name="country"
                    className="select select-bordered w-full pl-10"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionner un pays</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Code de parrainage</span>
                <span className="label-text-alt text-base-content/50">(Optionnel)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="referralCode"
                  placeholder="Entrez votre code de parrainage"
                  className={`input input-bordered w-full pl-10 pr-10 ${
                    referralCodeValid === true ? 'input-success' : 
                    referralCodeValid === false ? 'input-error' : ''
                  }`}
                  value={formData.referralCode}
                  onChange={handleReferralCodeChange}
                />
                <Gift className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                {referralCodeValid === true && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-success">
                    ✓
                  </div>
                )}
                {referralCodeValid === false && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-error">
                    ✗
                  </div>
                )}
              </div>
              {referralCodeValid === true && (
                <label className="label">
                  <span className="label-text-alt text-success">✓ Code de parrainage valide ! Vous recevrez un bonus à l'inscription.</span>
                </label>
              )}
              {referralCodeValid === false && (
                <label className="label">
                  <span className="label-text-alt text-error">✗ Code de parrainage invalide</span>
                </label>
              )}
              {formData.referralCode.length === 0 && (
                <label className="label">
                  <span className="label-text-alt text-info">💡 Utilisez un code de parrainage pour obtenir des bonus !</span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Mot de passe</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10"
                    value={formData.password}
                    onChange={handleInputChange}
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Confirmer le mot de passe</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bonus Information */}
            {referralCodeValid === true && (
              <div className="alert alert-success">
                <Gift className="w-5 h-5" />
                <div>
                  <h4 className="font-bold">Bonus de parrainage activé !</h4>
                  <div className="text-sm">
                    • Bonus d'inscription : +500 coins
                    • Votre parrain recevra 20% de votre premier dépôt
                  </div>
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label cursor-pointer justify-start">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" required />
                <span className="label-text ml-2">
                  J'accepte les{' '}
                  <Link to="/terms" className="link link-primary">
                    conditions d'utilisation
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="divider">ou</div>

          <div className="text-center">
            <p className="text-base-content/70">
              Déjà un compte ?{' '}
              <Link to="/login" className="link link-primary font-medium">
                Se connecter
              </Link>
            </p>
          </div>

          {/* Referral Info */}
          <div className="card bg-base-300 mt-4">
            <div className="card-body p-4">
              <h4 className="font-bold text-sm mb-2">💡 Codes de parrainage de démonstration :</h4>
              <div className="text-xs space-y-1 text-base-content/70">
                <div>• <code className="bg-base-100 px-2 py-1 rounded">ASHERGAME2025</code> - Bonus standard</div>
                <div>• <code className="bg-base-100 px-2 py-1 rounded">WELCOME50</code> - Bonus de bienvenue</div>
                <div>• <code className="bg-base-100 px-2 py-1 rounded">BONUS100</code> - Bonus premium</div>
                <div>• <code className="bg-base-100 px-2 py-1 rounded">FRIEND20</code> - Bonus ami</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
