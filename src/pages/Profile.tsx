import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Coins, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  History,
  Settings,
  Hash,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser, fetchCurrentUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    username: user?.username || '',
  });

  // Récupérer les données utilisateur au chargement
  useEffect(() => {
    if (!user) {
      fetchCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Mettre à jour le formulaire quand les données utilisateur changent
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        username: user.username || '',
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      country: user.country || '',
      username: user.username || '',
    });
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'badge-error';
      case 'cashier': return 'badge-secondary';
      default: return 'badge-accent';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'cashier': return 'Caissier';
      default: return 'Joueur';
    }
  };

  const getCountryFlag = (countryCode?: string) => {
    const flags: { [key: string]: string } = {
      'FR': '🇫🇷',
      'BE': '🇧🇪',
      'CH': '🇨🇭',
      'CA': '🇨🇦',
      'MA': '🇲🇦',
      'TN': '🇹🇳',
      'DZ': '🇩🇿',
      'SN': '🇸🇳',
      'CI': '🇨🇮'
    };
    return flags[countryCode || ''] || '🌍';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
            <p className="text-base-content/70">Gérez vos informations personnelles et paramètres de compte</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-base-content/70 mb-2">{user.email}</p>
                  {user.username && (
                    <p className="text-accent font-mono mb-4">@{user.username}</p>
                  )}
                  
                  <div className={`badge ${getRoleBadgeColor(user.role)} badge-lg mb-4`}>
                    <Shield className="w-4 h-4 mr-1" />
                    {getRoleLabel(user.role)}
                  </div>

                  {/* Account Status */}
                  <div className="mb-4">
                    {user.enabled ? (
                      <div className="badge badge-success gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Compte Activé
                      </div>
                    ) : (
                      <div className="badge badge-warning gap-2">
                        <XCircle className="w-3 h-3" />
                        En attente d'activation
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="stats stats-vertical shadow w-full">
                    <div className="stat">
                      <div className="stat-figure text-primary">
                        <Coins className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Solde</div>
                      <div className="stat-value text-primary">{user.coins.toLocaleString()}</div>
                      <div className="stat-desc">coins disponibles</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-figure text-secondary">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="stat-title">Membre depuis</div>
                      <div className="stat-value text-secondary text-sm">
                        {user.createdAt ? formatDate(user.createdAt).split(' ')[0] : 'Jan 2025'}
                      </div>
                      <div className="stat-desc">
                        {user.createdAt ? 'Date d\'inscription' : 'Nouveau membre'}
                      </div>
                    </div>
                  </div>

                  {/* Account IDs */}
                  {(user.accountId || user.accountNumber) && (
                    <div className="mt-4 space-y-2">
                      {user.accountId && (
                        <div className="text-sm">
                          <span className="text-base-content/70">ID Compte: </span>
                          <span className="font-mono text-secondary">{user.accountId}</span>
                        </div>
                      )}
                      {user.accountNumber && (
                        <div className="text-sm">
                          <span className="text-base-content/70">N° Compte: </span>
                          <span className="font-mono text-accent">{user.accountNumber}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="card-title">
                      <User className="w-6 h-6" />
                      Informations Personnelles
                    </h3>
                    {!isEditing ? (
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={handleSave}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </button>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={handleCancel}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Nom complet</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="input input-bordered"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                          <User className="w-5 h-5 text-base-content/50" />
                          <span>{user.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Email</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          className="input input-bordered"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                          <Mail className="w-5 h-5 text-base-content/50" />
                          <span>{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Nom d'utilisateur</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="input input-bordered"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          placeholder="pixe"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                          <User className="w-5 h-5 text-base-content/50" />
                          <span className="font-mono text-accent">
                            {user.username ? `@${user.username}` : 'Non renseigné'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Téléphone</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="input input-bordered"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+33 6 12 34 56 78"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                          <Phone className="w-5 h-5 text-base-content/50" />
                          <span>{user.phone || 'Non renseigné'}</span>
                        </div>
                      )}
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Pays</span>
                      </label>
                      {isEditing ? (
                        <select
                          className="select select-bordered"
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                        >
                          <option value="">Sélectionner un pays</option>
                          <option value="FR">🇫🇷 France</option>
                          <option value="BE">🇧🇪 Belgique</option>
                          <option value="CH">🇨🇭 Suisse</option>
                          <option value="CA">🇨🇦 Canada</option>
                          <option value="MA">🇲🇦 Maroc</option>
                          <option value="TN">🇹🇳 Tunisie</option>
                          <option value="DZ">🇩🇿 Algérie</option>
                          <option value="SN">🇸🇳 Sénégal</option>
                          <option value="CI">🇨🇮 Côte d'Ivoire</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-base-content/50" />
                          <span className="flex items-center gap-2">
                            {getCountryFlag(user.country)}
                            {user.country || 'Non renseigné'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title mb-6">
                    <Hash className="w-6 h-6" />
                    Informations du Compte
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.accountId && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">ID de Compte</span>
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                          <Hash className="w-5 h-5 text-base-content/50" />
                          <span className="font-mono text-secondary">{user.accountId}</span>
                          <button
                            className="btn btn-xs btn-outline ml-auto"
                            onClick={() => navigator.clipboard.writeText(user.accountId!.toString())}
                          >
                            Copier
                          </button>
                        </div>
                      </div>
                    )}

                    {user.accountNumber && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Numéro de Compte</span>
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                          <Hash className="w-5 h-5 text-base-content/50" />
                          <span className="font-mono text-accent">{user.accountNumber}</span>
                          <button
                            className="btn btn-xs btn-outline ml-auto"
                            onClick={() => navigator.clipboard.writeText(user.accountNumber!.toString())}
                          >
                            Copier
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Rôle</span>
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                        <Shield className="w-5 h-5 text-base-content/50" />
                        <div className={`badge ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </div>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Statut du Compte</span>
                      </label>
                      <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                        {user.enabled ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-success" />
                            <div className="badge badge-success">Activé</div>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-warning" />
                            <div className="badge badge-warning">En attente</div>
                          </>
                        )}
                      </div>
                    </div>

                    {user.createdAt && (
                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text font-medium">Date d'inscription</span>
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-base-content/50" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              {/* <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title mb-6">
                    <Settings className="w-6 h-6" />
                    Paramètres du Compte
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Notifications par email</span>
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                      </label>
                    </div>
                    
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Notifications de transactions</span>
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                      </label>
                    </div>
                    
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Authentification à deux facteurs</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                      </label>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="flex gap-4">
                    <button className="btn btn-outline">
                      Changer le mot de passe
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => fetchCurrentUser()}
                    >
                      Actualiser les données
                    </button>
                    <button className="btn btn-error btn-outline">
                      Supprimer le compte
                    </button>
                  </div>
                </div>
              </div> */}

              {/* Recent Activity */}
              {/* <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title mb-6">
                    <History className="w-6 h-6" />
                    Activité Récente
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
                      <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                        <Coins className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Recharge USDT</p>
                        <p className="text-sm text-base-content/70">Il y a 2 heures</p>
                      </div>
                      <div className="text-success font-bold">+1,000 coins</div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Profil mis à jour</p>
                        <p className="text-sm text-base-content/70">Il y a 1 jour</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
                      <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center">
                        <Coins className="w-5 h-5 text-error" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Achat jeu Mobile Legends</p>
                        <p className="text-sm text-base-content/70">Il y a 3 jours</p>
                      </div>
                      <div className="text-error font-bold">-50 coins</div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
